import { useEffect, useRef, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { siteConfig } from '../siteConfig'
import ThemeToggle from './ThemeToggle'
import BackgroundPanelCycler from './BackgroundPanelCycler'

export default function AppShell() {
  const location = useLocation()
  const navigate = useNavigate()
  const [activeSectionId, setActiveSectionId] = useState('home')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const mobileMenuToggleRef = useRef<HTMLButtonElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  // IntersectionObserver with mobile-responsive thresholds
  useEffect(() => {
    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>('[data-scroll-section]'),
    )

    if (nodes.length === 0) {
      setActiveSectionId(location.pathname === '/contact' ? 'contact' : 'home')
      return
    }

    const isMobile = window.matchMedia('(max-width: 768px)').matches

    const activeIo = new IntersectionObserver(
      (ioEntries) => {
        const candidates = ioEntries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))

        const best = candidates[0]?.target as HTMLElement | undefined
        if (best?.id) setActiveSectionId(best.id)
      },
      {
        root: null,
        threshold: [0.15, 0.25, 0.35, 0.5],
        rootMargin: isMobile ? '-20% 0px -30% 0px' : '-35% 0px -50% 0px',
      },
    )

    const revealIo = new IntersectionObserver(
      (ioEntries, observer) => {
        for (const entry of ioEntries) {
          if (!entry.isIntersecting) continue
          const el = entry.target as HTMLElement
          el.classList.add('is-visible')
          observer.unobserve(el)
        }
      },
      {
        root: null,
        threshold: 0.12,
        rootMargin: isMobile ? '0px 0px -5% 0px' : '0px 0px -10% 0px',
      },
    )

    for (const n of nodes) {
      activeIo.observe(n)
      revealIo.observe(n)
    }

    return () => {
      activeIo.disconnect()
      revealIo.disconnect()
    }
  }, [location.pathname])

  // Focus trap for mobile menu
  useEffect(() => {
    if (!mobileMenuOpen) {
      // Return focus to toggle button when menu closes
      if (previousFocusRef.current) {
        previousFocusRef.current.focus()
        previousFocusRef.current = null
      }
      return
    }

    // Store previously focused element
    previousFocusRef.current = document.activeElement as HTMLElement

    const menu = mobileMenuRef.current
    if (!menu) return

    const focusableElements = menu.querySelectorAll<HTMLElement>(
      'button, a, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    // Focus first element when menu opens
    firstElement?.focus()

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false)
        return
      }

      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [mobileMenuOpen])

  const scrollToSection = (id: string) => {
    if (location.pathname !== '/') {
      navigate('/')
      window.setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 80)
      return
    }

    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="appRoot" data-active-section={activeSectionId}>
      <a href="#main-content" className="skipLink">
        Skip to main content
      </a>
      <BackgroundPanelCycler />

      <div className="bgBlobs" aria-hidden="true">
        <div className="blob blob--a" />
        <div className="blob blob--b" />
        <div className="blob blob--c" />
      </div>

      <header className="navBar">
        <div className="navInner">
          <div className="brand">
            <img 
              src="/neon-icon.png" 
              alt="NEON.DEV" 
              className="brandIcon"
              onClick={() => scrollToSection('home')}
            />
          </div>

          <div className="navLinks">
            <button type="button" className="navLink" onClick={() => scrollToSection('home')}>
              {siteConfig.ui.navigation.home}
            </button>
            <button type="button" className="navLink" onClick={() => scrollToSection('stack')}>
              {siteConfig.ui.navigation.stack}
            </button>
            <button
              type="button"
              className="navLink"
              onClick={() => scrollToSection('projects')}
            >
              {siteConfig.ui.navigation.work}
            </button>
            <button type="button" className="navLink" onClick={() => scrollToSection('about')}>
              {siteConfig.ui.navigation.about}
            </button>
            <button
              type="button"
              className="navLink"
              onClick={() => navigate('/contact')}
            >
              {siteConfig.ui.navigation.contact}
            </button>

            <ThemeToggle />
            
            <button
              ref={mobileMenuToggleRef}
              className="mobileMenuToggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      <div
        id="mobile-menu"
        ref={mobileMenuRef}
        className={`mobileMenu ${mobileMenuOpen ? 'show' : ''}`}
      >
          <button type="button" className="mobileNavLink" onClick={() => { scrollToSection('home'); setMobileMenuOpen(false); }}>
            {siteConfig.ui.navigation.home}
          </button>
          <button type="button" className="mobileNavLink" onClick={() => { scrollToSection('stack'); setMobileMenuOpen(false); }}>
            {siteConfig.ui.navigation.stack}
          </button>
          <button type="button" className="mobileNavLink" onClick={() => { scrollToSection('projects'); setMobileMenuOpen(false); }}>
            {siteConfig.ui.navigation.work}
          </button>
          <button type="button" className="mobileNavLink" onClick={() => { scrollToSection('about'); setMobileMenuOpen(false); }}>
            {siteConfig.ui.navigation.about}
          </button>
          <button type="button" className="mobileNavLink" onClick={() => { navigate('/contact'); setMobileMenuOpen(false); }}>
            {siteConfig.ui.navigation.contact}
          </button>
        </div>

      <main id="main-content" className="appMain">
        <Outlet />
      </main>

      <footer className="footer">
        <div className="footerLine" />
        <div className="footerBlob" />
        <div className="footerContent">
          <h2 className="footerTitle">{siteConfig.ui.footer.title}</h2>
          <div className="footerSocial">
            <a href={siteConfig.social.facebook} className="footerSocialLink" target="_blank" rel="noreferrer">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a href={siteConfig.social.github} className="footerSocialLink" target="_blank" rel="noreferrer">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
            <a href={siteConfig.social.linkedin} className="footerSocialLink" target="_blank" rel="noreferrer">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
            {siteConfig.cvUrl && (
              <a href={siteConfig.cvUrl} className="footerSocialLink" target="_blank" rel="noreferrer">
                <span className="footerSocialText">CV</span>
              </a>
            )}
          </div>
          <p className="footerCopyright">{siteConfig.ui.footer.copyright}</p>
        </div>
      </footer>
    </div>
  )
}
