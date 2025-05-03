import React from 'react';
import { Inter } from 'next/font/google';
import './globals.css';

// Initialize Inter font
const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Influencer Platform',
  description: 'Connect brands with influencers for Instagram campaigns',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}