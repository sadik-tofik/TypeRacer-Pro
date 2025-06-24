import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/lib/theme-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TypeRacer Pro - Advanced Typing Speed Test | Improve Your WPM',
  description: 'Test and improve your typing speed with TypeRacer Pro. Real-time WPM tracking, accuracy measurement, multiplayer racing, and comprehensive statistics. Start your free typing test now!',
  keywords: 'typing test, WPM test, typing speed, accuracy, keyboard skills, touch typing, typing practice, multiplayer typing, typing race',
  authors: [{ name: 'TypeRacer Pro' }],
  creator: 'TypeRacer Pro',
  publisher: 'TypeRacer Pro',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://typeracer-pro.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'TypeRacer Pro - Advanced Typing Speed Test',
    description: 'Test and improve your typing speed with real-time WPM tracking, multiplayer racing, and accuracy measurement.',
    url: 'https://typeracer-pro.vercel.app',
    siteName: 'TypeRacer Pro',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'TypeRacer Pro - Typing Speed Test',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TypeRacer Pro - Advanced Typing Speed Test',
    description: 'Test and improve your typing speed with real-time WPM tracking and multiplayer racing.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: false,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'TypeRacer Pro',
  description: 'Advanced typing speed test application with real-time WPM tracking, multiplayer racing, and accuracy measurement.',
  url: 'https://typeracer-pro.vercel.app',
  applicationCategory: 'EducationalApplication',
  operatingSystem: 'Any',
  permissions: 'none',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#3b82f6" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}