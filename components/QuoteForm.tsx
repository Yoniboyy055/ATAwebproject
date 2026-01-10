"use client"
import { useQuote } from './QuoteProvider'
import { QuoteDraft } from './QuoteProvider'

type Props = {
  className?: string
  source?: string
  service?: QuoteDraft['service']
}

export default function QuoteButton({ className = '', source = 'Contact Page', service = 'Flights' }: Props) {
  const { openQuote } = useQuote()

  return (
    <button
      onClick={() => openQuote({ source, service })}
      className={`rounded-md bg-primary text-white px-4 py-2 font-medium hover:bg-primary/90 transition ${className}`}
    >
      Request a Quote
    </button>
  )
}
