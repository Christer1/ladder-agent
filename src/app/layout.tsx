// Root layout: fonts, global styles, <Providers>.
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { PARTNER } from '@/config/partner';
import { Providers } from './providers';
import '@/styles/globals.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: `Open an account · ${PARTNER.name}`,
  description: `Open your ${PARTNER.name} account with your BVN, NIN or Ladder ID.`,
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
