const fs = require('fs').promises
const path = require('path')

const IMAGES_DIR = path.join(__dirname, '..', 'public', 'images')
const OUTPUT_FORMATS = ['avif', 'webp']
const TARGET_WIDTHS = [400, 800, 1200, 1600]

async function listFiles() {
  const names = await fs.readdir(IMAGES_DIR)
  return names.filter(n => !n.startsWith('.'))
}

function parseName(filename) {
  const ext = path.extname(filename)
  const name = path.basename(filename, ext)
  const m = name.match(/^(.*)-(\d+)$/)
  if (m) return { base: m[1], width: parseInt(m[2], 10), ext }
  return { base: name, width: null, ext }
}

async function pickSourceForBase(base, files) {
  let candidates = files.filter(f => parseName(f).base === base)
  if (candidates.length === 0) return null
  let withWidths = candidates.map(f => ({ f, parsed: parseName(f) })).filter(x => x.parsed.width)
  if (withWidths.length) {
    withWidths.sort((a, b) => b.parsed.width - a.parsed.width)
    return withWidths[0].f
  }
  const svg = candidates.find(c => c.endsWith('.svg'))
  return svg || candidates[0]
}

async function main() {
  console.log('Dry run: scanning images in', IMAGES_DIR)
  const files = await listFiles()
  const bases = new Set(files.map(f => parseName(f).base))
  for (const base of bases) {
    const source = await pickSourceForBase(base, files)
    if (!source) continue
    console.log(`\nBase: ${base}  (source: ${source})`)
    for (const w of TARGET_WIDTHS) {
      console.log(`  would produce:`)
      for (const fmt of OUTPUT_FORMATS) {
        console.log(`    - ${base}-${w}.${fmt}`)
      }
    }
  }
  console.log('\nDry run complete. No files changed.')
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})