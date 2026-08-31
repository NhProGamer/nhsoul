#!/usr/bin/env node

const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');
const { spawn } = require('child_process');
const yargs = require('yargs');
const chalk = require('chalk');
const ora = require('ora');

// Configuration
const CONFIG = {
    hugoPort: 1313,
    baseUrl: 'http://localhost:1313',
    outputDir: 'static/images',
    publicDir: 'public',
    timeout: 30000,

    // Pages à capturer
    pages: {
        cv: {
            url: '/cv',
            filename: 'cv.png',
            title: 'CV - Néo Huyghe'
        },
        cv_en: {
            url: '/en/cv',
            filename: 'cv-en.png',
            title: 'CV - Néo Huyghe'
        },
    },
};

class PDFGenerator {
    constructor() {
        this.browser = null;
        this.hugoServer = null;
        this.spinner = null;
    }

    async init() {
        await this.ensureOutputDir();

        await this.startHugoServer();

        this.spinner = ora('Initialisation du navigateur...').start();
        this.browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        this.spinner.succeed('Navigateur initialisé');
    }

    async ensureOutputDir() {
        const dirs = [CONFIG.outputDir, path.join(CONFIG.publicDir, 'pdf')];

        for (const dir of dirs) {
            try {
                await fs.access(dir);
            } catch {
                await fs.mkdir(dir, { recursive: true });
                console.log(chalk.green(`✓ Dossier créé: ${dir}`));
            }
        }
    }

    async startHugoServer() {
        return new Promise((resolve, reject) => {
            this.spinner = ora('Démarrage du serveur Hugo...').start();

            this.hugoServer = spawn('hugo', ['server', '-D', '--port', CONFIG.hugoPort], {
                stdio: 'pipe'
            });

            this.hugoServer.stdout.on('data', (data) => {
                const output = data.toString();
                if (output.includes('Web Server is available')) {
                    this.spinner.succeed(`Serveur Hugo démarré sur le port ${CONFIG.hugoPort}`);
                    setTimeout(resolve, 1000);
                }
            });

            this.hugoServer.stderr.on('data', (data) => {
                const error = data.toString();
                if (error.includes('port already in use')) {
                    this.spinner.succeed('Serveur Hugo déjà en cours d\'exécution');
                    resolve();
                } else if (!error.includes('WARN')) {
                    console.log(chalk.yellow('Hugo:', error.trim()));
                }
            });

            this.hugoServer.on('error', (error) => {
                this.spinner.fail('Erreur lors du démarrage de Hugo');
                reject(error);
            });

            setTimeout(() => {
                if (this.spinner.isSpinning) {
                    this.spinner.warn('Timeout Hugo - on continue quand même');
                    resolve();
                }
            }, 10000);
        });
    }

    async generateScreenshot(pageKey, pageConfig) {
        const page = await this.browser.newPage();

        try {
            this.spinner = ora(`Capture de ${pageConfig.title}...`).start();

            await page.setViewport({
                width: 794,
                height: 1123,
                deviceScaleFactor: 1
            });

            const url = `${CONFIG.baseUrl}${pageConfig.url}`;
            await page.goto(url, {
                waitUntil: 'networkidle0',
                timeout: CONFIG.timeout
            });

            await page.waitForSelector('body', { timeout: 5000 });

            await page.addStyleTag({
                content: `
        .no-print {
            display: none !important;
            visibility: hidden !important;
        }
      
        :root {
            --color-background: #ffffff;       /* fond blanc pour l'impression */
            --color-surface: #f1f5f9;          /* gris très clair pour les surfaces */
            --color-primary: #0ea5e9;          /* bleu clair lisible sur fond clair */
            --color-primary-dark: #0369a1;     /* bleu plus soutenu */
            --color-secondary: #6366f1;        /* violet doux */
            --color-accent: #d946ef;           /* rose-violet marqué mais pas trop saturé */
            --color-text-primary: #1e293b;     /* gris anthracite pour le texte */
            --color-text-secondary: #475569;   /* gris moyen pour le secondaire */
            --color-code-bg: #f8fafc;          /* fond clair pour le code */
            --color-code-text: #1e293b;        /* texte de code sombre */
            --color-code-comment: #64748b;     /* gris bleuté pour les commentaires */
            --color-code-keyword: #0ea5e9;     /* bleu clair */
            --color-code-string: #16a34a;      /* vert moyen pour les chaînes */
            --color-code-number: #db2777;      /* rose soutenu pour les nombres */
        }
    `
            });

            // Les webfonts (Inter) doivent etre chargees AVANT la capture : avec la
            // police de repli, le texte se rompt differemment et deborde de l'A4.
            // networkidle0 ne suffit pas, il peut se declencher polices non pretes.
            await page.evaluate(() => document.fonts.ready);

            const screenshotBuffer = await page.screenshot({
                fullPage: true,
                type: 'png',
                preferCSSPageSize: true
            });

            const outputPath = path.join(CONFIG.outputDir, pageConfig.filename);
            await fs.writeFile(outputPath, screenshotBuffer);

            const publicPath = path.join(CONFIG.publicDir, 'pdf', pageConfig.filename);
            await fs.writeFile(publicPath, screenshotBuffer);

            this.spinner.succeed(`✓ Capture générée: ${pageConfig.filename}`);
            console.log(chalk.blue(`  📁 Sauvegardé dans: ${outputPath}`));
            console.log(chalk.blue(`  🌐 Disponible sur: ${CONFIG.baseUrl}/pdf/${pageConfig.filename}`));

        } catch (error) {
            this.spinner.fail(`❌ Erreur pour ${pageConfig.title}`);
            console.error(chalk.red(error.message));
            throw error;
        } finally {
            await page.close();
        }
    }

