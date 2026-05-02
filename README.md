# Neon Portfolio

Personal developer portfolio website showcasing projects, tech stack, and contact information. Built with React, TypeScript, and Vite featuring a glassmorphism UI design.

## Tech Stack

- React 19 + TypeScript 5
- Vite 7 (build tool)
- React Router DOM 6 (routing)
- Custom CSS (no framework)
- EmailJS Browser (contact form)

## Getting Started

```bash
npm install
npm run dev
```

Build for production:
```bash
npm run build
```

## EmailJS Setup

This project uses [EmailJS](https://www.emailjs.com/) to send contact form emails without a backend.

### Required Environment Variables

Create a `.env` file in the project root with these variables:

```env
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

See `.env.example` for the template format.

### Getting Your Credentials

1. Sign up at [EmailJS Dashboard](https://dashboard.emailjs.com/)
2. Create an Email Service (Gmail, Outlook, etc.)
3. Create an Email Template with these template variables:
   - `{{from_email}}` — sender's email address
   - `{{message}}` — the message content
4. Copy the Service ID, Template ID, and Public Key to your `.env` file

### Rate Limiting

The contact form has built-in rate limiting (3 submissions per 10 minutes per browser) to prevent abuse.

## Project Structure

- `src/components/` — React components
- `src/pages/` — Page components (Home, Contact)
- `src/contexts/` — React contexts (Theme)
- `src/styles/` — CSS stylesheets
- `src/siteConfig.ts` — Site configuration (content, links, contact info)

## Features

- Hero section with CTA
- Tech stack showcase
- Project portfolio with filtering
- About section with stats
- Contact form with email integration
- Theme toggle (light/dark)
- Responsive design
- Glassmorphism UI effects
- Error Boundary for graceful error handling

## License

MIT
