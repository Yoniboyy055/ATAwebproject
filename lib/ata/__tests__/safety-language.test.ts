import fs from 'node:fs'
import path from 'node:path'

const customerMessageFiles = [
  'app/book/page.tsx',
  'app/packages/[slug]/page.tsx',
  'components/builder/blocks/CTAContact.tsx',
  'lib/email.ts',
  'lib/sms.ts',
]

describe('ATA confirmation language', () => {
  it.each(customerMessageFiles)(
    'contains no automatic confirmation claim in %s',
    (relativePath) => {
      const content = fs.readFileSync(path.join(process.cwd(), relativePath), 'utf8')
      expect(content).not.toMatch(
        /booking confirmed|reservation confirmed|your booking[^.\n]*is confirmed|reserve your spot/i
      )
    }
  )
})

