/**
 * Generate a Proof Ledger password hash.
 *
 *   npm run ledger:hash-password -- "the password"
 *
 * Copy the printed value into LEDGER_OWNER_PASSWORD_HASH or
 * LEDGER_VIEWER_PASSWORD_HASH in your deployment environment. Never commit the
 * plaintext password or the resulting hash to this repository.
 */

import { createInterface } from 'readline'

import { hashLedgerPassword } from '../auth/passwords'

async function readPassword(): Promise<string> {
  const fromArgs = process.argv.slice(2).join(' ').trim()
  if (fromArgs) return fromArgs

  const rl = createInterface({ input: process.stdin, output: process.stderr })
  return new Promise((resolve) => {
    rl.question('Password: ', (answer) => {
      rl.close()
      resolve(answer.trim())
    })
  })
}

async function main(): Promise<void> {
  const password = await readPassword()
  if (!password) {
    process.stderr.write('No password provided.\n')
    process.exit(1)
  }
  const hash = await hashLedgerPassword(password)
  // Only the hash goes to stdout so it can be piped safely.
  process.stdout.write(`${hash}\n`)
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`)
  process.exit(1)
})
