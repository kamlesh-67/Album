import type {Metadata} from 'next';
import { Inter, Playfair_Display, Dancing_Script } from 'next/font/google';
import './globals.css'; // Global styles

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
});

const dancingScript = Dancing_Script({
  subsets: ['latin'],
  variable: '--font-cursive',
});

export const metadata: Metadata = {
  title: 'Our Love Memory Album',
  description: 'An intimate, sentimental memory album dedicated to love with interactive features.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${dancingScript.variable}`}>
      <body suppressHydrationWarning className="bg-[#FFF5F7] text-[#6B4E54] antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
