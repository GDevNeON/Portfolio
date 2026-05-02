import { useEffect } from 'react'

export default function MetaTags() {
  useEffect(() => {
    // Update document title
    document.title = 'Bùi Bảo Long - Software Developer'

    // Update or create meta tags
    const metaTags = [
      { name: 'description', content: 'Software Developer specializing in UI/UX, frontend and backend development. Building playful, modern interfaces with modern web technologies.' },
      { name: 'keywords', content: 'software developer, frontend, backend, UI/UX, portfolio' },
      { name: 'robots', content: 'index, follow' },
      { name: 'language', content: 'en' },
      { name: 'revisit-after', content: '30 days' },
      { name: 'author', content: 'Bùi Bảo Long' },
      // Open Graph tags
      { property: 'og:title', content: 'Bùi Bảo Long - Software Developer' },
      { property: 'og:description', content: 'Software Developer specializing in UI/UX, frontend and backend development. Building playful, modern interfaces with modern web technologies.' },
      { property: 'og:image', content: '/neon-icon.png' },
      { property: 'og:url', content: 'https://your-domain.com' },
      { property: 'og:type', content: 'profile' },
      { property: 'og:site_name', content: 'Bùi Bảo Long - Portfolio' },
      { property: 'og:locale', content: 'en_US' },
    ]

    metaTags.forEach(tag => {
      if (tag.property) {
        // Open Graph tag
        let meta = document.querySelector(`meta[property="${tag.property}"]`) as HTMLMetaElement
        if (!meta) {
          meta = document.createElement('meta')
          meta.setAttribute('property', tag.property!)
          document.head.appendChild(meta)
        }
        meta.setAttribute('content', tag.content!)
      } else {
        // Regular meta tag
        let meta = document.querySelector(`meta[name="${tag.name}"]`) as HTMLMetaElement
        if (!meta) {
          meta = document.createElement('meta')
          meta.setAttribute('name', tag.name!)
          document.head.appendChild(meta)
        }
        meta.setAttribute('content', tag.content!)
      }
    })

    // Cleanup function (optional, for when component unmounts)
    return () => {
      // Meta tags will persist, which is what we want
    }
  }, [])

  return null // This component doesn't render anything
}
