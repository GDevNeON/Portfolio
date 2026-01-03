import { useEffect, useState } from 'react'

type SnackbarProps = {
  message: string
  type: 'success' | 'error'
  onClose: () => void
}

export default function Snackbar({ message, type, onClose }: SnackbarProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Trigger animation
    setIsVisible(true)

    // Auto close after 4 seconds
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300) // Wait for exit animation
    }, 4000)

    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div
      className={`snackbar snackbar--${type} ${isVisible ? 'snackbar--visible' : ''}`}
    >
      <div className="snackbarContent">
        <span className="snackbarMessage">{message}</span>
        <button
          className="snackbarClose"
          onClick={() => {
            setIsVisible(false)
            setTimeout(onClose, 300)
          }}
          aria-label="Close notification"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>
  )
}
