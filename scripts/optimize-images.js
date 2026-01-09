const fs = require('fs').promises
const path = require('path')
const sharp = require('sharp')

const IMAGES_DIR = path.join(__dirname, '..', 'public', 'images')
const OUTPUT_FORMATS = ['avif', 'webp']
const TARGET_WIDTHS = [400, 800, 1200, 1600]
const BLUR_WIDTH = 16
const QUALITY = { avif: 50, webp: 70 }
const ALLOWED_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.svg'])

async function listFiles() {
  const names = await fs.readdir(IMAGES_DIR)
  // filter out dotfiles and non-image files (like blur.json)
  return names.filter(n => !n.startsWith('.') && ALLOWED_EXT.has(path.extname(n).toLowerCase()))
}

function parseName(filename) {
  const ext = path.extname(filename)
  const name = path.basename(filename, ext)
  const m = name.match(/^(.*)-(\d+)$/)
  if (m) return { base: m[1], width: parseInt(m[2], 10), ext }
  return { base: name, width: null, ext }
}

function pickCandidatesForBase(base, files) {
  const candidates = files.filter(f => parseName(f).base === base)
  // Prefer raster candidates with explicit widths (largest first)
  const withWidths = candidates.map(f => ({ f, parsed: parseName(f) })).filter(x => x.parsed.width).sort((a, b) => b.parsed.width - a.parsed.width).map(x => x.f)
  const svg = candidates.find(c => c.endsWith('.svg'))
  const others = candidates.filter(c => !withWidths.includes(c) && c !== svg)
  return [...withWidths, ...(svg ? [svg] : []), ...others].map(f => path.join(IMAGES_DIR, f))
}

async function generateForBase(base, sourcePath) {
  const produced = []
  let blur = undefined
  try {
    const metadata = await sharp(sourcePath).metadata().catch(() => ({}))
    const srcWidth = metadata.width || null

    for (const w of TARGET_WIDTHS) {
      if (srcWidth && srcWidth < w) continue // avoid upscaling
      for (const fmt of OUTPUT_FORMATS) {
        const outName = `${base}-${w}.${fmt}`
        const outPath = path.join(IMAGES_DIR, outName)
        const pipeline = sharp(sourcePath).resize({ width: w, withoutEnlargement: true })
        if (fmt === 'avif') pipeline.avif({ quality: QUALITY.avif })
        if (fmt === 'webp') pipeline.webp({ quality: QUALITY.webp })
        await pipeline.toFile(outPath)
        produced.push(outName)
        console.log(`wrote ${outName}`)
      }
    }

    // create blur placeholder (tiny webp)
    const blurBuffer = await sharp(sourcePath).resize({ width: BLUR_WIDTH }).webp({ quality: 40 }).toBuffer()
    blur = `data:image/webp;base64,${blurBuffer.toString('base64')}`
  } catch (err) {
    // Fallback: create a tiny SVG blur placeholder when sharp fails for this source (this is only used for blur)
    console.warn(`Warning: failed to process ${path.basename(sourcePath)}: ${err.message}. Using inline SVG placeholder for blur.`)
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6'><rect width='100%' height='100%' fill='%23e6f8f2'/></svg>`
    blur = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
  }

  return { produced, blur }
}

async function main() {
  console.log('Scanning images in', IMAGES_DIR)
  const files = await listFiles()

  // Build set of bases
  const bases = new Set(files.map(f => parseName(f).base))
  const blurMap = {}

  for (const base of bases) {
    const sources = pickCandidatesForBase(base, files)
    let done = false
    for (const source of sources) {
      try {
        // Quick check if sharp can read the source
        await sharp(source).metadata()
      } catch (err) {
        console.warn(`Skipping candidate ${path.basename(source)}: ${err.message}`)
        continue
      }

      try {
        console.log(`Processing ${base} from ${path.basename(source)}`)
        const { produced, blur } = await generateForBase(base, source)
        blurMap[base] = blur
        if (produced.length === 0) console.log(`No sizes produced for ${base} (source too small or conversion skipped)`) 
        done = true
        break
      } catch (err) {
        console.error(`Failed processing ${base} from ${path.basename(source)}:`, err.message)
        continue
      }
    }

    if (!done) {
      // As a fallback, still ensure we have a blur placeholder
      console.warn(`No suitable raster source found for ${base}; using inline SVG blur placeholder.`)
      const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6'><rect width='100%' height='100%' fill='%23e6f8f2'/></svg>`
      blurMap[base] = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
    }
  }

  // If any blur entries are inline SVG placeholders, convert them to tiny WebP buffers for more consistent blur fidelity
  for (const [base, val] of Object.entries(blurMap)) {
    if (typeof val === 'string' && val.startsWith('data:image/svg+xml')) {
      try {
        // extract svg (may be percent-encoded)
        const parts = val.split(',')
        const svgPart = parts.slice(1).join(',')
        const svg = decodeURIComponent(svgPart)
        const webpBuf = await sharp(Buffer.from(svg)).resize({ width: BLUR_WIDTH }).webp({ quality: 40 }).toBuffer()
        blurMap[base] = `data:image/webp;base64,${webpBuf.toString('base64')}`
        console.log(`Converted SVG placeholder to webp for ${base}`)
      } catch (err) {
        console.warn(`Failed to convert SVG placeholder for ${base}: ${err.message}`)
      }
    }
  }

  await fs.writeFile(path.join(IMAGES_DIR, 'blur.json'), JSON.stringify(blurMap, null, 2))
  console.log('Wrote blur.json with keys:', Object.keys(blurMap))
  console.log('Done. Run `npm run images:optimize` to regenerate assets.')
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
