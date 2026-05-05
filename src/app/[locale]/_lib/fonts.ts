import { IBM_Plex_Mono, IBM_Plex_Sans } from 'next/font/google'

const ibmPlexSans = IBM_Plex_Sans({
  variable: '--app-font-sans',
  subsets: ['latin', 'cyrillic'],
})

const ibmPlexMono = IBM_Plex_Mono({
  variable: '--app-font-mono',
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700'],
})

export const fontVariables = `${ibmPlexSans.variable} ${ibmPlexMono.variable}`
