import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Student List Manager',
  description: 'Built by Md Nafiz',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

