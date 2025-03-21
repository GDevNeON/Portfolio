
import config from '~/config.json';

export const navLinks = [
  {
    label: 'Projects',
    pathname: '/#project-1',
  },
  {
    label: 'Details',
    pathname: '/#details',
  },
  {
    label: 'Contact',
    pathname: '/contact',
  },
  {
    label: 'View CV',
    pathname: 'https://drive.google.com/file/d/1AHzUYBngBFGWT_JAJ9c-GXHarfm-94xA/view?usp=sharing',
    external: true,
  },
];

export const socialLinks = [
  {
    label: 'Facebook',
    url: `https://www.facebook.com/${config.facebook}`,
    icon: 'facebook',
  },
  {
    label: 'Discord',
    url: `https://discord.com/channels/${config.discord}`,
    icon: 'discord',
  },
  {
    label: 'Github',
    url: `https://github.com/${config.github}`,
    icon: 'github',
  },
];
