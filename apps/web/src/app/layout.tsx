import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { AppProviders } from '@/providers/AppProviders';
import '@/app/globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default:  'NEXUS — Personal Execution Intelligence',
    template: '%s | NEXUS',
  },
  description:
    'NEXUS turns chaotic ideas into flawless execution. ' +
    'Like Jarvis for founders who need to reliably ship.',
  keywords: ['execution intelligence', 'AI productivity', 'founder tools', 'decision journal'],
  authors:  [{ name: 'NEXUS' }],
  metadataBase: new URL(process.env['NEXT_PUBLIC_APP_URL'] ?? 'http://localhost:3000'),
  openGraph: {
    type:        'website',
    locale:      'en_US',
    title:       'NEXUS — Personal Execution Intelligence',
    description: 'NEXUS turns chaotic ideas into flawless execution.',
    siteName:    'NEXUS',
  },
  twitter: {
    card:        'summary_large_image',
    title:       'NEXUS — Personal Execution Intelligence',
    description: 'NEXUS turns chaotic ideas into flawless execution.',
  },
  robots: {
    index:  true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)',  color: '#1B1F3B' },
  ],
  width:        'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}