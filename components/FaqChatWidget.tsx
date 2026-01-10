'use client'

import { useState, useRef, useEffect } from 'react'
import { useLang } from './LangProvider'
import { getTranslation } from '@/lib/lang'
import { BRAND } from '@/lib/config'

// Local FAQ dataset
const FAQ_DATA = [
  {
    q: 'How do I book a flight?',
    tags: ['book', 'flight', 'booking', 'reservation', 'how to'],
    a: 'To book a flight, simply send us your route, dates, and number of passengers via WhatsApp or our contact form. We\'ll reply with options and the best prices within 1-2 hours.'
  },
  {
    q: 'What documents do I need for visa?',
    tags: ['visa', 'document', 'documents', 'requirement', 'needed'],
    a: 'Visa requirements depend on your destination and nationality. Common documents include passport, visa application form, proof of funds, travel itinerary, and accommodation details. Contact us for a checklist specific to your route.'
  },
  {
    q: 'Do you handle baggage and special requests?',
    tags: ['baggage', 'luggage', 'special', 'extra', 'request'],
    a: 'Yes! We help with baggage allowance, excess baggage fees, sports equipment, medical devices, and other special requests. Let us know your needs when booking.'
  },
  {
    q: 'What is your refund policy?',
    tags: ['refund', 'money back', 'cancel', 'cancellation', 'policy'],
    a: 'Our refund policy depends on the airline and ticket type. Some tickets are non-refundable, while others allow changes or partial refunds. Contact us to check your specific booking details.'
  },
  {
    q: 'How do you handle diaspora travelers?',
    tags: ['diaspora', 'returning', 'home', 'abroad', 'abroad travel'],
    a: 'We specialize in diaspora routes (Canada, US, Europe → Eritrea/Ethiopia). We handle multi-city routes, stopovers, and coordinate arrivals across time zones. Perfect for family visits and permanent moves.'
  },
  {
    q: 'What payment methods do you accept?',
    tags: ['payment', 'pay', 'credit card', 'bank transfer', 'how to pay'],
    a: 'Payment methods vary by booking type. We support bank transfers, mobile money, and credit/debit cards depending on your location. Confirm options with us when requesting a quote.'
  },
  {
    q: 'Do you offer hotel bookings?',
    tags: ['hotel', 'accommodation', 'stay', 'where to stay', 'lodging'],
    a: 'We provide hotel suggestions and can help coordinate accommodations for your trip. Contact us with your destination and dates for recommendations.'
  },
  {
    q: 'How long does it take to get a response?',
    tags: ['response', 'time', 'reply', 'how long', 'wait'],
    a: 'We prioritize WhatsApp responses within 1-2 hours during business hours. Email inquiries are answered within 24 hours. Our team serves multiple time zones.'
  },
  {
    q: 'Can you help with group bookings?',
    tags: ['group', 'family', 'multiple', 'bulk', 'large booking'],
    a: 'Absolutely! We specialize in family and group travel. Send us your group size, route, and dates, and we\'ll arrange coordinated flights with special rates if available.'
  },
  {
    q: 'Do you offer student travel discounts?',
    tags: ['student', 'discount', 'youth', 'education'],
    a: 'Yes, we provide student travel support including visa guidance and flight discounts on eligible routes. Provide your student ID or letter for verification.'
  },
  {
    q: 'What if my flight is delayed or cancelled?',
    tags: ['delay', 'cancel', 'problem', 'issue', 'help'],
    a: 'We support you throughout your journey. Contact us immediately if you experience delays or cancellations. We\'ll help coordinate alternative flights or accommodations.'
  },
  {
    q: 'Do you handle medical or emergency travel?',
    tags: ['medical', 'emergency', 'urgent', 'health'],
    a: 'Yes, we support urgent medical travel and emergency relocations. Call us directly for immediate assistance with time-sensitive bookings.'
  },
  {
    q: 'What are your office hours?',
    tags: ['office', 'hours', 'when open', 'contact', 'available'],
    a: `Our office is in Asmara, Eritrea. We respond via WhatsApp 24/7. Office: ${BRAND.phoneOffice} | Mobile: ${BRAND.phoneMobile}`
  },
  {
    q: 'Which countries do you serve?',
    tags: ['country', 'destination', 'where', 'routes', 'travel'],
    a: 'We specialize in Eritrea ↔ Ethiopia routes and diaspora travel from Canada, US, Europe. We can arrange flights to 100+ destinations. Ask about your specific route.'
  },
  {
    q: 'How do I modify my booking?',
    tags: ['change', 'modify', 'edit', 'update', 'change date'],
    a: 'Contact us with your booking details. Modifications depend on airline rules and ticket type. Some changes are free, others incur fees. We\'ll check and advise.'
  }
]

interface Message {
  role: 'user' | 'assistant'
  text: string
}

