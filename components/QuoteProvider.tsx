"use client"
import { createContext, useContext, useState, ReactNode } from 'react'
import QuoteModal from './QuoteModal'

export type QuoteDraft = {
  name: string
  phone: string
  fromCity: string
  toCity: string
  travelDate?: string
  passengers?: string
  tripType?: 'Local outbound' | 'Diaspora inbound'
  service?: 'Flights' | 'Tours' | 'Visa Assistance' | 'Travel Support'
  notes?: string
  source?: string
}

type QuoteContextType = {
  isOpen: boolean
  draft: Partial<QuoteDraft>
  openQuote: (initial?: Partial<QuoteDraft>) => void
  closeQuote: () => void
  updateDraft: (updates: Partial<QuoteDraft>) => void
}

const QuoteContext = createContext<QuoteContextType | undefined>(undefined)

export function QuoteProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [draft, setDraft] = useState<Partial<QuoteDraft>>({})

  const openQuote = (initial?: Partial<QuoteDraft>) => {
    setDraft(initial || {})
    setIsOpen(true)
  }

  const closeQuote = () => {
    setIsOpen(false)
    setDraft({})
  }

  const updateDraft = (updates: Partial<QuoteDraft>) => {
    setDraft(prev => ({ ...prev, ...updates }))
  }

  return (
    <QuoteContext.Provider value={{ isOpen, draft, openQuote, closeQuote, updateDraft }}>
      {children}
      <QuoteModal />
    </QuoteContext.Provider>
  )
}

export function useQuote() {
  const context = useContext(QuoteContext)
  if (!context) {
    throw new Error('useQuote must be used within a QuoteProvider')
  }
  return context
}
