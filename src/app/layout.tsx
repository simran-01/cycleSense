import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import BottomNav from '@/components/nav/BottomNav';
import ChatContainer from '@/components/chatbot/ChatContainer';
import { CycleProvider } from '@/context/CycleContext';

export const metadata: Metadata = {
  title: 'CycleSense',
  description: 'A premium, aesthetic health app for cycle tracking.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Alegreya:ital,wght@0,400..900;1,400..900&family=Belleza&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <CycleProvider>
          <div className="relative flex min-h-screen flex-col">
            <main className="flex-1 pb-28">{children}</main>
            <ChatContainer />
            <BottomNav />
          </div>
          <Toaster />
        </CycleProvider>
      </body>
    </html>
  );
}
