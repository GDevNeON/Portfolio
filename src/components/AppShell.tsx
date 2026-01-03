import { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { siteConfig } from '../siteConfig'
import ThemeToggle from './ThemeToggle'
import BackgroundPanelCycler from './BackgroundPanelCycler'

export default function AppShell() {
  const location = useLocation()
  const navigate = useNavigate()
  const [activeSectionId, setActiveSectionId] = useState('home')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>('[data-scroll-section]'),
    )

    if (nodes.length === 0) {
      setActiveSectionId(location.pathname === '/contact' ? 'contact' : 'home')
      return
    }

    const activeIo = new IntersectionObserver(
      (ioEntries) => {
        const candidates = ioEntries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))

        const best = candidates[0]?.target as HTMLElement | undefined
        if (best?.id) setActiveSectionId(best.id)
      },
      { root: null, threshold: [0.15, 0.25, 0.35, 0.5], rootMargin: '-35% 0px -50% 0px' },
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
      { root: null, threshold: 0.12, rootMargin: '0px 0px -10% 0px' },
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

  useEffect(() => {
    const update = () => {
      const els = Array.from(document.querySelectorAll<HTMLElement>('.supportFrame'))
      if (els.length === 0) return

      const cx = window.innerWidth / 2
      const cy = window.innerHeight / 2

      let best = els[0]
      let bestD = Number.POSITIVE_INFINITY
      for (const el of els) {
        const r = el.getBoundingClientRect()
        const x = r.left + r.width / 2
        const y = r.top + r.height / 2
        const d = (x - cx) * (x - cx) + (y - cy) * (y - cy)
        if (d < bestD) {
          bestD = d
          best = el
        }
      }
      console.log('Closest element:', best)
    }

    update()
    const onResize = () => update()
    window.addEventListener('resize', onResize)
    const t = window.setInterval(update, 350)
    return () => {
      window.removeEventListener('resize', onResize)
      window.clearInterval(t)
    }
  }, [activeSectionId])

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
      <BackgroundPanelCycler />

      <div className="bgBlobs" aria-hidden="true">
        <div className="blob blob--a" />
        <div className="blob blob--b" />
        <div className="blob blob--c" />
      </div>

      <header className="navBar">
        <div className="navInner">
          <div className="brand">
            {siteConfig.ui.navigation.brandName}<span className="brandDot">{siteConfig.ui.navigation.brandDot}</span>
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
              className="mobileMenuToggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={siteConfig.ui.common.closeNotification}
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
      <div className={`mobileMenu ${mobileMenuOpen ? 'show' : ''}`}>
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

      <main className="appMain">
        <Outlet />
      </main>

      <footer className="footer">
        <div className="footerLine" />
        <div className="footerBlob" />
        <div className="footerContent">
          <h2 className="footerTitle">{siteConfig.ui.footer.title}</h2>
          <div className="footerSocial">
            <a href="#" className="footerSocialLink">
              <span className="footerSocialText">In</span>
            </a>
            <a href="#" className="footerSocialLink">
              <span className="footerSocialText">X</span>
            </a>
            <a href="#" className="footerSocialLink">
              <span className="footerSocialText">Gh</span>
            </a>
          </div>
          <p className="footerCopyright">{siteConfig.ui.footer.copyright}</p>
        </div>
      </footer>
    </div>
  )
}
