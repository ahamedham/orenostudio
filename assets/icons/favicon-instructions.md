# Favicon & App Icon Generation

Your site currently references the following icon files from every HTML `<head>` and from `site.webmanifest`. None of them exist on the server yet — this is what causes the 404s in browser devtools.

## Required files (place them all in `/assets/icons/`)

| File | Size | Purpose |
|---|---|---|
| `favicon.ico`           | 32×32 multi-res   | Legacy browser tab icon |
| `favicon-16.png`        | 16×16             | Modern browser tab icon (small) |
| `favicon-32.png`        | 32×32             | Modern browser tab icon (retina) |
| `apple-touch-icon.png`  | 180×180           | iOS home-screen icon |
| `icon-192.png`          | 192×192           | PWA / Android home-screen |
| `icon-512.png`          | 512×512           | PWA splash / Android high-density |
| `icon-maskable-512.png` | 512×512           | PWA maskable (safe zone) |

Source art: use `assets/SVG/white_O.svg` on a `#050505` background square.

## Quick generation (any one of these)

**Option A — realfavicongenerator.net (recommended)**
1. Go to https://realfavicongenerator.net
2. Upload `assets/SVG/white_O.svg`
3. For iOS: background color `#050505`, margin 16px
4. For Android: background `#050505`, theme color `#050505`
5. For Windows: background `#050505`
6. Download the pack, extract all PNG/ICO files into `/assets/icons/`

**Option B — ImageMagick (local)**
```bash
cd assets/icons
# from any 512×512 white-on-black PNG source:
magick source-512.png -resize 16x16   favicon-16.png
magick source-512.png -resize 32x32   favicon-32.png
magick source-512.png -resize 180x180 apple-touch-icon.png
magick source-512.png -resize 192x192 icon-192.png
cp source-512.png icon-512.png
# maskable: pad 10% safe zone
magick source-512.png -gravity center -background "#050505" -extent 640x640 -resize 512x512 icon-maskable-512.png
magick source-512.png \( -clone 0 -resize 16x16 \) \( -clone 0 -resize 32x32 \) \( -clone 0 -resize 48x48 \) -delete 0 favicon.ico
```

**Option C — Inkscape + online converter**
1. Export `white_O.svg` to PNG at 512×512 with black background
2. Use https://favicon.io to generate `favicon.ico`
3. Use any image editor to produce the other sizes

## Verification

After uploading, test in browser:
```
https://oreno.lk/assets/icons/favicon.ico        → should return 200
https://oreno.lk/assets/icons/apple-touch-icon.png → should return 200
https://oreno.lk/assets/icons/icon-192.png       → should return 200
https://oreno.lk/assets/icons/icon-512.png       → should return 200
https://oreno.lk/site.webmanifest                → should return 200 application/manifest+json
```

Then run Lighthouse PWA audit — "Installable" should pass once `icon-192` + `icon-512` + manifest + HTTPS are all present.
