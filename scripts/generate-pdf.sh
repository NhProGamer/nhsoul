#!/bin/sh
# Prints each CV page of the built site (public/) to an A4 PDF.
#
# Runs after `hugo --minify`: public/ is served over a local HTTP server
# (the CSS uses root-relative URLs, so file:// would not load it) and
# headless Chromium prints each CV. The build fails if a CV no longer
# fits on one page.
#
#   sh scripts/generate-pdf.sh
#
# CHROMIUM_PATH overrides the browser binary, PDF_PORT the local port.

set -eu
cd "$(dirname "$0")/.."

fail() { echo "generate-pdf: $*" >&2; exit 1; }

[ -d public ] || fail "public/ not found: run hugo first"

chromium=${CHROMIUM_PATH:-}
if [ -z "$chromium" ]; then
    for c in chromium-browser chromium google-chrome; do
        if command -v "$c" >/dev/null 2>&1; then chromium=$(command -v "$c"); break; fi
    done
fi
[ -n "$chromium" ] || fail "Chromium not found: set CHROMIUM_PATH"

port=${PDF_PORT:-41213}
base="http://127.0.0.1:$port"

# busybox-extras httpd in the Docker build, python3 on a workstation.
if command -v busybox-extras >/dev/null 2>&1; then
    busybox-extras httpd -f -p "127.0.0.1:$port" -h public &
elif command -v python3 >/dev/null 2>&1; then
    python3 -m http.server "$port" --bind 127.0.0.1 --directory public >/dev/null 2>&1 &
else
    fail "no HTTP server: install busybox-extras or python3"
fi
server=$!
trap 'kill "$server" 2>/dev/null' EXIT

# Wait for the server rather than sleeping a fixed time.
tries=0
until wget -q -O /dev/null "$base/" 2>/dev/null || curl -sf -o /dev/null "$base/" 2>/dev/null; do
    tries=$((tries + 1))
    [ "$tries" -lt 50 ] || fail "server did not start on port $port"
    sleep 0.1
done

# Chromium refuses to run as root with its sandbox on, as in the Docker build.
sandbox=
[ "$(id -u)" -ne 0 ] || sandbox=--no-sandbox

print() {
    url=$1 out=public/$2
    mkdir -p "$(dirname "$out")"
    # --virtual-time-budget lets web fonts and images load before printing.
    timeout 60 "$chromium" --headless $sandbox --disable-gpu --no-pdf-header-footer \
        --virtual-time-budget=10000 --print-to-pdf="$out" "$base$url" \
        </dev/null >/dev/null 2>&1 || fail "$url: Chromium failed"

    # Chromium writes one uncompressed "/Type /Page" object per page;
    # "/Type /Pages" is the page tree, so it is counted and taken out.
    pages=$(( $(grep -ao '/Type */Page' "$out" | wc -l) - $(grep -ao '/Type */Pages' "$out" | wc -l) ))
    [ "$pages" -eq 1 ] || fail "$2: $pages pages, expected 1"
    echo "$2: $(du -k "$out" | cut -f1) KB"
}

# One after the other: two Chromium runs sharing the default profile
# abort on its lock file, and a fresh profile per run hangs on some
# desktops. Sequential costs about a second.
print /cv/ images/cv.pdf
print /en/cv/ images/cv-en.pdf
