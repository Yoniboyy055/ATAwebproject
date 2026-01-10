"use client"
import { createContext, useContext, useState, ReactNode, useCallback } from 'react'
import { Lang, getTranslation } from '../lib/lang'

type LangContextType = {
  lang: Lang
  setLang: (lang: Lang) => void
  t: (keyPath: string) => string
}

const LangContext = createContext<LangContextType | undefined>(undefined)

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('en')

  const t = useCallback((keyPath: string) => {
    return getTranslation(lang, keyPath)
  }, [lang])

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  const context = useContext(LangContext)
  if (!context) {
    throw new Error('useLang must be used within a LangProvider')
  }
  return context
}
