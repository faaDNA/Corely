import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/theme-provider';
import './globals.css';

export const metadata: Metadata = {
  title: 'Corely',
  description: 'Satu ruang kerja untuk seluruh produktivitas Anda.',
  // Semua ikon statis di public/. PNG dibuat scripts/gen-icons.mjs.
  icons: { icon: '/icon.svg', apple: '/apple-touch-icon.png' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
