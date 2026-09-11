#!/usr/bin/env node

// Genere le PDF imprimable du CV, dans chaque langue.
//
// Le script demarre un serveur Hugo, ouvre les pages CV dans Chromium et
// exporte un PDF A4. Les deux langues sont traitees en parallele.
//
//   node scripts/generate-pdf.js              toutes les pages
//   node scripts/generate-pdf.js --page cv    une seule
//   node scripts/generate-pdf.js --png        + capture PNG (debug visuel)

const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const net = require('net');
const path = require('path');
const { spawn } = require('child_process');
const yargs = require('yargs');
const chalk = require('chalk');
const ora = require('ora');

const CONFIG = {
    hugoPort: 1313,
    get baseUrl() { return `http://localhost:${this.hugoPort}`; },
    // static/images : source suivie par git, recopiee par Hugo au prochain build.
    // public/images : sortie servie, alimentee directement pour eviter un second
    // passage de `hugo --minify` dont c'etait le seul role.
    outputDir: 'static/images',
    publicOutputDir: 'public/images',
    timeout: 30000,

    // Chaque entree produit <name>.pdf dans outputDir et publicOutputDir.
    pages: {
        cv: { url: '/cv', name: 'cv', title: 'CV — Néo Huyghe' },
        cv_en: { url: '/en/cv', name: 'cv-en', title: 'CV — Néo Huyghe (EN)' },
    },
};

// Surcharge d'impression. Le theme orion definit deja `.no-print` et son bloc
// @media print, que page.pdf() applique puisque Chromium emule le media print.
// Ne reste ici que ce que le layout ne peut pas savoir : forcer la hauteur de
// page exacte pour que le contenu ne parte pas sur une seconde feuille.
const PRINT_CSS = `
  html, body {
    height: 297mm;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
`;

/** Attend que le port accepte une connexion, au lieu d'un delai fixe. */
function waitForPort(port, { timeout = 15000, interval = 60 } = {}) {
    const deadline = Date.now() + timeout;

    return new Promise((resolve, reject) => {
        const attempt = () => {
            const socket = net.connect({ port, host: '127.0.0.1' });
            socket.once('connect', () => { socket.destroy(); resolve(); });
            socket.once('error', () => {
                socket.destroy();
                if (Date.now() > deadline) {
                    reject(new Error(`Port ${port} injoignable après ${timeout} ms`));
                } else {
                    setTimeout(attempt, interval);
                }
            });
        };
        attempt();
    });
}

class PDFGenerator {
    constructor({ withPng = false } = {}) {
        this.browser = null;
        this.hugoServer = null;
        this.withPng = withPng;
        this.startedHugo = false;
    }

    async init() {
        await this.ensureOutputDir();
        await this.startHugoServer();

        const spinner = ora('Initialisation du navigateur...').start();
        this.browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        spinner.succeed('Navigateur initialisé');
    }

    async ensureOutputDir() {
        for (const dir of [CONFIG.outputDir, CONFIG.publicOutputDir]) {
            await fs.mkdir(dir, { recursive: true });
        }
    }

    async startHugoServer() {
        const spinner = ora('Démarrage du serveur Hugo...').start();

        // Un serveur deja en ecoute (npm run dev) est reutilise tel quel.
        try {
            await waitForPort(CONFIG.hugoPort, { timeout: 300 });
            spinner.succeed(`Serveur Hugo déjà actif sur le port ${CONFIG.hugoPort}`);
            return;
        } catch {
            // Port libre : on lance notre propre serveur.
        }

        this.hugoServer = spawn('hugo', ['server', '-D', '--port', CONFIG.hugoPort], {
            stdio: ['ignore', 'ignore', 'pipe'],
        });
        this.startedHugo = true;

        let stderr = '';
        this.hugoServer.stderr.on('data', (d) => { stderr += d.toString(); });

        const exited = new Promise((_, reject) => {
            this.hugoServer.once('error', reject);
            this.hugoServer.once('exit', (code) => {
                if (code !== 0) {
                    reject(new Error(`Hugo s'est arrêté (code ${code})\n${stderr.trim()}`));
                }
            });
        });

        try {
            await Promise.race([waitForPort(CONFIG.hugoPort), exited]);
            spinner.succeed(`Serveur Hugo démarré sur le port ${CONFIG.hugoPort}`);
        } catch (error) {
            spinner.fail('Échec du démarrage de Hugo');
            throw error;
        }
    }

