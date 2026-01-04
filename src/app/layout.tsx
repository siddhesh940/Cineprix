import { AuthProvider } from '@/context/demo-auth-context';
import { FavoritesProvider } from '@/context/favorites-context';
import { GoogleAnalytics } from '@next/third-parties/google';
import { Analytics } from '@vercel/analytics/react';
import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
    title: {
        default: 'CinePrix - Explore Movies',
        template: '%s | CinePrix',
    },
    description: 'Discover movies, explore details, and find your next favorite film with CinePrix.',
    keywords: ['movies', 'films', 'explore movies', 'movie database', 'movie ratings', 'movie trailers'],
    authors: [{ name: 'Siddhesh', url: 'https://github.com/siddhesh940' }],
    metadataBase: new URL('https://cineprix.vercel.app'),
    openGraph: {
        description: 'Discover movies, explore details, and find your next favorite film with CinePrix.',
        url: 'https://cineprix.vercel.app',
        siteName: 'CinePrix',
        images: [
            {
                url: 'https://cineprix.vercel.app/banner.png',
                width: 1200,
                height: 630,
                alt: 'CinePrix Banner',
            },
        ],
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        description: 'Discover movies, explore details, and find your next favorite film with CinePrix.',
        images: ['https://cineprix.vercel.app/banner.png'],
    },
    manifest: '/site.webmanifest',
    robots: 'index, follow',
};

export const viewport: Viewport = {
    themeColor: 'black',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={` antialiased dark`}>
                <GoogleAnalytics gaId="G-Y94T96FRD7" />
                <Analytics />
                <AuthProvider>
                    <FavoritesProvider>
                        {children}
                    </FavoritesProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
