import './globals.css';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'Discord Time Zones',
  description: 'Display Discord users by time zone',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
} 