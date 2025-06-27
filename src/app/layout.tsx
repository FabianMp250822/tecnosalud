import type { Metadata, Viewport } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { LanguageProvider } from '@/contexts/language-context';

export const metadata: Metadata = {
  title: 'Tecnosalud - Soluciones Digitales a tu Alcance',
  description: 'Transformamos tus sueños en soluciones digitales. Impulsamos tu negocio con soluciones IT personalizadas y servicios integrales de software.',
  metadataBase: new URL('https://tecnosalud.com'), // Replace with your actual domain
  openGraph: {
    title: 'Tecnosalud - Soluciones Digitales',
    description: 'Líderes en innovación tecnológica, comprometidos con el éxito de tu negocio.',
    url: 'https://tecnosalud.com',
    siteName: 'Tecnosalud',
    images: [
      {
        url: '/og-image.png', // It's recommended to create an Open Graph image
        width: 1200,
        height: 630,
      },
    ],
    locale: 'es_CO',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tecnosalud - Soluciones Digitales',
    description: 'Transformamos tus sueños en soluciones digitales.',
    // images: ['/twitter-image.png'], // Add a twitter-specific image if needed
  },
};

export const viewport: Viewport = {
  themeColor: '#0d1a2e',
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn('font-body antialiased min-h-screen flex flex-col')}>
        <LanguageProvider>
          {children}
          <Toaster />
        </LanguageProvider>
      </body>
    </html>
  );
}
