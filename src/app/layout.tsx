import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import PixelTracker from '@/components/PixelTracker';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'THTCARE.ID',
  description: 'Jangan biarkan dak jebol merusak rumah Anda. Solusi industrial grade untuk menutup retakan dan pori-pori beton.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning>
        <PixelTracker />
        {children}
      </body>
    </html>
  );
}
