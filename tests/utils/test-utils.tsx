import React from 'react'
import { render as rtlRender, RenderOptions } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '../../src/contexts/ThemeContext'

function AllProviders({ children }: { children: React.ReactNode }) {
  return (
    <BrowserRouter>
      <ThemeProvider>{children}</ThemeProvider>
    </BrowserRouter>
  )
}

export function render(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return rtlRender(ui, { wrapper: AllProviders, ...options })
}

export function renderWithThemeOnly(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return rtlRender(ui, {
    wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
    ...options,
  })
}

// Re-export everything from RTL
export * from '@testing-library/react'
export { waitFor } from '@testing-library/react'
