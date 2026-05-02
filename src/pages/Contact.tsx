import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import emailjs from '@emailjs/browser'
import { siteConfig } from '../siteConfig'
import Snackbar from '../components/Snackbar'

export default function Contact() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [snackbar, setSnackbar] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [emailError, setEmailError] = useState('')
  const [messageError, setMessageError] = useState('')

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID as string | undefined
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string | undefined
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string | undefined
  const RATE_LIMIT_KEY = 'contact_email_rate_limit'
  const RATE_LIMIT_MAX = 3
  const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000 // 10 phút

  async function handleSend() {
    // Reset errors
    setEmailError('')
    setMessageError('')

    if (!email || !message) {
      const errorMsg = siteConfig.ui.contact.validation.required
      if (!email) setEmailError(errorMsg)
      if (!message) setMessageError(errorMsg)
      setSnackbar({ message: errorMsg, type: 'error' })
      return
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailPattern.test(email)) {
      const errorMsg = siteConfig.ui.contact.validation.invalidEmail
      setEmailError(errorMsg)
      setSnackbar({ message: errorMsg, type: 'error' })
      return
    }

    if (!serviceId || !templateId || !publicKey) {
      setSnackbar({ message: siteConfig.ui.contact.validation.missingConfig, type: 'error' })
      return
    }

    // --- RATE LIMIT CHECK ---
    const now = Date.now()
    let data: { count: number; windowStart: number } | null = null

    try {
      const raw = localStorage.getItem(RATE_LIMIT_KEY)
      if (raw) {
        data = JSON.parse(raw)
      }
    } catch {
      data = null
    }

    if (!data || now - data.windowStart > RATE_LIMIT_WINDOW_MS) {
      data = { count: 0, windowStart: now }
    }

    if (data.count >= RATE_LIMIT_MAX) {
      setSnackbar({
        message: 'Bạn đã gửi quá 3 tin nhắn, vui lòng thử lại sau 10 phút.',
        type: 'error',
      })
      return
    }

    setIsSubmitting(true)

    try {
      await emailjs.send(
        serviceId,
        templateId,
        { email, message },
        { publicKey },
      )

      // Tăng count sau khi gửi thành công
      const updated = {
        count: data.count + 1,
        windowStart: data.windowStart,
      }
      localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(updated))

      setSnackbar({ message: siteConfig.ui.contact.validation.sendSuccess, type: 'success' })
      setMessage('')
    } catch (err) {
      setSnackbar({ message: siteConfig.ui.contact.validation.sendFailed, type: 'error' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="page">
      <section className="section contact revealSection" id="contact" data-scroll-section>
        <div className="contactHeader">
          <h1 className="contactTitle">{siteConfig.contact.title}</h1>
          <p className="contactSubtitle">
            {siteConfig.ui.contact.subtitle}
          </p>
        </div>

        <div className="contactGrid">
          <div className="contactCard glass">
            <div className="field">
              <label htmlFor="email" className="label">{siteConfig.ui.contact.yourEmail}</label>
              <div className="panelInputBorder">
                <input
                  id="email"
                  className="panelInput"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={siteConfig.ui.contact.emailPlaceholder}
                  inputMode="email"
                  aria-invalid={!!emailError}
                  aria-describedby={emailError ? 'email-error' : undefined}
                />
              </div>
              {emailError && (
                <span id="email-error" className="fieldError" role="alert">
                  {emailError}
                </span>
              )}
            </div>

            <div className="field">
              <label htmlFor="message" className="label">{siteConfig.ui.contact.message}</label>
              <div className="panelInputBorder">
                <textarea
                  id="message"
                  className="panelInput panelInput--area"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={siteConfig.ui.contact.messagePlaceholder}
                  rows={6}
                  aria-invalid={!!messageError}
                  aria-describedby={messageError ? 'message-error' : undefined}
                />
              </div>
              {messageError && (
                <span id="message-error" className="fieldError" role="alert">
                  {messageError}
                </span>
              )}
            </div>

            <div className="contactActions">
              <button
                type="button"
                className="btnPrimary"
                onClick={handleSend}
                disabled={isSubmitting}
                aria-busy={isSubmitting}
              >
                {isSubmitting && <span className="spinner" aria-hidden="true" />}
                {isSubmitting ? siteConfig.ui.contact.sending : siteConfig.ui.contact.sendMessage}
              </button>
              <Link className="btnGhost" to="/">
                {siteConfig.ui.contact.backToHome}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Snackbar */}
      {snackbar && (
        <Snackbar
          message={snackbar.message}
          type={snackbar.type}
          onClose={() => setSnackbar(null)}
        />
      )}
    </div>
  )
}
