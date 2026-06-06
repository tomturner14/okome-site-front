import type { Metadata } from 'next';
import "@/styles/globals.scss";
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';

export const metadata: Metadata = {
  title: '酒々井の恵',
  description: '千葉・酒々井の農産物を、毎日の食卓へお届けします',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <Header />
        <main>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}