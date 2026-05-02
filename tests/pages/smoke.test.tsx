import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import Home from '../../src/pages/Home'
import Contact from '../../src/pages/Contact'

// Helper to render with MemoryRouter
function renderWithMemoryRouter(ui: React.ReactElement, { initialEntries = ['/'] } = {}) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      {ui}
    </MemoryRouter>
  )
}

describe('Smoke Tests', () => {
  beforeEach(() => {
    // Mock IntersectionObserver for scroll animations
    const mockIntersectionObserver = vi.fn()
    mockIntersectionObserver.mockReturnValue({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    })
    window.IntersectionObserver = mockIntersectionObserver as unknown as typeof IntersectionObserver
    
    // Mock window.scrollTo
    vi.stubGlobal('scrollTo', vi.fn())
  })

  describe('Home Page', () => {
    it('renders without crashing', () => {
      renderWithMemoryRouter(
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>,
        { initialEntries: ['/'] }
      )
      
      expect(document.body).toBeInTheDocument()
    })

    it('displays hero section with name', () => {
      renderWithMemoryRouter(
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>,
        { initialEntries: ['/'] }
      )
      
      // Hero section displays name from siteConfig
      expect(screen.getByText(/Bùi Bảo Long/i)).toBeInTheDocument()
    })

    it('displays hero accent text', () => {
      renderWithMemoryRouter(
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>,
        { initialEntries: ['/'] }
      )
      
      expect(screen.getByText(/Prompt Engineering/i)).toBeInTheDocument()
    })

    it('displays tech stack section', () => {
      renderWithMemoryRouter(
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>,
        { initialEntries: ['/'] }
      )
      
      // Tech Stack is split across elements - check for "Stack" which is in the accent span
      expect(screen.getByText(/Stack/i)).toBeInTheDocument()
    })

    it('displays projects section', () => {
      renderWithMemoryRouter(
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>,
        { initialEntries: ['/'] }
      )
      
      // Selected Works is split across elements - check for "Works" which is in the accent span  
      expect(screen.getByText(/Works/i)).toBeInTheDocument()
    })

    it('displays about section', () => {
      renderWithMemoryRouter(
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>,
        { initialEntries: ['/'] }
      )
      
      expect(screen.getByText(/More than code/i)).toBeInTheDocument()
    })

  })

  describe('Contact Page', () => {
    it('renders without crashing', () => {
      renderWithMemoryRouter(
        <Routes>
          <Route path="/contact" element={<Contact />} />
        </Routes>,
        { initialEntries: ['/contact'] }
      )
      
      expect(document.body).toBeInTheDocument()
    })

    it('displays contact form elements', () => {
      renderWithMemoryRouter(
        <Routes>
          <Route path="/contact" element={<Contact />} />
        </Routes>,
        { initialEntries: ['/contact'] }
      )
      
      expect(screen.getByPlaceholderText(/nq2019.buibaolong281104@gmail.com/i)).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/Tell me what you're building/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Send message/i })).toBeInTheDocument()
    })

    it('displays contact header/title', () => {
      renderWithMemoryRouter(
        <Routes>
          <Route path="/contact" element={<Contact />} />
        </Routes>,
        { initialEntries: ['/contact'] }
      )
      
      expect(screen.getByText(/Say hello to me/i)).toBeInTheDocument()
    })

  })

})
