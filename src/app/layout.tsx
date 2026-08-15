import type { Metadata, Viewport } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import FirebaseClientProvider from '@/firebase/client-provider';
import Footer from '@/components/footer';

export const viewport: Viewport = {
  themeColor: '#090d16',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://fin.versetile.in'),
  title: {
    default: 'FinVerse | Smart Personal Expense & Monthly Budget Management',
    template: '%s | FinVerse',
  },
  description: 'Track monthly expenses, set category budget caps, and monitor real-time income analytics with FinVerse — Versetile’s quantum intelligence expense management platform.',
  keywords: [
    'FinVerse',
    'Versetile FinVerse',
    'Personal Expense Tracker',
    'Monthly Budget Management',
    'Category Spending Analytics',
    'Income Tracker India',
    'Smart Budget Planner',
    'Firebase Expense Sync',
    'Financial Control Center',
  ],
  authors: [{ name: 'Versetile Technologies Pvt Ltd', url: 'https://versetile.in' }],
  creator: 'Versetile Technologies',
  publisher: 'Versetile Technologies Pvt Ltd',
  manifest: '/manifest.json',
  alternates: {
    canonical: 'https://fin.versetile.in',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://fin.versetile.in',
    title: 'FinVerse | Smart Personal Expense & Monthly Budget Management',
    description: 'Track monthly expenses, set category budget caps, and monitor real-time income analytics with FinVerse.',
    siteName: 'FinVerse by Versetile',
    images: [
      {
        url: '/images/hero.png',
        width: 1200,
        height: 630,
        alt: 'FinVerse Expense & Budget Management Dashboard',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FinVerse | Smart Personal Expense Management',
    description: 'Track monthly expenses, set category budget caps, and monitor real-time income analytics.',
    images: ['/images/hero.png'],
    creator: '@versetile',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'FinVerse',
    url: 'https://fin.versetile.in',
    description: 'Personal expense and monthly budget management platform with real-time category analytics.',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'All',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
    },
    author: {
      '@type': 'Organization',
      name: 'Versetile Technologies Pvt Ltd',
      url: 'https://versetile.in',
    },
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={cn('font-body antialiased flex flex-col min-h-screen bg-background')}>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
          <FirebaseClientProvider>
            <div className="flex-1">
              {children}
            </div>
            <Footer />
            <Toaster />
          </FirebaseClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
