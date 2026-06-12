const ALGORITHM = { name: 'HMAC', hash: 'SHA-256' } as const
const TOKEN_TTL = 7 * 24 * 60 * 60 * 1000 // 7 days

function secret(): string {
  return process.env.ADMIN_SECRET || process.env.NEXTAUTH_SECRET || 'ata-admin-fallback-secret'
}

async function key(usage: 'sign' | 'verify'): Promise<CryptoKey> {
  return crypto.subtle.importKey('raw', new TextEncoder().encode(secret()), ALGORITHM, false, [usage])
}

function toHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

function fromHex(hex: string): Uint8Array {
  const pairs = hex.match(/.{2}/g)
  if (!pairs) return new Uint8Array(0)
  return new Uint8Array(pairs.map(b => parseInt(b, 16)))
}

export async function generateAdminToken(): Promise<string> {
  const ts = Date.now().toString()
  const sig = await crypto.subtle.sign(ALGORITHM, await key('sign'), new TextEncoder().encode(ts))
  return `${ts}.${toHex(sig)}`
}

export async function verifyAdminToken(token: string): Promise<boolean> {
  try {
    const dot = token.indexOf('.')
    if (dot === -1) return false
    const ts = token.slice(0, dot)
    const hex = token.slice(dot + 1)
    if (Date.now() - parseInt(ts) > TOKEN_TTL) return false
    return crypto.subtle.verify(ALGORITHM, await key('verify'), fromHex(hex), new TextEncoder().encode(ts))
  } catch {
    return false
  }
}
