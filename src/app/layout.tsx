import type { Metadata } from 'next';
import { Roboto, Noto_Sans_JP } from 'next/font/google';
import './globals.css';

const roboto = Roboto({
  variable: '--font-sans',
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const notoSansJP = Noto_Sans_JP({
  variable: '--font-sans-jp',
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Coffee Recipe Collection - プロのコーヒーレシピ集',
  description:
    'プロのバリスタが厳選した最高のコーヒーレシピで、おうちカフェを極上の体験に。詳細な抽出手順と器具の使い方を丁寧に解説します。',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${roboto.variable} ${notoSansJP.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