export default function FaqChatWidget() {
  const { lang } = useLang()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showChips, setShowChips] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Initialize greeting message on first load
  useEffect(() => {
    if (messages.length === 0) {
      const greeting = getTranslation(lang, 'chat.subtitle')
      setMessages([{
        role: 'assistant',
        text: greeting
      }])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const findBestMatch = (question: string): { answer: string, score: number } => {
    const normalized = question.toLowerCase()
    
    // Score each FAQ entry
    let bestMatch = FAQ_DATA[FAQ_DATA.length - 1] // fallback to last entry
    let highestScore = 0

    FAQ_DATA.forEach(faq => {
      let score = 0
      
      // Check if tags match
      faq.tags.forEach(tag => {
        if (normalized.includes(tag)) score += 3
      })
      
      // Check question words
      const qWords = faq.q.toLowerCase().split(' ')
      qWords.forEach(word => {
        if (word.length > 3 && normalized.includes(word)) score += 2
      })
      
      // Fuzzy: if any significant word appears
      if (normalized.includes('whatsapp') || normalized.includes('contact')) score += 2

      if (score > highestScore) {
        highestScore = score
        bestMatch = faq
      }
    })

    return {
      answer: bestMatch.a,
      score: highestScore
    }
  }

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage = input.trim()
    setInput('')
    setShowChips(false)
    setMessages(prev => [...prev, { role: 'user', text: userMessage }])
    setIsLoading(true)

    // Simulate slight delay for natural feel
    setTimeout(() => {
      const { answer, score } = findBestMatch(userMessage)
      
      // Use fallback message if score is too low
      let responseText = answer
      if (score === 0) {
        const fallbackMsg = getTranslation(lang, 'chat.fallback')
        responseText = fallbackMsg
      }
      
      setMessages(prev => [...prev, { role: 'assistant', text: responseText }])
      setIsLoading(false)
    }, 300)
  }

  const handleQuickReply = (topic: string) => {
    setInput(topic)
    setShowChips(false)
    // Trigger send after state updates
    setTimeout(() => {
      const userMessage = topic
      setMessages(prev => [...prev, { role: 'user', text: userMessage }])
      setIsLoading(true)

      setTimeout(() => {
        const { answer, score } = findBestMatch(userMessage)
        let responseText = answer
        if (score === 0) {
          const fallbackMsg = getTranslation(lang, 'chat.fallback')
          responseText = fallbackMsg
        }
        setMessages(prev => [...prev, { role: 'assistant', text: responseText }])
        setIsLoading(false)
      }, 300)
    }, 0)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg flex items-center justify-center text-2xl transition-all"
        aria-label="FAQ Helper"
      >
        {isOpen ? '✕' : '❓'}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-40 w-96 max-w-[calc(100vw-32px)] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[600px] md:max-h-[500px]">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-4 text-white">
            <h3 className="font-bold text-lg">
              {getTranslation(lang, 'chat.title')}
            </h3>
            <p className="text-sm text-emerald-100">
              {getTranslation(lang, 'chat.subtitle')}
            </p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${
                    msg.role === 'user'
                      ? 'bg-emerald-500 text-white rounded-br-none'
                      : 'bg-white text-slate-700 border border-slate-200 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white text-slate-700 border border-slate-200 rounded-2xl rounded-bl-none px-4 py-2">
                  <span className="inline-block animate-pulse">●●●</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Reply Chips */}
          {showChips && messages.length <= 1 && (
            <div className="border-t border-slate-200 bg-white px-4 py-3 space-y-2">
              <p className="text-xs text-slate-500 font-medium">
                {getTranslation(lang, 'chat.subtitle')}
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleQuickReply(getTranslation(lang, 'chat.quickReplies.flights'))}
                  className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-200 transition"
                >
                  ✈️ {getTranslation(lang, 'chat.quickReplies.flights')}
                </button>
                <button
                  onClick={() => handleQuickReply(getTranslation(lang, 'chat.quickReplies.visa'))}
                  className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-200 transition"
                >
                  📋 {getTranslation(lang, 'chat.quickReplies.visa')}
                </button>
                <button
                  onClick={() => handleQuickReply(getTranslation(lang, 'chat.quickReplies.packages'))}
                  className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-200 transition"
                >
                  🎁 {getTranslation(lang, 'chat.quickReplies.packages')}
                </button>
                <button
                  onClick={() => handleQuickReply(getTranslation(lang, 'chat.quickReplies.baggage'))}
                  className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-200 transition"
                >
                  🧳 {getTranslation(lang, 'chat.quickReplies.baggage')}
                </button>
                <button
                  onClick={() => handleQuickReply(getTranslation(lang, 'chat.quickReplies.contact'))}
                  className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-200 transition"
                >
                  ☎️ {getTranslation(lang, 'chat.quickReplies.contact')}
                </button>
                <button
                  onClick={() => window.open(BRAND.whatsappLink, '_blank')}
                  className="px-3 py-2 bg-green-50 hover:bg-green-100 text-green-700 text-xs font-semibold rounded-full border border-green-200 transition"
                >
                  💬 {getTranslation(lang, 'chat.quickReplies.whatsapp')}
                </button>
              </div>
            </div>
          )}

          {/* Input */}
          <div className="border-t border-slate-200 p-4 bg-white space-y-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={getTranslation(lang, 'chat.placeholder')}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
              rows={2}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-300 text-white font-semibold py-2 rounded-lg transition text-sm"
            >
              {getTranslation(lang, 'chat.send')}
            </button>
          </div>

          {/* WhatsApp CTA */}
          <div className="border-t border-slate-200 bg-slate-50 px-4 py-3 text-center text-xs text-slate-600">
            <div className="mb-2">
              {lang === 'en' ? 'Need instant support?' : lang === 'ti' ? 'ፈጣሪ ሓገዝ ፈልግ?' : 'ፈጣሪ ሓገዝ ፈልግ?'}
            </div>
            <a
              href={BRAND.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-full font-semibold text-xs transition"
            >
              💬 WhatsApp
            </a>
          </div>
        </div>
      )}
    </>
  )
}
