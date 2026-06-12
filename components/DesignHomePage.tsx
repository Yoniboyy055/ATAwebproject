'use client'
import { useEffect } from 'react'
import * as THREE from 'three'
import '@/styles/design.css'

export default function DesignHomePage() {
  useEffect(() => {
    document.body.classList.add('design-home')

    // Year
    const yrEl = document.getElementById('yr')
    if (yrEl) yrEl.textContent = String(new Date().getFullYear())

    /* ── Quote widget ── */
    function handleQuote(e: Event) {
      e.preventDefault()
      const f = e.target as HTMLFormElement
      const from = (f.elements.namedItem('from') as HTMLInputElement)?.value?.trim() || ''
      const to = (f.elements.namedItem('to') as HTMLSelectElement)?.value || ''
      const when = (f.elements.namedItem('when') as HTMLInputElement)?.value?.trim() || ''
      const svc = document.querySelector('.form-box select') as HTMLSelectElement
      if (svc) svc.value = 'Air Ticket Booking'
      const note = document.querySelector('.form-box textarea') as HTMLTextAreaElement
      if (note) {
        note.value = `Quote requested: ${from} → ${to}, ${when}.`
        note.classList.add('flash')
        setTimeout(() => note.classList.remove('flash'), 1400)
      }
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    const qw = document.getElementById('quoteWidget')
    qw?.addEventListener('submit', handleQuote)

    /* ── Enquiry form ── */
    function handleEnquiry(e: Event) {
      e.preventDefault()
      const f = e.target as HTMLFormElement
      const data = new FormData(f)
      const btn = f.querySelector('button[type="submit"]') as HTMLButtonElement | null
      const btnSpan = btn?.querySelector('span')
      if (btn) btn.disabled = true
      if (btnSpan) btnSpan.textContent = 'Sending…'
      fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.get('name'),
          phone: data.get('phone'),
          email: data.get('email'),
          service: data.get('service'),
          details: data.get('details'),
        }),
      })
        .then(r => {
          if (r.ok) {
            f.reset()
            const box = f.closest('.form-box') as HTMLElement | null
            if (box) {
              const msg = document.createElement('p')
              msg.style.cssText = 'text-align:center;color:#C9A84C;font-weight:600;padding:16px 0;'
              msg.textContent = '✓ Enquiry received! We\'ll be in touch shortly.'
              box.appendChild(msg)
              setTimeout(() => msg.remove(), 6000)
            }
          } else {
            alert('Something went wrong — please contact us via WhatsApp or email.')
          }
        })
        .catch(() => alert('Network error — please try WhatsApp or email.'))
        .finally(() => {
          if (btn) btn.disabled = false
          if (btnSpan) btnSpan.textContent = 'Send Enquiry'
        })
    }
    const enquiryForm = document.querySelector('.form-box form')
    enquiryForm?.addEventListener('submit', handleEnquiry)

    /* ── Testimonial carousel ── */
    const slides = document.querySelectorAll<HTMLElement>('.test-slide')
    const dots = document.querySelectorAll<HTMLElement>('.test-dot')
    let currentSlide = 0
    let carouselTimer: ReturnType<typeof setInterval>
    function goSlide(n: number) {
      currentSlide = (n + slides.length) % slides.length
      slides.forEach((s, k) => s.classList.toggle('active', k === currentSlide))
      dots.forEach((d, k) => d.classList.toggle('active', k === currentSlide))
    }
    function restartCarousel() {
      clearInterval(carouselTimer)
      carouselTimer = setInterval(() => goSlide(currentSlide + 1), 7500)
    }
    dots.forEach(d => d.addEventListener('click', () => {
      goSlide(parseInt((d as HTMLElement).dataset.slide || '0', 10))
      restartCarousel()
    }))
    if (slides.length) restartCarousel()

    /* ── Journal modal ── */
    const ARTICLES: Record<string, { tag: string; title: string; author: string; body: string }> = {
      genna: {
        tag: 'Diaspora Guide',
        title: 'A Diaspora Family\'s Guide to Flying Home for <em>Genna</em>',
        author: 'Amanuel Travel · Travel Notes · 9 min read',
        body: `<p>January in Asmara is colder than people remember. Wool jackets come out of suitcases at the airport, and the city has a quietness in the early week that breaks open by Sunday. This is Genna season — Eritrean Christmas — and it is one of the most beautiful times to be home.</p>
<p>It is also one of the hardest times to book a flight. Demand from the diaspora peaks in late December, and seats fill in waves. <strong>The travelers who arrive rested are the ones who started planning in September.</strong></p>
<p>If you are flying from North America, your most reliable routings will move through Frankfurt, Cairo, or Addis Ababa. From Europe, Istanbul and Cairo work well. From the Gulf, Dubai and Doha connect directly into Asmara on most weekday mornings. The key, in every case, is to book the connection that gives you a buffer.</p>
<p>Plan for the return leg too. The week after Genna, families want to leave in the same direction. If you can be flexible by even a single day, fares often drop significantly.</p>`
      },
      season: {
        tag: 'Practical',
        title: 'Understanding Eritrea\'s <em>Travel Season</em>',
        author: 'Amanuel Travel · Travel Notes · 7 min read',
        body: `<p>There is the calendar that airlines use, and there is the calendar that families use. Knowing the difference is half of booking a good trip to Eritrea.</p>
<p>The high-demand windows are predictable once you know them. <strong>May brings Independence Day</strong> and a wave of diaspora visits. <strong>July and August are summer holiday</strong>, when school is out and family reunions are organized. <strong>September is Meskel</strong>. <strong>January is Genna</strong>.</p>
<p>Between those windows, things calm down. February, March, October, and November are the best months to find quieter flights and better fares.</p>
<p>Whatever you book, book it from a real person who understands what week of what month you are actually traveling into. That is what we do.</p>`
      },
      redsea: {
        tag: 'Destinations',
        title: 'What to Pack for the <em>Red Sea Coast</em>',
        author: 'Amanuel Travel · Field Notes · 5 min read',
        body: `<p>Massawa surprises every first-time visitor. The descent from Asmara takes you from two thousand three hundred meters down to sea level in under three hours, and the air thickens with every kilometer.</p>
<p>You need <strong>lighter clothing than you think</strong>. Linen shirts, breathable cotton, a wide-brimmed hat. The light off the Red Sea is brilliant — sunglasses are not optional.</p>
<p>Bring water shoes if you plan to wade or swim near the harbor. A small dry bag for your phone and documents is worth its weight on any boat trip out toward the Dahlak Islands.</p>
<p>Most travelers underestimate how much they want to stay. Plan for two nights, not one.</p>`
      }
    }
    const jModal = document.getElementById('jModal')
    const jBody = document.getElementById('jBody')
    function openArticle(key: string) {
      const a = ARTICLES[key]
      if (!a || !jBody || !jModal) return
      jBody.innerHTML = `
        <div class="tag">${a.tag}</div>
        <h2>${a.title}</h2>
        <div class="author"><span>${a.author.split('·')[0].trim()}</span><span class="dt"></span><span>${a.author.split('·').slice(1).join('·').trim()}</span></div>
        <div class="body">${a.body}</div>`
      jModal.classList.add('open')
      document.body.style.overflow = 'hidden'
    }
    function closeArticle() {
      jModal?.classList.remove('open')
      document.body.style.overflow = ''
    }
    document.querySelectorAll<HTMLElement>('.j-card[data-article]').forEach(c =>
      c.addEventListener('click', () => openArticle(c.dataset.article || ''))
    )
    document.getElementById('jClose')?.addEventListener('click', closeArticle)
    jModal?.addEventListener('click', (e) => { if (e.target === jModal) closeArticle() })

    /* ── FAQ accordion ── */
    document.querySelectorAll<HTMLElement>('.faq-item .faq-q').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.parentElement!
        const ans = item.querySelector<HTMLElement>('.faq-a')
        const open = item.classList.toggle('open')
        btn.setAttribute('aria-expanded', open ? 'true' : 'false')
        if (ans) ans.style.maxHeight = open ? ans.scrollHeight + 'px' : '0'
      })
    })

    /* ── Now in Asmara live time ── */
    const asmaraTimeEl = document.getElementById('asmaraTime')
    function updateAsmaraTime() {
      if (!asmaraTimeEl) return
      const now = new Date()
      const utc = now.getTime() + now.getTimezoneOffset() * 60000
      const asmara = new Date(utc + 3 * 60 * 60 * 1000)
      const h = asmara.getHours()
      const m = String(asmara.getMinutes()).padStart(2, '0')
      const ampm = h >= 12 ? 'PM' : 'AM'
      const h12 = h % 12 || 12
      asmaraTimeEl.textContent = `${h12}:${m} ${ampm}`
    }
    updateAsmaraTime()
    const timeInterval = setInterval(updateAsmaraTime, 30000)

    /* ── Language toggle ── */
    const TRANSLATIONS: Record<string, Record<string, string>> = {
      en: {
        'nav.destinations': 'Destinations', 'nav.services': 'Services', 'nav.about': 'About', 'nav.contact': 'Contact', 'nav.cta': 'Book Consultation',
        'hero.l1': 'Travel With', 'hero.l2': 'Confidence', 'hero.l3': 'From Eritrea',
        'hero.cta1': 'Plan Your Journey', 'hero.cta2': 'Explore Services',
        'qw.from': 'From', 'qw.to': 'To', 'qw.when': 'When', 'qw.go': 'Quote'
      },
      ti: {
        'nav.destinations': 'መንገዲ', 'nav.services': 'ኣገልግሎታት', 'nav.about': 'ብዛዕባና', 'nav.contact': 'ርክብ', 'nav.cta': 'ምኽሪ ሕተት',
        'hero.l1': 'ብእምነት', 'hero.l2': 'ተጓዓዝ', 'hero.l3': 'ካብ ኤርትራ',
        'hero.cta1': 'ጉዕዞኹም ጀምሩ', 'hero.cta2': 'ኣገልግሎታት ርአዩ',
        'qw.from': 'ካብ', 'qw.to': 'ናብ', 'qw.when': 'መዓስ', 'qw.go': 'ዋጋ'
      },
      ar: {
        'nav.destinations': 'الوجهات', 'nav.services': 'الخدمات', 'nav.about': 'من نحن', 'nav.contact': 'اتصل', 'nav.cta': 'احجز استشارة',
        'hero.l1': 'سافر', 'hero.l2': 'بثقة', 'hero.l3': 'من إريتريا',
        'hero.cta1': 'خطط لرحلتك', 'hero.cta2': 'استكشف الخدمات',
        'qw.from': 'من', 'qw.to': 'إلى', 'qw.when': 'متى', 'qw.go': 'سعر'
      },
      it: {
        'nav.destinations': 'Destinazioni', 'nav.services': 'Servizi', 'nav.about': 'Chi siamo', 'nav.contact': 'Contatti', 'nav.cta': 'Prenota Consulenza',
        'hero.l1': 'Viaggia con', 'hero.l2': 'Fiducia', 'hero.l3': 'dall\'Eritrea',
        'hero.cta1': 'Pianifica il Viaggio', 'hero.cta2': 'Scopri i Servizi',
        'qw.from': 'Da', 'qw.to': 'A', 'qw.when': 'Quando', 'qw.go': 'Quota'
      }
    }
    function tagI18n() {
      const navLinks = document.querySelectorAll<HTMLElement>('.ata-nav .nav-links a')
      if (navLinks[0]) navLinks[0].dataset.i18n = 'nav.destinations'
      if (navLinks[1]) navLinks[1].dataset.i18n = 'nav.services'
      if (navLinks[2]) navLinks[2].dataset.i18n = 'nav.about'
      if (navLinks[3]) navLinks[3].dataset.i18n = 'nav.contact'
      const navCta = document.querySelector<HTMLElement>('.ata-nav .nav-cta')
      if (navCta) navCta.dataset.i18n = 'nav.cta'
      const hl = document.querySelectorAll<HTMLElement>('.hero h1 .ln span')
      if (hl[0]) hl[0].dataset.i18n = 'hero.l1'
      if (hl[1]) hl[1].dataset.i18n = 'hero.l2'
      if (hl[2]) hl[2].dataset.i18n = 'hero.l3'
      const btns = document.querySelectorAll<HTMLElement>('.hero-cta a span:first-child')
      if (btns[0]) btns[0].dataset.i18n = 'hero.cta1'
      if (btns[1]) btns[1].dataset.i18n = 'hero.cta2'
      const qwLbls = document.querySelectorAll<HTMLElement>('#quoteWidget label')
      if (qwLbls[0]) qwLbls[0].dataset.i18n = 'qw.from'
      if (qwLbls[1]) qwLbls[1].dataset.i18n = 'qw.to'
      if (qwLbls[2]) qwLbls[2].dataset.i18n = 'qw.when'
      const qwGo = document.querySelector<HTMLElement>('#quoteWidget .qw-go span:first-child')
      if (qwGo) qwGo.dataset.i18n = 'qw.go'
    }
    tagI18n()
    function setLang(lang: string) {
      const dict = TRANSLATIONS[lang] || TRANSLATIONS.en
      document.querySelectorAll<HTMLElement>('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n || ''
        if (dict[key]) el.textContent = dict[key]
      })
      document.documentElement.lang = lang
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
      document.querySelectorAll<HTMLElement>('#langToggle button').forEach(b => {
        b.classList.toggle('active', b.dataset.lang === lang)
      })
    }
    document.querySelectorAll<HTMLElement>('#langToggle button').forEach(b =>
      b.addEventListener('click', () => setLang(b.dataset.lang || 'en'))
    )

    /* ── Loading curtain ── */
    const curtain = document.getElementById('curtain')
    function dismissCurtain() {
      if (!curtain || curtain.classList.contains('gone')) return
      curtain.classList.add('gone')
      setTimeout(showHint, 700)
    }
    setTimeout(dismissCurtain, 3200)

    /* ── Look-around hint ── */
    const hint = document.getElementById('hint')
    let hintShown = false, hintDismissed = false
    function showHint() {
      if (hintDismissed || hintShown) return
      hintShown = true
      hint?.classList.add('show')
      setTimeout(dismissHint, 6000)
    }
    function dismissHint() {
      if (hintDismissed || !hint) return
      hintDismissed = true
      hint.classList.remove('show')
      hint.classList.add('dismiss')
    }
    let moveCount = 0
    function onMoveHint() { if (hintShown) { moveCount++; if (moveCount > 6) dismissHint() } }
    function onScrollHint() { if (hintShown && window.scrollY > 80) dismissHint() }
    window.addEventListener('mousemove', onMoveHint, { passive: true })
    window.addEventListener('scroll', onScrollHint, { passive: true })
    window.addEventListener('touchstart', dismissHint, { passive: true })

    /* ── Form prefill from destination cards ── */
    function prefillForm(dest: string) {
      const form = document.querySelector<HTMLFormElement>('.form-box form')
      if (!form || !dest) return
      const svc = form.querySelector<HTMLSelectElement>('select')
      if (svc) {
        for (const opt of svc.options) {
          if (opt.value === 'Travel Consultation' || opt.text === 'Travel Consultation') {
            svc.value = opt.value || opt.text
            break
          }
        }
      }
      const note = form.querySelector<HTMLTextAreaElement>('textarea')
      if (note && !note.value.trim()) {
        note.value = `Interested in travel to ${dest}. Please share routing and seasonal options.`
        note.classList.add('flash')
        setTimeout(() => note.classList.remove('flash'), 1400)
      }
    }
    document.querySelectorAll<HTMLElement>('.dest-card[data-dest]').forEach(card =>
      card.addEventListener('click', () => prefillForm(card.dataset.dest || ''))
    )

    /* ── Scroll progress + nav ── */
    const scrollBar = document.getElementById('scrollBar')
    const railLine = document.getElementById('railLine')
    const railPct = document.querySelector<HTMLElement>('.rail span:last-child')
    const nav = document.getElementById('ata-nav')
    const heroInner = document.getElementById('heroInner')
    const heroStats = document.getElementById('heroStats')
    let scrollY = window.scrollY
    function onScroll() {
      scrollY = window.scrollY
      const max = document.documentElement.scrollHeight - window.innerHeight
      const pct = Math.min(1, scrollY / Math.max(1, max))
      if (scrollBar) scrollBar.style.width = (pct * 100) + '%'
      if (railLine) railLine.style.background = `linear-gradient(to bottom, var(--gold) 0%, var(--gold) ${pct * 100}%, rgba(255,255,255,.1) ${pct * 100}%, rgba(255,255,255,.1) 100%)`
      if (railPct) railPct.textContent = Math.round(pct * 100) + '%'
      if (nav) {
        if (scrollY > 40) nav.classList.add('scrolled')
        else nav.classList.remove('scrolled')
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    /* ── Hero parallax ── */
    const heroSection = document.getElementById('hero')
    let targetMX = 0, targetMY = 0
    function onHeroMouseMove(e: Event) {
      const me = e as MouseEvent
      const r = heroSection!.getBoundingClientRect()
      targetMX = ((me.clientX - r.left) / r.width - 0.5) * -25
      targetMY = ((me.clientY - r.top) / r.height - 0.5) * -15
    }
    function onHeroMouseLeave() { targetMX = 0; targetMY = 0 }
    heroSection?.addEventListener('mousemove', onHeroMouseMove)
    heroSection?.addEventListener('mouseleave', onHeroMouseLeave)
    let lerpX = 0, lerpY = 0
    let heroLoopId: number
    function heroLoop() {
      lerpX += (targetMX - lerpX) * 0.06
      lerpY += (targetMY - lerpY) * 0.06
      const sy = scrollY
      const within = sy < window.innerHeight * 1.4
      if (within) {
        if (heroInner) heroInner.style.transform = `translate3d(0, ${sy * 0.20}px, 0)`
        if (heroStats) heroStats.style.transform = `translate3d(0, ${sy * 0.10}px, 0)`
      }
      heroLoopId = requestAnimationFrame(heroLoop)
    }
    heroLoopId = requestAnimationFrame(heroLoop)

    /* ── Reveal on scroll (IntersectionObserver) ── */
    const io = new IntersectionObserver((ents) => {
      ents.forEach((e) => {
        if (e.isIntersecting) {
          const siblings = e.target.parentElement?.querySelectorAll('.reveal, .reveal-r')
          const idx = siblings ? Array.from(siblings).indexOf(e.target) : 0
          const delay = Math.min(idx, 6) * 90
          setTimeout(() => e.target.classList.add('in'), delay)
          io.unobserve(e.target)
        }
      })
    }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' })
    document.querySelectorAll('.reveal, .reveal-r').forEach(el => io.observe(el))

    /* ── Cursor dark variant over services section ── */
    const servSec = document.getElementById('services')
    if (servSec) {
      const cio = new IntersectionObserver((ents) => {
        ents.forEach(e => {
          document.body.classList.toggle('cursor-dark', e.isIntersecting && e.intersectionRatio > 0.3)
        })
      }, { threshold: [0, 0.3, 0.6, 1] })
      cio.observe(servSec)
    }

    /* ── Custom cursor ── */
    const dot = document.getElementById('curDot')
    const ring = document.getElementById('curRing')
    let mx = window.innerWidth / 2, my = window.innerHeight / 2
    let _ringX = mx, _ringY = my
    const MAGNET_RADIUS = 80
    const MAGNET_STRENGTH = 0.35
    function findMagnet(x: number, y: number) {
      const targets = document.querySelectorAll<HTMLElement>('a.btn-primary,a.btn-ghost,.nav-cta,.f-submit,.qw-go,.serv-link,.j-link,.test-dot')
      for (const el of Array.from(targets)) {
        const r = el.getBoundingClientRect()
        const cx = r.left + r.width / 2
        const cy = r.top + r.height / 2
        if (Math.hypot(x - cx, y - cy) < MAGNET_RADIUS) return { cx, cy }
      }
      return null
    }
    function onMouseMove(e: MouseEvent) {
      mx = e.clientX; my = e.clientY
      if (dot) dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`
    }
    let ringLoopId: number
    function magnetTick() {
      const t = findMagnet(mx, my)
      if (t) {
        _ringX += (t.cx - _ringX) * MAGNET_STRENGTH
        _ringY += (t.cy - _ringY) * MAGNET_STRENGTH
        if (ring) ring.style.transform = `translate(${_ringX}px, ${_ringY}px) translate(-50%,-50%) scale(1.15)`
      } else {
        _ringX += (mx - _ringX) * 0.18
        _ringY += (my - _ringY) * 0.18
        if (ring) ring.style.transform = `translate(${_ringX}px, ${_ringY}px) translate(-50%,-50%) scale(1)`
      }
      ringLoopId = requestAnimationFrame(magnetTick)
    }
    window.addEventListener('mousemove', onMouseMove)
    ringLoopId = requestAnimationFrame(magnetTick)
    document.querySelectorAll('a,button,input,select,textarea,.dest-card,.serv-card,.why-pt,.trust-item').forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('hov'))
      el.addEventListener('mouseleave', () => document.body.classList.remove('hov'))
    })

    /* ── Keyboard close for modal ── */
    function onKeydown(e: KeyboardEvent) { if (e.key === 'Escape') closeArticle() }
    window.addEventListener('keydown', onKeydown)

    /* ── Idle input tracking (shared with panorama) ── */
    ;(window as Window & { lastUserInputAt?: number }).lastUserInputAt = Date.now()
    const trackIdle = () => { (window as Window & { lastUserInputAt?: number }).lastUserInputAt = Date.now() }
    ;(['mousemove', 'scroll', 'touchstart', 'keydown'] as const).forEach(ev =>
      window.addEventListener(ev, trackIdle, { passive: true })
    )

    /* ── Section yaw map for page-aware panorama ── */
    type SectionEntry = { sel: string; yaw: number; el: HTMLElement }
    const SECTION_YAW_MAP: SectionEntry[] = [
      { sel: '#hero',         yaw:  0.00 },
      { sel: '.trust',        yaw:  0.25 },
      { sel: '#destinations', yaw:  0.55 },
      { sel: '#office',       yaw:  0.85 },
      { sel: '.partners',     yaw:  1.05 },
      { sel: '#services',     yaw: -0.45 },
      { sel: '#why',          yaw: -0.85 },
      { sel: '.test',         yaw: -0.30 },
      { sel: '#journal',      yaw:  0.40 },
      { sel: '#faq',          yaw:  0.10 },
      { sel: '#contact',      yaw: -0.10 },
    ].map(s => ({ ...s, el: document.querySelector<HTMLElement>(s.sel) }))
      .filter((s): s is SectionEntry => s.el !== null)

    function activeSectionYaw(): number {
      const vy = window.scrollY + window.innerHeight * 0.45
      let best = SECTION_YAW_MAP[0]
      for (const s of SECTION_YAW_MAP) {
        if (s.el.offsetTop <= vy) best = s
      }
      return best ? best.yaw : 0
    }

    /* ── Hotspot click-through to destination cards ── */
    const HOTSPOT_DEST: Record<string, string> = { hs1: 'Asmara', hs2: 'Asmara', hs3: 'Keren' }
    document.querySelectorAll<HTMLElement>('.hotspot').forEach(hs => {
      hs.style.pointerEvents = 'auto'
      hs.style.cursor = 'none'
      hs.addEventListener('click', () => {
        const dest = HOTSPOT_DEST[hs.id] || 'Asmara'
        const card = document.querySelector<HTMLElement>(`.dest-card[data-dest="${dest}"]`)
        if (card) {
          card.scrollIntoView({ behavior: 'smooth', block: 'center' })
          card.style.transition = 'box-shadow .6s ease'
          card.style.boxShadow = '0 0 0 2px var(--gold), 0 40px 60px -30px rgba(201,168,76,.5)'
          setTimeout(() => { card.style.boxShadow = '' }, 1800)
        }
        const form = document.querySelector<HTMLFormElement>('.form-box form')
        if (form && dest) {
          const svc = form.querySelector<HTMLSelectElement>('select')
          if (svc) {
            for (const opt of svc.options) {
              if (opt.value === 'Travel Consultation' || opt.text === 'Travel Consultation') {
                svc.value = opt.value || opt.text; break
              }
            }
          }
          const note = form.querySelector<HTMLTextAreaElement>('textarea')
          if (note && !note.value.trim()) {
            note.value = `Interested in travel to ${dest}. Please share routing and seasonal options.`
            note.classList.add('flash')
            setTimeout(() => note.classList.remove('flash'), 1400)
          }
        }
      })
    })

    /* ── Three.js 360° panorama ── */
    const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const panoCanvas = document.getElementById('heroCanvas') as HTMLCanvasElement
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(78, window.innerWidth / window.innerHeight, 0.1, 2000)
    camera.position.set(0, 0, 0)
    camera.rotation.order = 'YXZ'

    const renderer = new THREE.WebGLRenderer({ canvas: panoCanvas, alpha: true, antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x0a1628, 1)
    renderer.outputColorSpace = THREE.SRGBColorSpace

    const panoGeo = new THREE.SphereGeometry(500, 80, 50)
    panoGeo.scale(-1, 1, 1)
    const panoMat = new THREE.MeshBasicMaterial({ color: 0x0d1f38 })
    const panoMesh = new THREE.Mesh(panoGeo, panoMat)
    scene.add(panoMesh)

    const texLoader = new THREE.TextureLoader()
    const heroBgEl = document.getElementById('heroBg') as HTMLElement | null
    texLoader.load('/images/hero.jpg', (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace
      tex.minFilter = THREE.LinearFilter
      tex.magFilter = THREE.LinearFilter
      panoMat.map = tex
      panoMat.color.setRGB(1.35, 1.30, 1.22)
      panoMat.needsUpdate = true
      panoMat.transparent = true
      panoMat.opacity = 0
      let o = 0
      const fadeIn = () => {
        o = Math.min(1, o + 0.04)
        panoMat.opacity = o
        if (o < 1) requestAnimationFrame(fadeIn)
        else if (heroBgEl) heroBgEl.style.opacity = '0'
      }
      requestAnimationFrame(fadeIn)
      setTimeout(dismissCurtain, 350)
    }, undefined, () => { dismissCurtain() })

    /* Gold atmospheric particles */
    const PARTICLE_COUNT = 900
    const pPositions = new Float32Array(PARTICLE_COUNT * 3)
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const r = 80 + Math.random() * 260
      const th = Math.random() * Math.PI * 2
      const ph = Math.acos(2 * Math.random() - 1)
      pPositions[i * 3]     = r * Math.sin(ph) * Math.cos(th)
      pPositions[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th)
      pPositions[i * 3 + 2] = r * Math.cos(ph)
    }
    const pGeo = new THREE.BufferGeometry()
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3))
    const spriteC = document.createElement('canvas'); spriteC.width = 64; spriteC.height = 64
    const spCtx = spriteC.getContext('2d')!
    const spGrad = spCtx.createRadialGradient(32, 32, 0, 32, 32, 32)
    spGrad.addColorStop(0,   'rgba(226,201,126,1)')
    spGrad.addColorStop(0.4, 'rgba(201,168,76,0.55)')
    spGrad.addColorStop(1,   'rgba(201,168,76,0)')
    spCtx.fillStyle = spGrad; spCtx.fillRect(0, 0, 64, 64)
    const spriteTex = new THREE.CanvasTexture(spriteC)
    const pMat = new THREE.PointsMaterial({
      size: 2.4, map: spriteTex, transparent: true,
      blending: THREE.AdditiveBlending, depthWrite: false,
      color: 0xC9A84C, opacity: 0.55, sizeAttenuation: true,
    })
    const particlePoints = new THREE.Points(pGeo, pMat)
    scene.add(particlePoints)

    /* Hotspot screen projection */
    const hotspotEls = Array.from(document.querySelectorAll<HTMLElement>('.hotspot'))
    const _vec = new THREE.Vector3()
    function updateHotspots() {
      const w = window.innerWidth, h = window.innerHeight
      const curtainEl = document.getElementById('curtain')
      const revealOK = !curtainEl || curtainEl.classList.contains('gone')
      for (const el of hotspotEls) {
        const yawRad   = parseFloat(el.dataset.yaw   || '0')
        const pitchRad = parseFloat(el.dataset.pitch || '0')
        const r = 480
        _vec.set(
          r * Math.sin(yawRad) * Math.cos(pitchRad),
          r * Math.sin(pitchRad),
          -r * Math.cos(yawRad) * Math.cos(pitchRad)
        )
        _vec.project(camera)
        const inFront = _vec.z < 1
        const sx = (_vec.x * 0.5 + 0.5) * w
        const sy = (-_vec.y * 0.5 + 0.5) * h
        const visible = inFront && sx > 60 && sx < w - 240 && sy > 90 && sy < h - 90 && revealOK
        el.style.transform = `translate(${sx}px, ${sy}px) translate(-50%,-50%)`
        el.classList.toggle('show', visible)
      }
    }

    /* Camera animation */
    let panMX = 0, panMY = 0
    const onPanoMove = (e: MouseEvent) => {
      panMX = e.clientX / window.innerWidth - 0.5
      panMY = e.clientY / window.innerHeight - 0.5
    }
    window.addEventListener('mousemove', onPanoMove)
    const onPanoResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', onPanoResize)

    const BASE_YAW = 0
    let camYaw = BASE_YAW, camPitch = 0
    let tgtYaw = BASE_YAW, tgtPitch = 0
    const MAX_YAW = 0.60, MAX_PITCH = 0.18
    let panT = 0
    let panoRafId: number

    function panoAnimate() {
      panT += 0.0015
      particlePoints.rotation.y = panT * 0.25

      const sy = window.scrollY
      const maxSy = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      const scrollT = Math.max(0, Math.min(1, sy / maxSy))
      const secYaw = activeSectionYaw()
      const idleMs = Date.now() - ((window as Window & { lastUserInputAt?: number }).lastUserInputAt ?? Date.now())
      const idleDrift = idleMs > 12000 ? (idleMs - 12000) * 0.000015 : 0

      tgtYaw   = BASE_YAW + panMX * -MAX_YAW + secYaw + idleDrift
      tgtPitch = -panMY * MAX_PITCH - scrollT * 0.05
      if (REDUCED_MOTION) { tgtYaw = BASE_YAW; tgtPitch = 0 }

      camYaw   += (tgtYaw   - camYaw)   * 0.06
      camPitch += (tgtPitch - camPitch) * 0.06
      camera.rotation.y = camYaw
      camera.rotation.x = camPitch

      updateHotspots()
      renderer.render(scene, camera)
      panoRafId = requestAnimationFrame(panoAnimate)
    }
    panoRafId = requestAnimationFrame(panoAnimate)

    return () => {
      document.body.classList.remove('design-home')
      document.body.classList.remove('hov')
      document.body.classList.remove('cursor-dark')
      clearInterval(carouselTimer)
      clearInterval(timeInterval)
      cancelAnimationFrame(heroLoopId)
      cancelAnimationFrame(ringLoopId)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('scroll', onScrollHint)
      window.removeEventListener('mousemove', onMoveHint)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('touchstart', dismissHint)
      window.removeEventListener('keydown', onKeydown)
      heroSection?.removeEventListener('mousemove', onHeroMouseMove)
      heroSection?.removeEventListener('mouseleave', onHeroMouseLeave)
      qw?.removeEventListener('submit', handleQuote)
      enquiryForm?.removeEventListener('submit', handleEnquiry)
      io.disconnect()
      document.documentElement.dir = 'ltr'
      document.body.style.overflow = ''
      cancelAnimationFrame(panoRafId)
      window.removeEventListener('mousemove', onPanoMove)
      window.removeEventListener('resize', onPanoResize)
      ;(['mousemove', 'scroll', 'touchstart', 'keydown'] as const).forEach(ev =>
        window.removeEventListener(ev, trackIdle)
      )
      renderer.dispose()
      panoGeo.dispose()
      panoMat.dispose()
      pGeo.dispose()
      pMat.dispose()
      spriteTex.dispose()
    }
  }, [])

  return (
    <>
      <canvas className="site-canvas" id="heroCanvas"></canvas>
      <div className="site-tint"></div>
      <div className="site-glow"></div>

      {/* Panorama hotspots — positioned via Three.js projection */}
      <div className="hotspot" id="hs1" data-yaw="0" data-pitch="0.06">
        <div className="pin"></div>
        <div className="lbl">St. Joseph&apos;s Cathedral<span className="y">Harnet Avenue · 1923</span></div>
      </div>
      <div className="hotspot" id="hs2" data-yaw="-0.85" data-pitch="0.02">
        <div className="pin"></div>
        <div className="lbl">Asmara Skyline<span className="y">2,300 m · UNESCO Heritage</span></div>
      </div>
      <div className="hotspot" id="hs3" data-yaw="0.95" data-pitch="-0.04">
        <div className="pin"></div>
        <div className="lbl">Highland Horizon<span className="y">Eritrea · East Africa</span></div>
      </div>

      {/* Loading curtain */}
      <div className="curtain" id="curtain">
        <div className="mono">A<em>m</em>T</div>
        <div className="ltn"></div>
        <div className="ltn-lbl">Asmara, Eritrea</div>
      </div>

      {/* Look-around hint */}
      <div className="hint" id="hint">
        <div className="compass"></div>
        <div className="ht">Move · <b>Look Around Asmara</b></div>
      </div>

      {/* Sticky mobile CTA */}
      <div className="mobile-cta">
        <a href="tel:+29111180240" aria-label="Call">
          <svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.13.96.37 1.9.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.33 1.85.57 2.81.7A2 2 0 0122 16.92z"></path></svg>
          <span>Call</span>
        </a>
        <a href="https://wa.me/29111180240" target="_blank" rel="noopener" aria-label="WhatsApp">
          <svg viewBox="0 0 24 24"><path d="M20.5 3.5A11 11 0 003.4 16.6L2 22l5.5-1.4A11 11 0 1020.5 3.5z"></path></svg>
          <span>WhatsApp</span>
        </a>
        <a href="#contact" className="primary" aria-label="Book Consultation"><span>Enquire →</span></a>
      </div>

      <div className="cur-dot" id="curDot"></div>
      <div className="cur-ring" id="curRing"></div>
      <div className="scroll-bar" id="scrollBar"></div>

      <div className="rail">
        <span>Scroll</span>
        <div className="line" id="railLine"></div>
        <span>0%</span>
      </div>

      {/* NAV */}
      <nav className="nav ata-nav" id="ata-nav">
        <div className="brand">
          <a className="mono" href="#" aria-label="Amanuel Travel home">
            <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
              <text x="32" y="36" textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontSize="30" fontWeight="500" fill="#E2C97E" letterSpacing=".5" fontStyle="italic">A<tspan dx="-2" fontStyle="normal" fill="#C9A84C">t</tspan></text>
              <line x1="18" y1="45" x2="46" y2="45" stroke="#C9A84C" strokeWidth="0.7"></line>
            </svg>
          </a>
          <div className="stack">
            <div className="word">Amanuel <em>Travel</em></div>
            <div className="sub">Est. · Asmara, Eritrea</div>
          </div>
        </div>
        <ul className="nav-links">
          <li><a href="#destinations">Destinations</a></li>
          <li><a href="#services">Services</a></li>
          <li><a href="#why">About</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
        <div className="lang" id="langToggle">
          <button data-lang="en" className="active">EN</button>
          <button data-lang="ti">ትግ</button>
          <button data-lang="ar">عر</button>
          <button data-lang="it">IT</button>
        </div>
        <a href="#contact" className="nav-cta">Book Consultation</a>
      </nav>

      {/* HERO */}
      <section className="hero" id="hero">
        <div className="hero-bg" id="heroBg"></div>
        <div className="hero-tint"></div>
        <div className="grain"></div>

        <div className="hero-inner" id="heroInner">
          <div className="eyebrow fade-up d1">Asmara Cathedral · UNESCO World Heritage City</div>
          <h1>
            <span className="ln"><span className="thin">Travel With</span></span>
            <span className="ln"><span className="gold">Confidence</span></span>
            <span className="ln"><span className="thinner">From Eritrea</span></span>
          </h1>
          <p className="lead fade-up d2">A premium travel agency rooted in Asmara, serving the Eritrean diaspora and international travelers with <em>genuine human care</em>. Air tickets, facilitation, and consultation — handled by real experts.</p>
          <div className="hero-cta fade-up d3">
            <a href="#contact" className="btn-primary"><span>Plan Your Journey</span><span className="arr"></span></a>
            <a href="#services" className="btn-ghost">
              <span className="circ"><svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"></path></svg></span>
              <span>Explore Services</span>
            </a>
          </div>

          <form className="quote-widget" id="quoteWidget">
            <div className="qw-field">
              <label>From</label>
              <input type="text" name="from" placeholder="City of departure" required />
            </div>
            <div className="qw-field">
              <label>To</label>
              <select name="to" required>
                <option value="Asmara">Asmara, Eritrea</option>
                <option value="Massawa">Massawa</option>
                <option value="Keren">Keren</option>
                <option value="Dahlak Islands">Dahlak Islands</option>
                <option value="International">International route</option>
              </select>
            </div>
            <div className="qw-field">
              <label>When</label>
              <input type="text" name="when" placeholder="e.g. June 2026" required />
            </div>
            <button type="submit" className="qw-go"><span>Quote</span><span>→</span></button>
          </form>
        </div>

        <div className="scroll-ind fade-up d4">
          <div className="l"></div>
          <span>Scroll</span>
        </div>

        <div className="hero-stats" id="heroStats">
          <div className="h-stat">
            <div className="lbl">Air Tickets</div>
            <div className="desc">Local and international booking</div>
          </div>
          <div className="h-stat">
            <div className="lbl">Real Office</div>
            <div className="desc">Warsay St, Asmara · House 189</div>
          </div>
          <div className="h-stat">
            <div className="lbl">Human Support</div>
            <div className="desc">No bots. Real people. Real conversations.</div>
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="trust">
        <div className="seam reveal"><span className="num">I</span><span className="lbl">Our Foundations</span><span className="ln"></span></div>
        <div className="trust-grid">
          <div className="trust-item reveal">
            <div className="trust-icon"><svg viewBox="0 0 24 24"><path d="M2 16l20-8-8 20-2-8-10-4z"></path></svg></div>
            <div className="trust-title">Air Tickets</div>
            <div className="trust-desc">Local and international booking support with care for every detail.</div>
          </div>
          <div className="trust-item reveal">
            <div className="trust-icon"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"></circle><path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18"></path></svg></div>
            <div className="trust-title">Diaspora Ready</div>
            <div className="trust-desc">Serving Eritrean families and travelers around the world.</div>
          </div>
          <div className="trust-item reveal">
            <div className="trust-icon"><svg viewBox="0 0 24 24"><path d="M3 10l9-7 9 7v11a1 1 0 01-1 1h-5v-7H10v7H4a1 1 0 01-1-1V10z"></path></svg></div>
            <div className="trust-title">Physical Office</div>
            <div className="trust-desc">Warsay Street, House 189, Alpha Building.</div>
          </div>
          <div className="trust-item reveal">
            <div className="trust-icon"><svg viewBox="0 0 24 24"><path d="M16 3a4 4 0 100 8 4 4 0 000-8zM8 13a4 4 0 100 8 4 4 0 000-8zM20 21v-2a4 4 0 00-3-3.87M11 5.13A4 4 0 0011 13"></path></svg></div>
            <div className="trust-title">Human Support</div>
            <div className="trust-desc">Real consultations — never automated systems.</div>
          </div>
        </div>
      </section>

      {/* DESTINATIONS */}
      <section className="section dest" id="destinations">
        <div className="seam reveal"><span className="num">II</span><span className="lbl">Destinations</span><span className="ln"></span></div>
        <div className="sec-head">
          <div>
            <div className="eyebrow reveal">Destinations</div>
            <h2 className="reveal" style={{ marginTop: 28 }}>Where Will Your Journey<br /><span className="it">Take You</span></h2>
          </div>
          <div className="meta reveal">
            <span className="num">04</span>
            Curated routes across Eritrea and beyond — from coastal cities to highland markets.
          </div>
        </div>

        <div className="dest-grid">
          <a href="#contact" className="dest-card reveal" data-dest="Massawa">
            <div className="dest-img" style={{ backgroundImage: "url('/images/dest-massawa.jpg')" }}></div>
            <div className="dest-grad"></div>
            <div className="dest-arr"><svg viewBox="0 0 24 24"><path d="M5 19L19 5M9 5h10v10"></path></svg></div>
            <div className="dest-content">
              <span className="dest-tag">Massawa · Red Sea, Eritrea</span>
              <div className="dest-name">Massawa</div>
              <div className="dest-sub">Ancient port city on the Red Sea coast.</div>
            </div>
          </a>
          <a href="#contact" className="dest-card reveal" data-dest="Asmara">
            <div className="dest-img" style={{ backgroundImage: "url('/images/dest-asmara.jpg')" }}></div>
            <div className="dest-grad"></div>
            <div className="dest-arr"><svg viewBox="0 0 24 24"><path d="M5 19L19 5M9 5h10v10"></path></svg></div>
            <div className="dest-content">
              <span className="dest-tag">Asmara · Capital, Eritrea</span>
              <div className="dest-name">Asmara</div>
              <div className="dest-sub">UNESCO World Heritage art deco city.</div>
            </div>
          </a>
          <a href="#contact" className="dest-card reveal" data-dest="Dahlak Islands">
            <div className="dest-img" style={{ backgroundImage: "url('/images/dest-dahlak.jpg')" }}></div>
            <div className="dest-grad"></div>
            <div className="dest-arr"><svg viewBox="0 0 24 24"><path d="M5 19L19 5M9 5h10v10"></path></svg></div>
            <div className="dest-content">
              <span className="dest-tag">Dahlak Islands · Red Sea</span>
              <div className="dest-name">Dahlak Islands</div>
              <div className="dest-sub">Coral-stone ruins of an ancient Red Sea trading port.</div>
            </div>
          </a>
          <a href="#contact" className="dest-card reveal" style={{ gridColumn: '2' }} data-dest="Keren">
            <div className="dest-img" style={{ backgroundImage: "url('/images/dest-keren.jpg')" }}></div>
            <div className="dest-grad"></div>
            <div className="dest-arr"><svg viewBox="0 0 24 24"><path d="M5 19L19 5M9 5h10v10"></path></svg></div>
            <div className="dest-content">
              <span className="dest-tag">Keren · Highland, Eritrea</span>
              <div className="dest-name">Keren</div>
              <div className="dest-sub">Blue-domed churches and highland heritage in the Anseba.</div>
            </div>
          </a>
        </div>
      </section>

      {/* OFFICE STRIP */}
      <section className="office" id="office">
        <div className="office-head">
          <div>
            <div className="eyebrow reveal">Our Office</div>
            <h2 className="reveal" style={{ marginTop: 24 }}>Real Walls. <span className="it">Real Faces.</span></h2>
          </div>
          <div className="meta reveal">A small team in Asmara. You can call, walk in, and sit down with the person handling your journey.</div>
        </div>
        <div className="office-strip">
          <div className="office-shot placeholder reveal">
            <div className="img"></div>
            <div className="cap">Storefront <span className="y">Warsay Street · Asmara</span></div>
          </div>
          <div className="office-shot placeholder reveal">
            <div className="img"></div>
            <div className="cap">The team <span className="y">Open since established</span></div>
          </div>
          <div className="office-shot placeholder reveal">
            <div className="img"></div>
            <div className="cap">Booking desk <span className="y">Alpha Building · House 189</span></div>
          </div>
        </div>
      </section>

      {/* PARTNERS */}
      <section className="partners">
        <div className="partners-row">
          <div className="partners-lbl">Trusted Routing Partners</div>
          <span className="partner"><span className="dot"></span>Ethiopian Airlines</span>
          <span className="partner"><span className="dot"></span>Turkish Airlines</span>
          <span className="partner"><span className="dot"></span>EgyptAir</span>
          <span className="partner"><span className="dot"></span>Emirates</span>
          <span className="partner"><span className="dot"></span>flydubai</span>
          <span className="partner"><span className="dot"></span>Qatar Airways</span>
        </div>
      </section>

      {/* SERVICES */}
      <section className="section serv" id="services">
        <div className="seam reveal"><span className="num">III</span><span className="lbl">Services</span><span className="ln"></span></div>
        <div className="sec-head">
          <div>
            <div className="eyebrow dark reveal">Services</div>
            <h2 className="reveal" style={{ marginTop: 28 }}>Everything You Need<br /><span className="it">In One Place</span></h2>
          </div>
          <div className="meta reveal">
            <span className="num">06</span>
            A full suite of travel services — designed to remove friction at every step of your journey.
          </div>
        </div>

        <div className="serv-grid">
          {[
            { n: '01', title: 'Air Ticket Booking', desc: 'Local and international flight reservations across major airlines — competitive fares and flexible options.' },
            { n: '02', title: 'Travel Facilitation', desc: 'End-to-end coordination of documents, logistics, and travel arrangements — handled by people who know the process.' },
            { n: '03', title: 'Travel Consultation', desc: 'Personal advice on routes, timing, and destinations — based on decades of regional expertise.' },
            { n: '04', title: 'Event Coordination', desc: 'Group travel and event management for weddings, reunions, conferences, and community gatherings.' },
            { n: '05', title: 'Diaspora Travel Support', desc: 'Specialized assistance for Eritrean families abroad — visits home, family reunifications, and complex itineraries.' },
            { n: '06', title: 'International Support', desc: 'Multi-leg international journeys with full support at every connection — from Asmara to anywhere.' },
          ].map(s => (
            <div className="serv-card reveal" key={s.n}>
              <div className="serv-num">{s.n}</div>
              <div className="serv-title">{s.title}</div>
              <div className="serv-desc">{s.desc}</div>
              <a href="#contact" className="serv-link">Enquire Now <span>→</span></a>
            </div>
          ))}
        </div>
      </section>

      {/* WHY */}
      <section className="section why" id="why">
        <div className="seam reveal"><span className="num">IV</span><span className="lbl">Why Amanuel</span><span className="ln"></span></div>
        <div className="why-watermark">Trust</div>
        <div className="why-grid">
          <div className="why-left">
            <div className="eyebrow reveal">Why Amanuel</div>
            <h2 className="reveal">Built on Real Relationships,<br /><span className="it">Not Algorithms</span></h2>
            <p className="reveal">For travelers between Eritrea and the world, the journey is rarely just about tickets. It is about <em>family</em>, timing, and trust. We are a small team in Asmara — people you can call, visit, and rely on.</p>
            <a href="#contact" className="btn-primary reveal"><span>Speak With Us</span><span className="arr"></span></a>
          </div>
          <div className="why-right">
            {[
              { n: '01', h: 'Real Physical Presence', p: 'Office at Warsay Street, House 189, Alpha Building, Asmara — open doors and real handshakes.' },
              { n: '02', h: 'Human Consultation Always', p: 'No bots. No automated replies. Every question reaches a real travel expert who knows your route.' },
              { n: '03', h: 'Community Understanding', p: 'We know the Eritrean traveler and diaspora deeply — the routes, the season, the family logic.' },
              { n: '04', h: 'Responsive Communication', p: 'Phone, email, WhatsApp — we respond quickly, with clarity, in the channels you actually use.' },
            ].map(pt => (
              <div className="why-pt reveal-r" key={pt.n}>
                <div className="n">{pt.n}</div>
                <div className="body">
                  <h3>{pt.h}</h3>
                  <p>{pt.p}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="test">
        <div className="seam reveal" style={{ marginBottom: 50 }}><span className="num">V</span><span className="lbl">Voices</span><span className="ln"></span></div>
        <div className="test-mark">&ldquo;</div>
        <div className="test-inner">
          <div className="eyebrow reveal" style={{ justifyContent: 'center', display: 'inline-flex' }}>A Word From Our Clients</div>
          <div className="test-carousel" id="testCarousel">
            {[
              { q: '"Amanuel Travel made our <span class="h">family reunion</span> possible. They handled everything — tickets, coordination, and all the details — with patience and professionalism we did not expect."', a: 'N.G. · Diaspora Client · Toronto, Canada' },
              { q: '"After years of complicated bookings through other agencies, finding Amanuel was a relief. They understand the <span class="h">Eritrean traveler</span> in a way nobody else does."', a: 'S.T. · Business Traveler · Frankfurt, Germany' },
              { q: '"We brought twenty-eight people from four countries to Asmara for a wedding. Every flight, every connection, every detail — <span class="h">flawless</span>."', a: 'H.M. · Event Organizer · Stockholm, Sweden' },
              { q: '"They picked up the phone at ten at night to help me reroute a flight. <span class="h">Real people, real care.</span> I cannot recommend them enough."', a: 'R.K. · Family Traveler · Melbourne, Australia' },
            ].map((t, i) => (
              <div className={`test-slide${i === 0 ? ' active' : ''}`} key={i}>
                <blockquote dangerouslySetInnerHTML={{ __html: t.q }} />
                <div className="attr">{t.a}</div>
              </div>
            ))}
          </div>
          <div className="test-dots" id="testDots">
            {[0, 1, 2, 3].map(i => (
              <button key={i} className={`test-dot${i === 0 ? ' active' : ''}`} data-slide={String(i)} aria-label={`Show testimonial ${i + 1}`}></button>
            ))}
          </div>
        </div>
      </section>

      {/* JOURNAL */}
      <section className="journal" id="journal">
        <div className="seam reveal"><span className="num">VI</span><span className="lbl">Journal</span><span className="ln"></span></div>
        <div className="sec-head">
          <div>
            <div className="eyebrow reveal">Editorial</div>
            <h2 className="reveal" style={{ marginTop: 28 }}>Notes From the <br /><span className="it">Road Home</span></h2>
          </div>
          <div className="meta reveal">
            <span className="num">03</span>
            Slow reading for travelers who want to understand the journey before booking it.
          </div>
        </div>
        <div className="journal-grid">
          {[
            { key: 'genna', num: '01', tag: 'Diaspora Guide', title: "A Diaspora Family's Guide to Flying Home for Genna", excerpt: 'January in Asmara is cold. The Genna season brings churches alive, but the airport routes fill quickly. Here is how to book early, route smartly, and arrive home rested.', meta: ['9 min read', 'Travel Notes'] },
            { key: 'season', num: '02', tag: 'Practical', title: "Understanding Eritrea's Travel Season", excerpt: "There is the calendar, and there is the rhythm of family. Booking around Eritrean holidays — Meskel, Genna, Independence Day — is a different art than booking around fares.", meta: ['7 min read', 'Travel Notes'] },
            { key: 'redsea', num: '03', tag: 'Destinations', title: 'What to Pack for the Red Sea Coast', excerpt: 'Massawa is hotter than you imagine and brighter than you expect. A short, honest packing essay for travelers heading down from the highland into the coastal heat.', meta: ['5 min read', 'Field Notes'] },
          ].map(a => (
            <article className="j-card reveal" data-article={a.key} key={a.key}>
              <div className="j-num">{a.num}</div>
              <div className="j-tag">{a.tag}</div>
              <h3>{a.title}</h3>
              <p className="excerpt">{a.excerpt}</p>
              <div className="j-meta"><span>{a.meta[0]}</span><span className="dt"></span><span>{a.meta[1]}</span></div>
              <span className="j-link">Read essay <span>→</span></span>
            </article>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="faq" id="faq">
        <div className="seam reveal"><span className="num">VII</span><span className="lbl">Questions</span><span className="ln"></span></div>
        <div className="faq-grid">
          <div className="faq-left">
            <div className="eyebrow reveal">Frequently Asked</div>
            <h2 className="reveal">Travel Between <span className="it">Eritrea &amp; The World</span></h2>
            <p className="reveal">The diaspora has questions no algorithm can answer. These come up most often. If yours isn&apos;t here, call us — a real person picks up.</p>
          </div>
          <div className="faq-list">
            {[
              { q: 'When is the best time to book diaspora flights home?', a: 'For peak seasons like <em>Genna</em> (January) and the summer months, we recommend booking <em>three to four months ahead</em>. Eritrean Independence Day (May) and Meskel (September) also fill early. The earlier you book, the more flexibility we have on routing and fares.' },
              { q: 'Do you only book flights to and from Asmara?', a: 'No. We book <em>any</em> international or domestic route. Most of our diaspora clients fly through hubs like Addis Ababa, Cairo, Istanbul, Dubai, or Frankfurt. We handle the full itinerary, including the connections.' },
              { q: 'Can you help with travel documents and visas?', a: 'Yes — we offer <em>travel facilitation</em> as a service. While we are not a visa-issuing agency, we guide you through requirements, timelines, and the practical steps for both inbound and outbound travel.' },
              { q: 'Do you coordinate group travel for weddings, reunions or events?', a: 'Group travel is one of our specialties. From <em>family reunions</em> bringing relatives across continents, to <em>community pilgrimages</em>, to corporate and event travel — we coordinate flights, timing, and logistics so the group arrives together.' },
              { q: "What's the fastest way to reach you for an urgent question?", a: 'For urgent travel issues, <em>WhatsApp</em> is fastest — we typically reply within the hour during business hours. The phone line is staffed during office hours in Asmara (EAT, UTC+3).' },
              { q: 'Can I pay from abroad? What currencies do you accept?', a: 'We work with <em>diaspora clients globally</em> and have multiple ways to settle bookings depending on your country of departure. Once we understand your trip, we\'ll walk you through the cleanest payment route for your situation.' },
              { q: 'Do you offer support for travelers visiting Eritrea for the first time?', a: 'Absolutely. First-time visitors get a longer consultation — we cover <em>what to expect</em> on arrival, local logistics in Asmara, day trips to Massawa and Keren, and how to read the rhythm of the city.' },
              { q: 'What if my plans change after booking?', a: 'Plans change — we know. Change and cancellation policies depend on the fare class and the airline, but because we book it for you, we handle <em>the entire change process</em> on your behalf. No hold music, no IVR menus.' },
            ].map((item, i) => (
              <div className="faq-item reveal" key={i}>
                <button className="faq-q" aria-expanded="false">{item.q} <span className="icn">+</span></button>
                <div className="faq-a"><div className="faq-a-inner" dangerouslySetInnerHTML={{ __html: item.a }} /></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="section contact" id="contact">
        <div className="seam reveal"><span className="num">VIII</span><span className="lbl">Begin Your Journey</span><span className="ln"></span></div>
        <div className="contact-grid">
          <div className="contact-left">
            <div className="eyebrow reveal">Contact</div>
            <h2 className="reveal">Ready to Start<br /><span className="it">Your Journey?</span></h2>
            <p className="reveal">Tell us where you&apos;re going. Whether it&apos;s a family visit, a complex multi-leg trip, or a group event — we&apos;ll handle it from start to finish.</p>

            <div className="reveal">
              <a className="c-row" href="tel:+29111180240" aria-label="Call Amanuel Travel">
                <div className="c-icon"><svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.13.96.37 1.9.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.33 1.85.57 2.81.7A2 2 0 0122 16.92z"></path></svg></div>
                <div className="c-text"><div className="lbl">Telephone</div><div className="val">00 291 1 180240</div></div>
              </a>
              <a className="c-row" href="mailto:amanueltravel@gmail.com" aria-label="Email Amanuel Travel">
                <div className="c-icon"><svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><path d="M22 6l-10 7L2 6"></path></svg></div>
                <div className="c-text"><div className="lbl">Email</div><div className="val">amanueltravel@gmail.com</div></div>
              </a>
              <a className="c-row" href="https://www.google.com/maps/search/?api=1&query=Warsay+Street+House+189+Alpha+Building+Asmara+Eritrea" target="_blank" rel="noopener" aria-label="Get directions">
                <div className="c-icon"><svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"></path><circle cx="12" cy="10" r="3"></circle></svg></div>
                <div className="c-text"><div className="lbl">Office</div><div className="val">Warsay Street, House 189<br />Alpha Building, Asmara, Eritrea</div></div>
              </a>
            </div>

            <a className="whatsapp reveal" href="https://wa.me/29111180240" target="_blank" rel="noopener" aria-label="WhatsApp Amanuel Travel">
              <span className="wa-dot"></span>
              <span>Quick contact via WhatsApp · We typically reply within the hour</span>
              <span className="wa-arr">↗</span>
            </a>
          </div>

          <div className="form-box reveal">
            <h3>Send an <em>Enquiry</em></h3>
            <form action="#">
              <div className="f-row">
                <div className="field" style={{ marginBottom: 0 }}>
                  <label>Full Name</label>
                  <input type="text" name="name" placeholder="Your full name" required />
                </div>
                <div className="field" style={{ marginBottom: 0 }}>
                  <label>Phone</label>
                  <input type="tel" name="phone" placeholder="+xxx ..." required />
                </div>
              </div>
              <div className="field">
                <label>Email Address</label>
                <input type="email" name="email" placeholder="you@example.com" required />
              </div>
              <div className="field">
                <label>Service Required</label>
                <select name="service" required>
                  <option value="">Select a service</option>
                  <option>Air Ticket Booking</option>
                  <option>Travel Facilitation</option>
                  <option>Travel Consultation</option>
                  <option>Event Coordination</option>
                  <option>Diaspora Travel Support</option>
                  <option>International Support</option>
                </select>
              </div>
              <div className="field">
                <label>Travel Details</label>
                <textarea name="details" placeholder="Tell us about your travel — dates, destination, number of travelers..." rows={4}></textarea>
              </div>
              <button type="submit" className="f-submit"><span>Send Enquiry</span><span>→</span></button>
            </form>
          </div>
        </div>
      </section>

      {/* Journal modal */}
      <div className="j-modal" id="jModal" role="dialog" aria-modal={true} aria-labelledby="jModalTitle">
        <div className="panel">
          <button className="close" id="jClose" aria-label="Close article">✕</button>
          <div id="jBody"></div>
        </div>
      </div>

      {/* Now in Asmara strip */}
      <div className="now-strip">
        <span className="live">Live</span>
        <span>Now in Asmara</span>
        <span className="sep">·</span>
        <span className="time" id="asmaraTime">—</span>
        <span className="sep">·</span>
        <span>EAT · UTC +3</span>
      </div>

      {/* FOOTER */}
      <footer className="foot">
        <div className="left">© <span id="yr"></span> Amanuel Travel Agency · All rights reserved
          <div className="foot-actions" style={{ justifyContent: 'flex-start' }}>
            <button className="print-btn" onClick={() => window.print()} aria-label="Print brochure">
              <svg viewBox="0 0 24 24"><path d="M6 9V3h12v6M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v7H6z"></path></svg>
              Download / Print Brochure
            </button>
          </div>
        </div>
        <div className="mid"><span className="dt"></span>Connecting Eritrea to the World<span className="dt"></span></div>
        <div className="right">amanueltravel.com</div>
      </footer>
    </>
  )
}