    async generatePDF(pageKey, pageConfig) {
        const page = await this.browser.newPage();

        try {
            this.spinner = ora(`Génération PDF de ${pageConfig.title}...`).start();

            // Viewport correspondant à A4 à 96 DPI
            await page.setViewport({
                width: 794,
                height: 1123,
                deviceScaleFactor: 1
            });

            const url = `${CONFIG.baseUrl}${pageConfig.url}`;
            await page.goto(url, {
                waitUntil: 'networkidle0',
                timeout: CONFIG.timeout
            });

            await page.waitForSelector('body', { timeout: 5000 });

            // Injection CSS pour impression
            await page.addStyleTag({
                content: `
                .no-print {
                    display: none !important;
                    visibility: hidden !important;
                }

                html, body {
                    height: 297mm;
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }

                :root {
                    --color-background: #ffffff;
                    --color-surface: #f1f5f9;
                    --color-primary: #0ea5e9;
                    --color-primary-dark: #0369a1;
                    --color-secondary: #6366f1;
                    --color-accent: #d946ef;
                    --color-text-primary: #1e293b;
                    --color-text-secondary: #475569;
                }

                body {
                    background: var(--color-background);
                    color: var(--color-text-primary);
                }
            `
            });

            // Idem capture : sans polices pretes, la mise en page deborde sur 2 pages.
            await page.evaluate(() => document.fonts.ready);

            // Génération PDF
            const outputPath = path.join(CONFIG.outputDir, pageConfig.filename.replace(/\.png$/, '.pdf'));
            await page.pdf({
                path: outputPath,
                format: 'A4',
                printBackground: true,
                preferCSSPageSize: true,
                scale: 0.90,
                margin: { top: 0, right: 0, bottom: 0, left: 0 }
            });

            const publicPath = path.join(CONFIG.publicDir, 'pdf', pageConfig.filename.replace(/\.png$/, '.pdf'));
            await fs.copyFile(outputPath, publicPath);

            this.spinner.succeed(`✓ PDF généré: ${pageConfig.filename.replace(/\.png$/, '.pdf')}`);
            console.log(chalk.blue(`  📁 Sauvegardé dans: ${outputPath}`));
            console.log(chalk.blue(`  🌐 Disponible sur: ${CONFIG.baseUrl}/pdf/${pageConfig.filename.replace(/\.png$/, '.pdf')}`));

        } catch (error) {
            this.spinner.fail(`❌ Erreur pour ${pageConfig.title}`);
            console.error(chalk.red(error.message));
            throw error;
        } finally {
            await page.close();
        }
    }



    async generateAll() {
        const pageKeys = Object.keys(CONFIG.pages);
        console.log(chalk.cyan(`\n📄 Génération de ${pageKeys.length} capture(s)...\n`));

        for (const [key, config] of Object.entries(CONFIG.pages)) {
            await this.generateScreenshot(key, config);
            await this.generatePDF(key, config);
        }
    }

    async generateSingle(pageKey) {
        const pageConfig = CONFIG.pages[pageKey];
        if (!pageConfig) {
            throw new Error(`Page "${pageKey}" non trouvée. Pages disponibles: ${Object.keys(CONFIG.pages).join(', ')}`);
        }

        console.log(chalk.cyan(`\n📄 Génération pour: ${pageConfig.title}\n`));
        //await this.generateScreenshot(pageKey, pageConfig);
        await this.generatePDF(pageKey, pageConfig);
    }

    async cleanup() {
        if (this.browser) {
            await this.browser.close();
        }

        if (this.hugoServer && !this.hugoServer.killed) {
            this.hugoServer.kill('SIGTERM');
            console.log(chalk.gray('Serveur Hugo arrêté'));
        }
    }
}

// CLI
const argv = yargs
    .option('page', {
        alias: 'p',
        description: 'Générer la capture pour une page spécifique',
        type: 'string'
    })
    .option('all', {
        alias: 'a',
        description: 'Générer toutes les captures',
        type: 'boolean'
    })
    .help()
    .argv;

// Fonction principale
async function main() {
    const generator = new PDFGenerator();

    try {
        await generator.init();

        if (argv.page) {
            await generator.generateSingle(argv.page);
        } else {
            await generator.generateAll();
        }

        console.log(chalk.green('\n✅ Génération terminée avec succès!\n'));

    } catch (error) {
        console.error(chalk.red('\n❌ Erreur lors de la génération:'));
        console.error(chalk.red(error.message));
        process.exit(1);
    } finally {
        await generator.cleanup();
    }
}

process.on('SIGINT', async () => {
    console.log(chalk.yellow('\n⚠️  Interruption détectée, nettoyage...'));
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log(chalk.yellow('\n⚠️  Arrêt demandé, nettoyage...'));
    process.exit(0);
});

if (require.main === module) {
    main();
}

module.exports = PDFGenerator;
