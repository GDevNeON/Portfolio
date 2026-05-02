import projMobile1 from './assets/proj_mobile_1.jpg'
import projMobile2 from './assets/proj_mobile_2.jpg'
import projMobile3 from './assets/proj_mobile_3.jpg'
import projWeb1 from './assets/proj_web_1.jpg'
import projWeb2 from './assets/proj_web_2.png'
import projWeb3 from './assets/proj_web_3.png'
import projGame1 from './assets/proj_game_1.png'
import projGame2 from './assets/proj_game_2.png'
import projGame3 from './assets/proj_game_3.png'
import personalPhoto from './assets/personal_photo.jpg'

export type ProjectKind = 'mobile' | 'web' | 'game'

export type Project = {
  id: string
  title: string
  kind: ProjectKind
  description: string
  tags: string[]
  images: string[]
  link?: string
}

export const siteConfig = {
  name: 'Bùi Bảo Long',
  title: 'Software Developer',
  tagline: 'Abstract + flat — turning complex problems into simple, bold interfaces.',
  cvUrl: 'https://drive.google.com/drive/folders/14LeU9PZ1vPgTWB9-QgKFkoYqAz0SUkZE?usp=sharing',
  techStack: [
    { name: 'Java', hint: 'Backend integration' },
    { name: 'Dart', hint: 'UI composition' },
    { name: 'Python', hint: 'AI integration' },
    { name: 'Spring', hint: 'Web application framework' },
    { name: 'Flutter', hint: 'Cross-platform framework' },
    { name: 'Git', hint: 'Version control' },
    { name: 'REST', hint: 'Backend integration' },
    { name: 'SQL', hint: 'Data querying' },
    { name: 'Testing', hint: 'Quality first' },
    { name: 'Docker', hint: 'Containerization' },
    { name: 'CI/CD', hint: 'Automation' }
  ],
  projects: [
    {
      id: 'vixie-mobile',
      title: 'Vixie',
      kind: 'mobile',
      description:
        'Vixie is a Live Wallpaper application that integrates an AI character, serving as an emotional companion assistant and supporting positive behaviors for users.',
      tags: ['Flutter', 'Dart', 'AI'],
      images: [projMobile3, projMobile2, projMobile1],
      link: 'https://github.com/GDevNeON/Vixie',
    },
    {
      id: 'booking-web',
      title: 'Car Booking Website',
      kind: 'web',
      description:
        'A website used for booking car trips with real-time availability and pricing.',
      tags: ['Java', 'Spring', 'React', 'TypeScript'],
      images: [projWeb3, projWeb2, projWeb1],
      link: 'https://github.com/bhbghghbgb/bookvexe-be-j2e',
    },
    {
      id: 'indie-game',
      title: 'A 2D Normal Shooting Game',
      kind: 'game',
      description:
        'First full game project created with Python and Pygame. A complete 2D shooting game with multiple levels, enemies, and power-ups. Intuitive controls and engaging gameplay. Feature-rich with polished visuals and sound design.',
      tags: ['Python', '2D', 'Pixel Art'],
      images: [projGame3, projGame2, projGame1],
      link: 'https://github.com/GDevNeON/2D_Normal_Shooting_Game',
    },
  ] as Project[],
  about: {
    headline: 'More than code',
    body:
      "I build interfaces that feel playful, modern, and readable.\nI like geometry, motion, and strong color systems.\nAnime Game enthusiast and Sporty person who loves cycling and playing badminton.\nAlways looking for new challenges and opportunities to grow.",
    highlights: [
      { label: 'Years of experience', value: '3+' },
      { label: 'Projects involving', value: '20+' },
      { label: 'Focus', value: 'UI/UX + FE' },
      { label: 'Open to', value: 'Collaboration' },
    ],
    images: [personalPhoto, personalPhoto, personalPhoto] as string[],
  },
  contact: {
    title: 'Say hello to me~',
    toEmail: 'nq2019.buibaolong281104@gmail.com',
  },
  social: {
    facebook: 'https://www.facebook.com/long.bui.793956/',
    github: 'https://github.com/GDevNeON',
    linkedin: 'https://www.linkedin.com/in/b%E1%BA%A3o-long-b%C3%B9i-806535407/',
  },
  ui: {
    home: {
      heroAccent: 'Prompt Engineering.',
      viewProjects: 'View Projects',
      aboutMe: 'About Me',
      currently: 'CURRENTLY',
      openToWork: 'Open to work',
      available: 'Available',
      techStack: 'Tech',
      stackAccent: 'Stack',
      selectedWorks: 'Selected',
      worksAccent: 'Works',
      viewProject: 'View project',
      focus: 'Focus',
      focusDescription: 'Abstract UI, motion, and clean engineering.',
      viewCv: 'View CV',
    },
    contact: {
      subtitle: 'Drop a message. The border highlight follows your focus.',
      yourEmail: 'Your email',
      message: 'Message',
      emailPlaceholder: 'nq2019.buibaolong281104@gmail.com',
      messagePlaceholder: 'Tell me what you\'re building...',
      sendMessage: 'Send message',
      sending: 'Sending…',
      backToHome: 'Back to Home',
      validation: {
        required: 'Please check your email and contents.',
        invalidEmail: 'Invalid Email, please check your input and try again.',
        missingConfig: 'Missing EmailJS configuration. Please check your environment variables.',
        sendSuccess: 'Sent successfully! I\'ll get back to you as soon as possible.',
        sendFailed: 'Failed to send, please try again later.',
      },
    },
    navigation: {
      home: 'Home',
      stack: 'Stack',
      work: 'Work',
      about: 'About',
      contact: 'Contact',
    },
    footer: {
      title: 'Let\'s create something unique.',
      copyright: `© ${new Date().getFullYear()} Bùi Bảo Long. Idea by me - Design & Code by AI.`,
    },
    common: {
      ui: 'UI',
      frontend: 'Frontend',
      motion: 'Motion',
      closeNotification: 'Close notification',
    },
  },
}
