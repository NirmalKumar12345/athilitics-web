'use client';
import { Inter, Gabarito } from 'next/font/google';
import './globals.css';
import './fonts.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';

const inter = Inter({ subsets: ['latin'] });
const gabarito = Gabarito({ subsets: ['latin'], weight: ['400', '600', '700'] });
const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${gabarito.className}`}>
        <QueryClientProvider client={queryClient}>
          {children}
          <ToastContainer position="bottom-right" autoClose={3000} />
        </QueryClientProvider>
      </body>
    </html>
  );
}
