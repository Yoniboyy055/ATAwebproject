import { BRAND } from './config'

export interface WhatsAppMessageConfig {
  packageName?: string
  customerType?: 'Local' | 'Diaspora'
  from?: string
  to?: string
  dates?: string
  notes?: string
}

/**
 * Build a WhatsApp message with prefilled content
 * Use with: https://wa.me/PHONE_NUMBER?text=MESSAGE
 */
export function buildWhatsAppMessage(config: WhatsAppMessageConfig): string {
  const lines: string[] = []

  if (config.packageName) {
    lines.push(`Hi! I'm interested in the ${config.packageName} package.`)
  } else {
    lines.push('Hi! I have a travel inquiry.')
  }

  if (config.customerType) {
    lines.push('')
    lines.push(`I'm a ${config.customerType === 'Local' ? 'local traveler from Eritrea' : 'diaspora traveler returning home'}.`)
  }

  if (config.from || config.to) {
    lines.push('')
    if (config.from) lines.push(`From: ${config.from}`)
    if (config.to) lines.push(`To: ${config.to}`)
  }

  if (config.dates) {
    lines.push(`Dates: ${config.dates}`)
  }

  if (config.notes) {
    lines.push('')
    lines.push(`Details: ${config.notes}`)
  }

  lines.push('')
  lines.push('Thank you!')

  return lines.join('\n')
}

/**
 * Get the WhatsApp URL for a package inquiry
 */
export function getPackageWhatsAppUrl(
  packageName: string,
  customerType?: 'Local' | 'Diaspora'
): string {
  const message = buildWhatsAppMessage({
    packageName,
    customerType
  })
  const encodedMessage = encodeURIComponent(message)
  return `https://wa.me/${encodeURIComponent(BRAND.whatsapp)}?text=${encodedMessage}`
}

/**
 * Get the WhatsApp URL for a destination quote
 */
export function getDestinationQuoteUrl(
  city: string,
  country: string
): string {
  const message = `Hi, I'd like a quote for ${city}, ${country}.`
  const encodedMessage = encodeURIComponent(message)
  return `https://wa.me/${encodeURIComponent(BRAND.whatsapp)}?text=${encodedMessage}`
}
