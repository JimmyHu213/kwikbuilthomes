import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { Header } from "./components/header";
import { Footer } from "./components/footer";

// ISR: the Footer fetches SiteSettings via the CMS — revalidate so header/footer
// content updates within 5 minutes of an edit without a redeploy
export const revalidate = 300;

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: {
		default: 'Kwik Built Homes | Australian Modular Homes for Developers & Builders',
		template: '%s | Kwik Built Homes',
	},
	description: 'Australian-engineered modular homes for developers, builders, and sub-distributors. Browse our catalog, configure options, and request quotes.',
	metadataBase: new URL('https://kwikbuilthomes.com.au'),
	openGraph: {
		type: 'website',
		locale: 'en_AU',
		siteName: 'Kwik Built Homes',
	},
	robots: {
		index: true,
		follow: true,
	},
}

export default function FrontendLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<head>
				<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
			</head>
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				<Header />
				<main className="min-h-screen">
					{children}
				</main>
				<Footer />
			</body>
		</html>
	);
}
