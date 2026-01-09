const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

const IMAGES_DIR = path.join(process.cwd(), 'public', 'images')
const REQUIRED_WIDTHS = [400, 800]
const REQUIRED_FORMATS = ['.avif', '.webp']

async function isValidImage(filePath) {
  try {
    const metadata = await sharp(filePath).metadata()
    return !!metadata && (metadata.width > 1)
  } catch (err) {
    return false
  }
}

async function main() {
  console.log('Validating required image variants...')
  let removed = []
  for (const entry of fs.readdirSync(IMAGES_DIR)) {
    if (!/-(?:400|800)\.(?:avif|webp)$/.test(entry)) continue
    const full = path.join(IMAGES_DIR, entry)
    const ok = await isValidImage(full)
    if (!ok) {
      console.log('Invalid image detected, removing:', entry)
      fs.unlinkSync(full)
      removed.push(entry)
    }
  }
  if (removed.length === 0) console.log('All required variants are valid')
  else console.log('Removed invalid files:', removed)
}

main().catch(err => { console.error(err); process.exit(1) })