    /** Charge la page, polices comprises, et renvoie l'onglet pret a exporter. */
    async openPage(pageConfig) {
        const page = await this.browser.newPage();
        await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 1 });

        // La page CV n'a aucune ressource externe : `load` suffit et evite les
        // 500 ms d'inactivite reseau qu'impose networkidle0.
        await page.goto(`${CONFIG.baseUrl}${pageConfig.url}`, {
            waitUntil: 'load',
            timeout: CONFIG.timeout,
        });

        await page.addStyleTag({ content: PRINT_CSS });

        // Les webfonts doivent etre pretes AVANT l'export : avec la police de
        // repli, le texte se rompt differemment et deborde de l'A4.
        await page.evaluate(() => document.fonts.ready);

        return page;
    }

    async generate(pageConfig) {
        const spinner = ora(`${pageConfig.title}...`).start();
        const page = await this.openPage(pageConfig);

        try {
            const pdfPath = path.join(CONFIG.outputDir, `${pageConfig.name}.pdf`);
            await page.pdf({
                path: pdfPath,
                format: 'A4',
                printBackground: true,
                preferCSSPageSize: true,
                scale: 0.90,
                margin: { top: 0, right: 0, bottom: 0, left: 0 },
            });
            await fs.copyFile(pdfPath, path.join(CONFIG.publicOutputDir, `${pageConfig.name}.pdf`));

            const written = [`${pageConfig.name}.pdf`];

            // Les PNG ne sont references par aucun layout : ils ne sont produits
            // que sur demande explicite, pour verifier un rendu a l'oeil.
            if (this.withPng) {
                const pngPath = path.join(CONFIG.outputDir, `${pageConfig.name}.png`);
                await page.screenshot({ path: pngPath, fullPage: true, type: 'png' });
                await fs.copyFile(pngPath, path.join(CONFIG.publicOutputDir, `${pageConfig.name}.png`));
                written.push(`${pageConfig.name}.png`);
            }

            const { size } = await fs.stat(pdfPath);
            spinner.succeed(`${written.join(' + ')} — ${(size / 1024).toFixed(0)} Ko`);
        } catch (error) {
            spinner.fail(`Échec : ${pageConfig.title}`);
            throw error;
        } finally {
            await page.close();
        }
    }

    /** Les langues sont independantes : un onglet chacune, en parallele. */
    async generateAll() {
        const entries = Object.values(CONFIG.pages);
        console.log(chalk.cyan(`\n${entries.length} document(s) à générer\n`));
        await Promise.all(entries.map((c) => this.generate(c)));
    }

    async generateSingle(pageKey) {
        const pageConfig = CONFIG.pages[pageKey];
        if (!pageConfig) {
            throw new Error(
                `Page "${pageKey}" inconnue. Disponibles : ${Object.keys(CONFIG.pages).join(', ')}`
            );
        }
        console.log(chalk.cyan(`\n${pageConfig.title}\n`));
        await this.generate(pageConfig);
    }

    async cleanup() {
        if (this.browser) {
            await this.browser.close().catch(() => {});
            this.browser = null;
        }
        // On ne tue que le serveur qu'on a demarre : un `npm run dev` deja en
        // cours doit survivre au script.
        if (this.startedHugo && this.hugoServer && !this.hugoServer.killed) {
            this.hugoServer.kill('SIGTERM');
            console.log(chalk.gray('Serveur Hugo arrêté'));
        }
    }
}

const argv = yargs
    .option('page', { alias: 'p', type: 'string', describe: 'Générer une seule page' })
    .option('png', { type: 'boolean', default: false, describe: 'Produire aussi un PNG (debug)' })
    .help()
    .argv;

let generator;

async function main() {
    const started = Date.now();
    generator = new PDFGenerator({ withPng: argv.png });

    try {
        await generator.init();
        if (argv.page) {
            await generator.generateSingle(argv.page);
        } else {
            await generator.generateAll();
        }
        console.log(chalk.green(`\n✓ Terminé en ${((Date.now() - started) / 1000).toFixed(1)} s`));
    } catch (error) {
        console.error(chalk.red(`\n✗ ${error.message}`));
        process.exitCode = 1;
    } finally {
        await generator.cleanup();
    }
}

for (const signal of ['SIGINT', 'SIGTERM']) {
    process.on(signal, async () => {
        if (generator) await generator.cleanup();
        process.exit(130);
    });
}

main();
