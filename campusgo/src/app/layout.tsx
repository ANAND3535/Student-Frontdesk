import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'CampusGo — Smart Campus Front Desk & Visitor Management',
    template: '%s | CampusGo',
  },
  description:
    'CampusGo brings visitor management, student enquiries, appointments, and campus assistance together in one intelligent digital experience.',
  keywords: [
    'campus management',
    'visitor management',
    'student enquiry',
    'appointment booking',
    'front desk',
    'CampusGo',
  ],
  openGraph: {
    type: 'website',
    title: 'CampusGo — Smart Campus Front Desk',
    description:
      'Smarter campus services. Seamless every visit.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
