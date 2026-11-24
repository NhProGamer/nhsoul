#!/usr/bin/env node

// Prints each CV page of the built site (public/) to an A4 PDF.
//
// Runs after `hugo --minify`: the built files are served over a local
// HTTP server and printed by headless Chromium. No dependency: Node's
// http module and the Chromium binary are enough.
//
//   node scripts/generate-pdf.js
//
// CHROMIUM_PATH overrides the browser binary.

const http = require('http');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFile } = require('child_process');

const ROOT = path.resolve(__dirname, '..', 'public');

// Each entry prints `url` to public/<out>.
const PAGES = [
    { url: '/cv/', out: 'images/cv.pdf' },
    { url: '/en/cv/', out: 'images/cv-en.pdf' },
];

const TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.woff2': 'font/woff2',
    '.webp': 'image/webp',
    '.jpg': 'image/jpeg',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
};

function findChromium() {
    const candidates = [
        process.env.CHROMIUM_PATH,
        '/usr/bin/chromium-browser',
        '/usr/bin/chromium',
        '/usr/bin/google-chrome',
    ];
    const found = candidates.find((p) => p && fs.existsSync(p));
    if (!found) throw new Error('Chromium not found: set CHROMIUM_PATH');
    return found;
}

function serve(root) {
    const server = http.createServer((req, res) => {
        let file = path.join(root, decodeURIComponent(new URL(req.url, 'http://x').pathname));
        // Never serve outside public/, even on a crafted "../" path.
        if (!file.startsWith(root + path.sep) && file !== root) {
            res.writeHead(403).end();
            return;
        }
        if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
        fs.readFile(file, (err, data) => {
            if (err) {
                res.writeHead(404).end();
                return;
            }
            res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
            res.end(data);
        });
    });
    return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve(server)));
}

function print(chromium, url, out) {
    // Parallel runs sharing the default profile abort on its lock file.
    const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'cv-chromium-'));
    const args = [
        '--headless',
        `--user-data-dir=${profile}`,
        '--disable-gpu',
        '--no-pdf-header-footer',
        // Lets web fonts and images load before printing.
        '--virtual-time-budget=10000',
        `--print-to-pdf=${out}`,
        url,
    ];
    // Chromium refuses to run as root with its sandbox on, as in the Docker build.
    if (process.getuid && process.getuid() === 0) args.unshift('--no-sandbox');
    return new Promise((resolve, reject) => {
        execFile(chromium, args, { timeout: 60000 }, (err, _stdout, stderr) => {
            fs.rmSync(profile, { recursive: true, force: true });
            if (err) reject(new Error(`${url}: ${err.message}\n${stderr}`));
            else resolve();
        });
    });
}

// Chromium writes one "/Type /Page" object per page, uncompressed.
function countPages(file) {
    return (fs.readFileSync(file, 'latin1').match(/\/Type\s*\/Page(?!s)/g) || []).length;
}

async function main() {
    if (!fs.existsSync(ROOT)) throw new Error('public/ not found: run hugo first');
    const chromium = findChromium();
    const server = await serve(ROOT);
    const base = `http://127.0.0.1:${server.address().port}`;
    try {
        await Promise.all(PAGES.map(async ({ url, out }) => {
            const file = path.join(ROOT, out);
            fs.mkdirSync(path.dirname(file), { recursive: true });
            await print(chromium, base + url, file);
            const pages = countPages(file);
            // The CV is designed for one sheet: a second page means content overflowed.
            if (pages !== 1) throw new Error(`${out}: ${pages} pages, expected 1`);
            console.log(`${out}: ${Math.round(fs.statSync(file).size / 1024)} KB`);
        }));
    } finally {
        server.close();
    }
}

main().catch((err) => {
    console.error(err.message);
    process.exit(1);
});
