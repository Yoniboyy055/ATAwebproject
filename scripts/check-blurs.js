const fs = require('fs')
const path = require('path')

const IMAGES_DIR = path.join(process.cwd(), 'public', 'images')
const BLUR_JSON = path.join(IMAGES_DIR, 'blur.json')

function parseName(filename) {
  const ext = path.extname(filename)
  const name = path.basename(filename, ext)
  const m = name.match(/^(.*)-(\d+)$/)
  if (m) return { base: m[1], width: parseInt(m[2], 10), ext }
  return { base: name, width: null, ext }
}

const ALLOWED_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.svg'])

function listImageBases() {
  if (!fs.existsSync(IMAGES_DIR)) return []
  const names = fs.readdirSync(IMAGES_DIR).filter(n => !n.startsWith('.') && ALLOWED_EXT.has(path.extname(n).toLowerCase()))
  const bases = new Set(names.map(n => parseName(n).base))
  return Array.from(bases)
}

function readBlurMap() {
  if (!fs.existsSync(BLUR_JSON)) return {}
  try {
    return JSON.parse(fs.readFileSync(BLUR_JSON, 'utf8'))
  } catch (err) {
    console.error('Failed to parse blur.json:', err.message)
    process.exit(2)
  }
}

function main() {
  const bases = listImageBases()
  const blurMap = readBlurMap()
  const missing = bases.filter(b => !Object.prototype.hasOwnProperty.call(blurMap, b))
  if (missing.length > 0) {
    console.error('\nError: Missing blur placeholders for images. The build will fail if you use `placeholder=\'blur\'` without a matching blurDataURL.')
    console.error('Missing bases in public/images/blur.json:')
    missing.forEach(m => console.error('  -', m))
    console.error('\nRun `npm run images:optimize` to generate AVIF/WebP sizes and blur.json (this will also create tiny blur placeholders).')
    process.exit(1)
  }

  // New stricter check: ensure blur placeholders are not SVG fallbacks (prefer webp/avif buffers)
  const svgEntries = Object.entries(blurMap).filter(([k,v]) => typeof v === 'string' && v.startsWith('data:image/svg+xml'))
  if (svgEntries.length > 0) {
    console.error('\nError: Found SVG fallback blur placeholders for the following images. For consistent blur quality, replace source images with raster assets (JPEG/PNG/WebP) and re-run `npm run images:optimize` to get proper WebP/AVIF blur placeholders:')
    svgEntries.forEach(([k]) => console.error('  -', k))
    console.error('\nIf you intentionally want to allow SVG fallbacks, remove or modify this check in scripts/check-blurs.js')
    process.exit(1)
  }

  console.log('OK: Found blur placeholders for all image bases in public/images')
}

main()
