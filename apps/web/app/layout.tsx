import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { InstallPrompt } from '@/components/pwa/install-prompt';
import { RegisterSW } from './register-sw';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Gamify Productivity',
  description: 'A gamified productivity app with retro game styling',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Gamify',
  },
  icons: {
    icon: [
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#22c55e',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} font-retro`}>
        <Providers>
          {children}
          <InstallPrompt />
          <RegisterSW />
        </Providers>
      </body>
    </html>
  );
}

