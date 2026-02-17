/**
 * Root Layout
 * 
 * Main layout for the Generative UI Platform web application.
 * Provides theme provider, query client, and global UI shell.
 */

import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { QueryProvider } from '@/components/query-provider';
import { Toaster } from '@generative-ui/ui/components/sonner';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: {
    default: 'Generative UI Platform',
    template: '%s | Generative UI Platform',
  },
  description: 'AI-powered UI generation platform combining Syntux layout composition, Tambo agent orchestration, and MCP ecosystem',
  keywords: ['UI generation', 'AI', 'React', 'components', 'design system'],
  authors: [{ name: 'Generative UI Team' }],
  creator: 'Generative UI Platform',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'Generative UI Platform',
    description: 'AI-powered UI generation platform',
    siteName: 'Generative UI Platform',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Generative UI Platform',
    description: 'AI-powered UI generation platform',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster position="bottom-right" richColors />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
