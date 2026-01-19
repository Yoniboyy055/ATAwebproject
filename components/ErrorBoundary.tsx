'use client'

import React, { ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: (error: Error, reset: () => void) => ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error details to error reporting service (e.g., Sentry)
    console.error('Error caught by boundary:', error, errorInfo)
  }

  resetError = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError && this.state.error) {
      return (
        this.props.fallback ? (
          this.props.fallback(this.state.error, this.resetError)
        ) : (
          <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full">
              <div className="bg-white shadow rounded-lg p-6">
                <h1 className="text-2xl font-bold text-red-600 mb-4">Oops! Something went wrong</h1>
                <p className="text-gray-600 mb-4">
                  We encountered an unexpected error. Please try again or contact support if the problem persists.
                </p>
                <div className="bg-red-50 border border-red-200 rounded p-3 mb-6">
                  <p className="text-sm text-red-800 font-mono break-words">
                    {this.state.error.message}
                  </p>
                </div>
                <button
                  onClick={this.resetError}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )
      )
    }

    return this.props.children
  }
}
