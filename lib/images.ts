import fs from 'fs'
import path from 'path'

const BLUR_JSON = path.join(process.cwd(), 'public', 'images', 'blur.json')
let BLUR_MAP: Record<string, string> = {}

try {
  if (fs.existsSync(BLUR_JSON)) {
    const raw = fs.readFileSync(BLUR_JSON, 'utf8')
    BLUR_MAP = JSON.parse(raw)
  }
} catch (err) {
  // silent fallback
  BLUR_MAP = {}
}

export function getBlurByBase(base: string) {
  return BLUR_MAP[base]
}

export function getBlurForSrc(src?: string) {
  if (!src) return undefined
  // src may be '/images/asmara-400.webp' or '/images/asmara-800.avif' or 'images/asmara-800.avif'
  const name = src.split('/').pop() || src
  const m = name.match(/^(.*?)(?:-\d+)?(?:\.[^.]+)?$/)
  const base = m ? m[1] : name
  return BLUR_MAP[base]
}

export { BLUR_MAP };
