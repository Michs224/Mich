// Identity and links used across the site. Values carried over from the old Mich.html.
export const site = {
  name: 'Michael Geraldin Wijaya',
  // The names people call him by; the domain, michgerald, joins the two.
  alternateName: ['Gerald', 'Mich'],
  role: 'AI Engineer',
  location: 'Jakarta, Indonesia',
  email: 'michaelwjy2@gmail.com',
  url: 'https://michgerald.online',
  resumePath: '/downloads/Michael Geraldin Wijaya Resume.pdf',
  socials: {
    github: 'https://github.com/Michs224',
    linkedin: 'https://www.linkedin.com/in/michaelgeraldinwijaya/',
    x: 'https://x.com/michgerald24',
    instagram: 'https://www.instagram.com/mic_geral/',
  },
  // Google Apps Script that appends contact messages to a Google Sheet.
  formEndpoint:
    'https://script.google.com/macros/s/AKfycbwQ0xDy8msy5Jz6CX2Q5m3PBMRv7vtlE0vULMX77zeIX3GEGvl2DsUb1eAfRBGRTdXS1Q/exec',
} as const;
