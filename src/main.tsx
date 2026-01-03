import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/variables.css'
import './styles/base.css'
import './styles/navbar.css'
import './styles/hero.css'
import './styles/projects.css'
import './styles/about.css'
import './styles/contact.css'
import './styles/footer.css'
import './styles/snackbar.css'
import './styles/animations.css'
import './styles/devices.css'
import App from './App.tsx'
import { ThemeProvider } from './contexts/ThemeContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
)
