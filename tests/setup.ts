import { vi, beforeEach } from 'vitest'
import '@testing-library/jest-dom/vitest'
import { mockEmailJS } from './mocks/emailjs'

// Mock EmailJS for all tests
vi.mock('@emailjs/browser', () => ({
  default: mockEmailJS,
}))

beforeEach(() => {
  mockEmailJS._reset()
})
