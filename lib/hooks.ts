'use client'

import { useEffect, useState } from 'react'

export interface SearchHistory {
  from: string
  to: string
  date: string
  type: 'flights' | 'packages' | 'tours'
  timestamp: number
}

export function useSearchHistory() {
  const [history, setHistory] = useState<SearchHistory[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('amanuel_search_history')
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as SearchHistory[]
        setHistory(parsed.slice(0, 5)) // Keep only last 5
      } catch (e) {
        console.error('Failed to parse search history', e)
      }
    }
    setIsLoaded(true)
  }, [])

  // Save to localStorage whenever history changes
  useEffect(() => {
    if (isLoaded && history.length > 0) {
      localStorage.setItem('amanuel_search_history', JSON.stringify(history))
    }
  }, [history, isLoaded])

  const addSearch = (search: Omit<SearchHistory, 'timestamp'>) => {
    setHistory((prev) => {
      const newHistory = [
        { ...search, timestamp: Date.now() },
        ...prev.filter((s) => !(s.from === search.from && s.to === search.to && s.type === search.type)),
      ].slice(0, 5)
      return newHistory
    })
  }

  const clearHistory = () => {
    setHistory([])
    localStorage.removeItem('amanuel_search_history')
  }

  return { history, addSearch, clearHistory, isLoaded }
}

export function useUserPreferences() {
  const [userType, setUserType] = useState<'local' | 'diaspora' | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('amanuel_user_type')
    if (stored === 'local' || stored === 'diaspora') {
      setUserType(stored)
    }
    setIsLoaded(true)
  }, [])

  // Save to localStorage whenever userType changes
  useEffect(() => {
    if (isLoaded && userType) {
      localStorage.setItem('amanuel_user_type', userType)
    }
  }, [userType, isLoaded])

  const switchUserType = (type: 'local' | 'diaspora') => {
    setUserType(type)
  }

  return { userType, switchUserType, isLoaded }
}
