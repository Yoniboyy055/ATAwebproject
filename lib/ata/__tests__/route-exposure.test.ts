import sitemap from '@/app/sitemap'

describe('ATA route exposure', () => {
  it('does not expose restricted routes in the sitemap', () => {
    const urls = sitemap().map((entry) => entry.url)

    expect(urls.some((url) => url.includes('/admin'))).toBe(false)
    expect(urls.some((url) => url.includes('/dashboard'))).toBe(false)
    expect(urls.some((url) => url.includes('/auth'))).toBe(false)
    expect(urls.some((url) => url.includes('/flagship-preview'))).toBe(false)
    expect(urls.some((url) => url.includes('/payments'))).toBe(false)
    expect(urls.some((url) => url.includes('/packages'))).toBe(false)
  })
})
