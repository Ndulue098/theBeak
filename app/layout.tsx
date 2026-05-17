import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Cormorant_Garamond } from 'next/font/google';
import './globals.css';

const sans = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans',
});

const heading = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['800'],
  variable: '--font-heading',
});

const playfair = Cormorant_Garamond({
  subsets: ['latin'],
  style: ['italic'],
  weight: ['400'],
  variable: '--font-serif',
});

export const metadata: Metadata = {
  title: 'THE BEAKS | Art Became A Species',
  description: 'A premium immersive Web3 art/NFT experience.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${sans.variable} ${heading.variable} ${playfair.variable}`}>
      <body suppressHydrationWarning className="bg-brand-bg text-brand-text antialiased font-sans">
        <div className="noise-overlay" />
        <div className="vignette" />
        {children}
      </body>
    </html>
  );
}
