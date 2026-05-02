import { vi, beforeEach } from 'vitest'
import '@testing-library/jest-dom/vitest'

// Mock EmailJS for all tests
vi.mock('@emailjs/browser', () => ({
  default: {
    send: vi.fn(),
  },
}))
