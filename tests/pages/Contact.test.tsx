import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '../utils/test-utils'
import { createMockLocalStorage } from '../utils/browser-mocks'
import { mockEmailJS } from '../mocks/emailjs'
import Contact from '../../src/pages/Contact'

// Mock environment variables
beforeEach(() => {
  vi.stubEnv('VITE_EMAILJS_SERVICE_ID', 'test_service_id')
  vi.stubEnv('VITE_EMAILJS_TEMPLATE_ID', 'test_template_id')
  vi.stubEnv('VITE_EMAILJS_PUBLIC_KEY', 'test_public_key')
})

describe('Contact Page', () => {
  let mockStorage: ReturnType<typeof createMockLocalStorage>

  beforeEach(() => {
    mockStorage = createMockLocalStorage()
    vi.stubGlobal('localStorage', mockStorage)
    mockEmailJS._reset()
    
    // Reset env vars to valid state
    vi.stubEnv('VITE_EMAILJS_SERVICE_ID', 'test_service_id')
    vi.stubEnv('VITE_EMAILJS_TEMPLATE_ID', 'test_template_id')
    vi.stubEnv('VITE_EMAILJS_PUBLIC_KEY', 'test_public_key')
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('renders contact form with all fields', () => {
    render(<Contact />)
    
    expect(screen.getByPlaceholderText(/nq2019.buibaolong281104@gmail.com/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/Tell me what you're building/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Send message/i })).toBeInTheDocument()
  })

  it('shows error when email is empty', async () => {
    render(<Contact />)
    
    const messageInput = screen.getByPlaceholderText(/Tell me what you're building/i)
    fireEvent.change(messageInput, { target: { value: 'Test message' } })
    
    screen.getByRole('button', { name: /Send message/i }).click()
    
    await waitFor(() => {
      expect(screen.getByText(/Please check your email and contents/i)).toBeInTheDocument()
    })
  })

  it('shows error when message is empty', async () => {
    render(<Contact />)
    
    const emailInput = screen.getByPlaceholderText(/nq2019.buibaolong281104@gmail.com/i)
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    
    screen.getByRole('button', { name: /Send message/i }).click()
    
    await waitFor(() => {
      expect(screen.getByText(/Please check your email and contents/i)).toBeInTheDocument()
    })
  })

  it('shows error for invalid email format', async () => {
    render(<Contact />)
    
    const emailInput = screen.getByPlaceholderText(/nq2019.buibaolong281104@gmail.com/i)
    const messageInput = screen.getByPlaceholderText(/Tell me what you're building/i)
    
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } })
    fireEvent.change(messageInput, { target: { value: 'Test message' } })
    
    screen.getByRole('button', { name: /Send message/i }).click()
    
    await waitFor(() => {
      expect(screen.getByText(/Invalid Email, please check your input/i)).toBeInTheDocument()
    })
  })

  it('shows error when EmailJS env vars are missing', async () => {
    vi.stubEnv('VITE_EMAILJS_SERVICE_ID', '')
    
    render(<Contact />)
    
    const emailInput = screen.getByPlaceholderText(/nq2019.buibaolong281104@gmail.com/i)
    const messageInput = screen.getByPlaceholderText(/Tell me what you're building/i)
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(messageInput, { target: { value: 'Test message' } })
    
    screen.getByRole('button', { name: /Send message/i }).click()
    
    await waitFor(() => {
      expect(screen.getByText(/Missing EmailJS configuration/i)).toBeInTheDocument()
    })
  })

  it('allows 3 submissions before rate limiting', async () => {
    render(<Contact />)
    
    for (let i = 0; i < 3; i++) {
      const emailInput = screen.getByPlaceholderText(/nq2019.buibaolong281104@gmail.com/i)
      const messageInput = screen.getByPlaceholderText(/Tell me what you're building/i)
      
      fireEvent.change(emailInput, { target: { value: `test${i}@example.com` } })
      fireEvent.change(messageInput, { target: { value: `Test message ${i}` } })
      
      screen.getByRole('button', { name: /Send message/i }).click()
      
      await waitFor(() => {
        expect(screen.getByText(/Sent successfully/i)).toBeInTheDocument()
      })
      
      // Clear for next iteration
      fireEvent.change(messageInput, { target: { value: '' } })
    }
    
    expect(mockEmailJS._getAllCalls()).toHaveLength(3)
  })

  it('blocks 4th submission with rate limit message', async () => {
    // Pre-populate rate limit data (3 submissions within window)
    const now = Date.now()
    mockStorage.getItem.mockReturnValue(
      JSON.stringify({ count: 3, windowStart: now })
    )
    
    render(<Contact />)
    
    const emailInput = screen.getByPlaceholderText(/nq2019.buibaolong281104@gmail.com/i)
    const messageInput = screen.getByPlaceholderText(/Tell me what you're building/i)
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(messageInput, { target: { value: 'Test message' } })
    
    screen.getByRole('button', { name: /Send message/i }).click()
    
    await waitFor(() => {
      expect(screen.getByText(/quá 3 tin nhắn/i)).toBeInTheDocument()
    })
    
    // EmailJS should not have been called
    expect(mockEmailJS._getAllCalls()).toHaveLength(0)
  })

  it('shows success message and clears form on successful send', async () => {
    render(<Contact />)
    
    const emailInput = screen.getByPlaceholderText(/nq2019.buibaolong281104@gmail.com/i)
    const messageInput = screen.getByPlaceholderText(/Tell me what you're building/i)
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(messageInput, { target: { value: 'Test message content' } })
    
    screen.getByRole('button', { name: /Send message/i }).click()
    
    await waitFor(() => {
      expect(screen.getByText(/Sent successfully/i)).toBeInTheDocument()
    })
    
    // Form should be cleared
    expect(messageInput).toHaveValue('')
  })

  it('calls EmailJS with correct parameters', async () => {
    render(<Contact />)
    
    const emailInput = screen.getByPlaceholderText(/nq2019.buibaolong281104@gmail.com/i)
    const messageInput = screen.getByPlaceholderText(/Tell me what you're building/i)
    
    fireEvent.change(emailInput, { target: { value: 'sender@example.com' } })
    fireEvent.change(messageInput, { target: { value: 'Hello there' } })
    
    screen.getByRole('button', { name: /Send message/i }).click()
    
    await waitFor(() => {
      const lastCall = mockEmailJS._getLastCall()
      expect(lastCall).not.toBeNull()
      expect(lastCall![0]).toBe('test_service_id')
      expect(lastCall![1]).toBe('test_template_id')
      expect(lastCall![2]).toEqual({ email: 'sender@example.com', message: 'Hello there' })
      expect(lastCall![3]).toEqual({ publicKey: 'test_public_key' })
    })
  })

  it('shows error message when EmailJS fails', async () => {
    mockEmailJS.send.mockRejectedValue(new Error('Network error'))
    
    render(<Contact />)
    
    const emailInput = screen.getByPlaceholderText(/nq2019.buibaolong281104@gmail.com/i)
    const messageInput = screen.getByPlaceholderText(/Tell me what you're building/i)
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(messageInput, { target: { value: 'Test message' } })
    
    screen.getByRole('button', { name: /Send message/i }).click()
    
    await waitFor(() => {
      expect(screen.getByText(/Failed to send, please try again/i)).toBeInTheDocument()
    })
  })
})
