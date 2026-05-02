import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor, renderHook } from '../utils/test-utils'
import { renderWithThemeOnly } from '../utils/test-utils'
import { createMockLocalStorage } from '../utils/browser-mocks'
import { ThemeProvider, useTheme } from '../../src/contexts/ThemeContext'

describe('ThemeContext', () => {
  let mockStorage: ReturnType<typeof createMockLocalStorage>

  beforeEach(() => {
    mockStorage = createMockLocalStorage()
    vi.stubGlobal('localStorage', mockStorage)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('renders children without crashing', () => {
    render(
      <ThemeProvider>
        <div data-testid="child">Test Child</div>
      </ThemeProvider>
    )
    expect(screen.getByTestId('child')).toBeInTheDocument()
  })

  it('throws error when useTheme is called outside ThemeProvider', () => {
    // Suppress console.error for this test (expected error)
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    function BadComponent() {
      useTheme()
      return null
    }

    // RTL catches render errors, so we check the error was thrown by verifying the hook throws
    expect(() => {
      // Call useTheme directly to test the error
      const { result } = renderHook(() => useTheme())
    }).toThrow('useTheme must be used within a ThemeProvider')
    
    consoleSpy.mockRestore()
  })

  it('reads theme from localStorage on initial render', () => {
    mockStorage.getItem.mockReturnValue('dark')
    
    function ThemeReader() {
      const { theme } = useTheme()
      return <div data-testid="theme">{theme}</div>
    }
    
    renderWithThemeOnly(<ThemeReader />)
    
    expect(mockStorage.getItem).toHaveBeenCalledWith('theme')
    expect(screen.getByTestId('theme')).toHaveTextContent('dark')
  })

  it('defaults to light theme when localStorage is empty', () => {
    mockStorage.getItem.mockReturnValue(null)
    
    function ThemeReader() {
      const { theme } = useTheme()
      return <div data-testid="theme">{theme}</div>
    }
    
    renderWithThemeOnly(<ThemeReader />)
    
    expect(screen.getByTestId('theme')).toHaveTextContent('light')
  })

  it('toggles theme from light to dark', async () => {
    mockStorage.getItem.mockReturnValue('light')
    
    function ThemeToggler() {
      const { theme, toggleTheme } = useTheme()
      return (
        <div>
          <span data-testid="theme">{theme}</span>
          <button onClick={toggleTheme}>Toggle</button>
        </div>
      )
    }
    
    renderWithThemeOnly(<ThemeToggler />)
    
    expect(screen.getByTestId('theme')).toHaveTextContent('light')
    
    screen.getByRole('button', { name: /toggle/i }).click()
    
    await waitFor(() => {
      expect(screen.getByTestId('theme')).toHaveTextContent('dark')
    })
  })

  it('saves theme to localStorage when toggled', async () => {
    mockStorage.getItem.mockReturnValue('light')
    
    function ThemeToggler() {
      const { toggleTheme } = useTheme()
      return <button onClick={toggleTheme}>Toggle</button>
    }
    
    renderWithThemeOnly(<ThemeToggler />)
    
    // Clear the initial mount call
    mockStorage.setItem.mockClear()
    
    screen.getByRole('button', { name: /toggle/i }).click()
    
    await waitFor(() => {
      expect(mockStorage.setItem).toHaveBeenCalledWith('theme', 'dark')
    })
  })

  it('applies CSS class to document.documentElement', () => {
    const documentSpy = vi.spyOn(document.documentElement.classList, 'add')
    mockStorage.getItem.mockReturnValue('dark')
    
    function ThemeReader() {
      const { theme } = useTheme()
      return <div>{theme}</div>
    }
    
    renderWithThemeOnly(<ThemeReader />)
    
    expect(documentSpy).toHaveBeenCalledWith('dark')
    documentSpy.mockRestore()
  })
})
