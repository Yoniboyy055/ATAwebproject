import fs from 'node:fs'
import path from 'node:path'
import {
  CUSTOMER_STATUS_COPY,
  FLAGSHIP_PREVIEW_COPY,
  INTERNAL_REQUEST_STATUSES,
  PROHIBITED_PUBLIC_PHRASES,
  hasEditorialMarker,
} from '../content-contract'
import { RequestStatuses, canTransition, customerStatusMessage } from '../workflow'
import { mayPublish, type VerifiedContent } from '../verified-content'

const publicFiles = [
  'app/tours/flagship-preview/page.tsx',
  'components/ata/FlagshipRequestForm.tsx',
  'lib/ata/content-contract.ts',
]

describe('Claude WP-02 to Codex WP-03C copy contract', () => {
  it('covers the exact fifteen-state workflow without changing transitions', () => {
    expect(RequestStatuses).toHaveLength(15)
    expect(canTransition('CLOSED', 'ARCHIVED')).toBe(true)
    expect(canTransition('ARCHIVED', 'CLOSED')).toBe(false)
  })

  it('keeps Draft, Qualified, and Archived internal', () => {
    for (const status of INTERNAL_REQUEST_STATUSES) {
      expect(CUSTOMER_STATUS_COPY[status]).toBeNull()
    }
  })

  it('warns in every customer-visible pre-confirmation state', () => {
    for (const status of RequestStatuses) {
      const copy = customerStatusMessage(status)
      if (copy && status !== 'MANUALLY_CONFIRMED') {
        expect(copy).toContain(
          'This is not a confirmed booking, reservation, seat, price, or payment.'
        )
      }
    }
  })

  it('allows confirmation-bearing copy only for manually confirmed', () => {
    expect(CUSTOMER_STATUS_COPY.MANUALLY_CONFIRMED).toContain(
      'ATA has confirmed your booking personally'
    )
    for (const status of RequestStatuses.filter((item) => item !== 'MANUALLY_CONFIRMED')) {
      expect(CUSTOMER_STATUS_COPY[status] ?? '').not.toMatch(
        /booking confirmed|reservation confirmed|has confirmed your booking/i
      )
    }
  })

  it('contains no prohibited CTA or payment language on public preview surfaces', () => {
    for (const relative of publicFiles) {
      const content = fs.readFileSync(path.join(process.cwd(), relative), 'utf8')
      for (const phrase of PROHIBITED_PUBLIC_PHRASES) {
        expect(content.toLowerCase()).not.toContain(`>${phrase}<`)
      }
      expect(content).not.toMatch(/stripe|checkout|payment intent/i)
    }
  })

  it('does not expose editorial markers through preview copy', () => {
    for (const value of Object.values(FLAGSHIP_PREVIEW_COPY)) {
      expect(hasEditorialMarker(value)).toBe(false)
    }
  })

  it.each([
    ['SUBMITTED', 'PRIVATE'],
    ['UNDER_REVIEW', 'PRIVATE'],
    ['VERIFIED', 'PRIVATE'],
    ['REJECTED', 'PRIVATE'],
    ['EXPIRED', 'PRIVATE'],
    ['SUPERSEDED', 'PRIVATE'],
    ['PUBLICATION_BLOCKED', 'PRIVATE'],
    ['VERIFIED', 'APPROVED_FOR_PUBLICATION'],
  ] as const)('hides %s / %s content', (reviewState, publicationState) => {
    const item = {
      id:'1', category:'tour', submittedValue:'private', source:'owner',
      sourceType:'written', submittedBy:'owner', submittedAt:new Date().toISOString(),
      reviewState, verificationNotes:null, verifiedBy:null, verifiedAt:null,
      approvedBy: publicationState === 'APPROVED_FOR_PUBLICATION' ? 'a' : null,
      approvedAt: publicationState === 'APPROVED_FOR_PUBLICATION' ? new Date().toISOString() : null,
      publicationState, reviewAt:null, evidenceFileId:null, version:1,
      replacementId:null, releasedBy:null, releasedAt:null,
    } as VerifiedContent
    expect(mayPublish(item)).toBe(false)
  })
})
