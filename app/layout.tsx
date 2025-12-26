import type { Metadata } from 'next';
import { ReactLenis } from 'lenis/react';
import '../styles/globals.scss';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';

import localFont from 'next/font/local';
const terminaFont = localFont({
  variable: '--font-primary',
  preload: true,
  display: 'swap',
  fallback: ['system-ui', '-apple-system', 'sans-serif'],
  src: [
    {
      path: '../public/fonts/Termina-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/Termina-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/Termina-Demi.woff2',
      weight: '600',
      style: 'normal',
    },
  ],
});
// import { Montserrat } from 'next/font/google';
// const montserrat = Montserrat({
//   subsets: ['latin'],
// });

export const metadata: Metadata = {
  metadataBase: new URL('https://pit-bull.net'),
  alternates: {
    canonical: './',
  },
  title: {
    default: 'Pit-Bull® Armored SWAT APC',
    template: '%s',
  },
  description:
    'Pit-Bull® - Premium outdoor equipment and gear for your adventures.',
  authors: [{ name: 'Pit-Bull®' }],
  creator: 'Pit-Bull®',
  publisher: 'Pit-Bull®',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: './',
    siteName: 'Pit-Bull®',
    title: 'Pit-Bull®',
    description:
      'Pit-Bull® - Premium outdoor equipment and gear for your adventures.',
    images: [
      {
        url: '/images/pitbull_head.png',
        width: 1200,
        height: 630,
        alt: 'Pit-Bull®',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@alpinepitbull',
    creator: '@alpinepitbull',
    images: ['/images/pitbull_head.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={terminaFont.variable}>
      <head>
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-WFDHFP5J');`,
          }}
        />
        {/* End Google Tag Manager */}

        {/* Preconnect to external domains for better performance */}
        <link rel="preconnect" href="https://assets.alpineco.com" />
        <link
          rel="preconnect"
          href="https://alpine-backend-992382787275.s3.us-east-1.amazonaws.com"
        />

        {/* Preload critical resources */}
        <link
          rel="preload"
          href="/fonts/Termina-Medium.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />

        {/* Critical CSS hint */}
        <link rel="preload" href="/images/alpine-pitbull-logo.svg" as="image" />
      </head>

      <body className={`${terminaFont.className}`}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-WFDHFP5J"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}

        <ReactLenis
          root
          options={{ lerp: 0.1, duration: 1.2, smoothWheel: true }}
        >
          <Header />

          {children}

          <Footer />
        </ReactLenis>
      </body>
    </html>
  );
}
