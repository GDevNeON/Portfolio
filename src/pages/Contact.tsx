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

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID as string | undefined
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string | undefined
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string | undefined

  async function handleSend() {
    if (!email || !message) {
      setSnackbar({ message: siteConfig.ui.contact.validation.required, type: 'error' })
      return
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailPattern.test(email)) {
      setSnackbar({ message: siteConfig.ui.contact.validation.invalidEmail, type: 'error' })
      return
    }

    if (!serviceId || !templateId || !publicKey) {
      setSnackbar({ message: siteConfig.ui.contact.validation.missingConfig, type: 'error' })
      return
    }

    setIsSubmitting(true)

    try {
      await emailjs.send(
        serviceId,
        templateId,
        {
          email,
          message,
        },
        {
          publicKey,
        },
      )

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
              <div className="label">{siteConfig.ui.contact.yourEmail}</div>
              <div className="panelInputBorder">
                <input
                  className="panelInput"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={siteConfig.ui.contact.emailPlaceholder}
                  inputMode="email"
                />
              </div>
            </div>

            <div className="field">
              <div className="label">{siteConfig.ui.contact.message}</div>
              <div className="panelInputBorder">
                <textarea
                  className="panelInput panelInput--area"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={siteConfig.ui.contact.messagePlaceholder}
                  rows={6}
                />
              </div>
            </div>

            <div className="contactActions">
              <button
                type="button"
                className="btnPrimary"
                onClick={handleSend}
                disabled={isSubmitting}
              >
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
