const fs = require('fs')
const path = require('path')

const IMAGES_DIR = path.join(process.cwd(), 'public', 'images')
const REQUIRED_WIDTHS = [400, 800]
const REQUIRED_FORMATS = ['.avif', '.webp']
const ALLOWED_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.svg'])

function parseName(filename) {
  const ext = path.extname(filename)
  const name = path.basename(filename, ext)
  const m = name.match(/^(.*)-(\d+)$/)
  if (m) return { base: m[1], width: parseInt(m[2], 10), ext }
  return { base: name, width: null, ext }
}

function listImageBases() {
  if (!fs.existsSync(IMAGES_DIR)) return []
  const names = fs.readdirSync(IMAGES_DIR).filter(n => !n.startsWith('.') && ALLOWED_EXT.has(path.extname(n).toLowerCase()))
  const bases = new Set(names.map(n => parseName(n).base))
  return Array.from(bases)
}

function hasVariant(base, width) {
  for (const fmt of REQUIRED_FORMATS) {
    const name = `${base}-${width}${fmt}`
    if (fs.existsSync(path.join(IMAGES_DIR, name))) return true
  }
  return false
}

function main() {
  const bases = listImageBases()
  const missing = {}

  for (const base of bases) {
    const bad = []
    for (const w of REQUIRED_WIDTHS) {
      if (!hasVariant(base, w)) bad.push(w)
    }
    if (bad.length) missing[base] = bad
  }

  if (Object.keys(missing).length > 0) {
    console.error('\nError: Missing AVIF/WebP variants for one or more image bases. CI will fail until these are added.')
    Object.entries(missing).forEach(([b, widths]) => {
      console.error(`  - ${b}: missing widths ${widths.join(', ')}`)
    })
    console.error('\nRecommend: add raster source files and run `npm run images:optimize` to generate `-400.avif`, `-400.webp`, `-800.avif`, and `-800.webp` variants.')
    process.exit(1)
  }

  console.log('OK: All image bases have required AVIF/WebP variants for widths', REQUIRED_WIDTHS)
}

main()
