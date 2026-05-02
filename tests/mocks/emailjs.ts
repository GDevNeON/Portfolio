import { vi } from 'vitest'

export interface EmailJSTemplateParams {
  email: string
  message: string
}

export interface EmailJSConfig {
  publicKey: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mockEmailJS: any = {
  send: vi.fn(),
  
  _reset: () => {
    mockEmailJS.send.mockClear()
    mockEmailJS.send.mockResolvedValue({ status: 200, text: 'OK' })
  },
  
  _getLastCall: () => {
    const calls = mockEmailJS.send.mock.calls
    return calls.length > 0 ? calls[calls.length - 1] : null
  },
  
  _getAllCalls: () => mockEmailJS.send.mock.calls,
}

// Default successful response
mockEmailJS.send.mockResolvedValue({ status: 200, text: 'OK' })
