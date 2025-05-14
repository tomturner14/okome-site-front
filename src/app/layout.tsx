import type { Metadata } from 'next';
import './globals.scss'; // または './globals.css'
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import { ShopifyCartProvider } from '@/context/ShopifyCartContext';

export const metadata: Metadata = {
  title: 'おこめ販売',
  description: '生産者から直接届くおいしいお米をお届けします',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <ShopifyCartProvider>
          <Header />
          <main>
            {children}
          </main>
          <Footer />
        </ShopifyCartProvider>
      </body>
    </html>
  );
}