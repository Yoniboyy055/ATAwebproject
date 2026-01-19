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

/**
 * Hook for form management with validation
 */
import { useCallback, useRef } from 'react'

export function useForm<T extends Record<string, unknown>>(
  initialValues: T,
  onSubmit: (values: T) => Promise<void>,
  validate?: (values: T) => Record<string, string>
) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target
      const finalValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value

      setValues((prev) => ({
        ...prev,
        [name]: finalValue,
      }))

      if (validate) {
        const newErrors = validate({ ...values, [name]: finalValue })
        setErrors(newErrors)
      }
    },
    [validate, values]
  )

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }))
  }, [])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()

      if (validate) {
        const newErrors = validate(values)
        setErrors(newErrors)
        if (Object.keys(newErrors).length > 0) {
          return
        }
      }

      setIsSubmitting(true)
      try {
        await onSubmit(values)
      } catch (error) {
        setErrors({
          submit: error instanceof Error ? error.message : 'An error occurred',
        })
      } finally {
        setIsSubmitting(false)
      }
    },
    [values, validate, onSubmit]
  )

  const resetForm = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
  }, [initialValues])

  return {
    values,
    setValues,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
  }
}

/**
 * Hook for debounced search input
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}

/**
 * Hook for pagination
 */
export function usePagination(totalItems: number, itemsPerPage: number = 20) {
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage

  const goToPage = useCallback(
    (page: number) => {
      const pageNum = Math.max(1, Math.min(page, totalPages))
      setCurrentPage(pageNum)
    },
    [totalPages]
  )

  const nextPage = useCallback(() => goToPage(currentPage + 1), [currentPage, goToPage])
  const prevPage = useCallback(() => goToPage(currentPage - 1), [currentPage, goToPage])

  return {
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    goToPage,
    nextPage,
    prevPage,
  }
}

/**
 * Hook for click outside detection
 */
export function useClickOutside<T extends HTMLElement>(
  callback: () => void
) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [callback])

  return ref
}

/**
 * Hook for previous value tracking
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>()

  useEffect(() => {
    ref.current = value
  }, [value])

  return ref.current
}

/**
 * Hook for mounted state (prevents updates after unmount)
 */
export function useIsMounted(): boolean {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    return () => setIsMounted(false)
  }, [])

  return isMounted
}
