const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

const IMAGES_DIR = path.join(process.cwd(), 'public', 'images')
const REQUIRED_WIDTHS = [400, 800]
const REQUIRED_FORMATS = ['.avif', '.webp']
const TARGET_QUALITY = { avif: 50, webp: 70 }
const PLACEHOLDER_WIDTH = 1600

function parseName(filename) {
  const ext = path.extname(filename)
  const name = path.basename(filename, ext)
  const m = name.match(/^(.*)-(\d+)$/)
  if (m) return { base: m[1], width: parseInt(m[2], 10), ext }
  return { base: name, width: null, ext }
}

function listFiles() {
  if (!fs.existsSync(IMAGES_DIR)) return []
  return fs.readdirSync(IMAGES_DIR).filter(n => !n.startsWith('.') && !n.endsWith('blur.json'))
}

function basesFromFiles(files) {
  const s = new Set(files.map(f => parseName(f).base))
  return Array.from(s)
}

function hasVariant(base, width) {
  for (const fmt of REQUIRED_FORMATS) {
    const name = `${base}-${width}${fmt}`
    if (fs.existsSync(path.join(IMAGES_DIR, name))) return true
  }
  return false
}

function candidatesForBase(base, files) {
  const candidates = files.filter(f => parseName(f).base === base)
  // prefer explicit-width raster candidates first
  const withWidths = candidates.map(f => ({ f, parsed: parseName(f) })).filter(x => x.parsed.width).sort((a,b)=>b.parsed.width - a.parsed.width).map(x=>x.f)
  const svg = candidates.find(c=>c.endsWith('.svg'))
  const others = candidates.filter(c=>!withWidths.includes(c) && c!==svg)
  return [...withWidths, ...(svg? [svg] : []), ...others].map(f => path.join(IMAGES_DIR, f))
}

async function createPlaceholderSvg(base) {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${PLACEHOLDER_WIDTH}' height='900'>
    <rect width='100%' height='100%' fill='%23e6f8f2'/>
    <text x='50%' y='50%' font-size='64' fill='%230f4c5c' text-anchor='middle' dominant-baseline='middle' font-family='system-ui, -apple-system, Roboto, Arial, sans-serif'>${base}</text>
  </svg>`
  return svg
}

async function renderSvgToPng(svg, outPath) {
  const buf = Buffer.from(svg)
  await sharp(buf).resize({ width: PLACEHOLDER_WIDTH }).png().toFile(outPath)
}

async function generateVariantsFromSource(base, sourcePath) {
  const produced = []
  try {
    const meta = await sharp(sourcePath).metadata().catch(()=>({}))
    const srcWidth = meta.width || PLACEHOLDER_WIDTH
    for (const w of REQUIRED_WIDTHS) {
      if (srcWidth && srcWidth < w) continue
      const pngBuf = await sharp(sourcePath).resize({ width: w, withoutEnlargement: true }).png().toBuffer()
      const avifName = `${base}-${w}.avif`
      const webpName = `${base}-${w}.webp`
      await sharp(pngBuf).avif({ quality: TARGET_QUALITY.avif }).toFile(path.join(IMAGES_DIR, avifName))
      await sharp(pngBuf).webp({ quality: TARGET_QUALITY.webp }).toFile(path.join(IMAGES_DIR, webpName))
      produced.push(avifName, webpName)
      console.log(`generated ${avifName} and ${webpName}`)
    }
    // generate tiny blur
    const blurBuf = await sharp(sourcePath).resize({ width: 16 }).webp({ quality: 40 }).toBuffer()
    return { produced, blur: `data:image/webp;base64,${blurBuf.toString('base64')}` }
  } catch (err) {
    console.warn(`generateVariantsFromSource failed for ${base} from ${sourcePath}: ${err.message}`)
    return { produced, blur: undefined }
  }
}

async function main() {
  console.log('Recovering missing image variants...')
  const files = listFiles()
  const bases = basesFromFiles(files)
  const blurMap = fs.existsSync(path.join(IMAGES_DIR, 'blur.json')) ? JSON.parse(fs.readFileSync(path.join(IMAGES_DIR, 'blur.json'), 'utf8')) : {}

  for (const base of bases) {
    const missing = REQUIRED_WIDTHS.filter(w => !hasVariant(base, w))
    if (missing.length === 0) continue
    console.log(`Base ${base} missing widths: ${missing.join(', ')}`)

    // try to find a readable candidate
    const candidates = candidatesForBase(base, files)
    let usedSource = null
    for (const c of candidates) {
      try {
        await sharp(c).metadata()
        usedSource = c
        break
      } catch (err) {
        // skip unreadable
        continue
      }
    }

    if (!usedSource) {
      // create placeholder SVG -> png
      console.log(`No readable source found for ${base}, creating an SVG placeholder`) 
      const svg = await createPlaceholderSvg(base)
      const out = path.join(IMAGES_DIR, `${base}-source.png`)
      await renderSvgToPng(svg, out)
      usedSource = out
      // add to files so subsequent loops see it
      files.push(path.basename(out))
    }

    const { produced, blur } = await generateVariantsFromSource(base, usedSource)
    if (blur) blurMap[base] = blur
    if (produced.length === 0) console.log(`Warning: no variants produced for ${base}`)
  }

  fs.writeFileSync(path.join(IMAGES_DIR, 'blur.json'), JSON.stringify(blurMap, null, 2))
  console.log('Recover complete. Wrote/updated blur.json')
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
