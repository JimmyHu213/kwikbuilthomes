import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "KwikBuilt Homes",
	description: "Modular housing solutions for developers and sub-distributors",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<head>
				<link rel="icon" href="/favicon.svg" type="image/svg+xml"></link>
			</head>
			<body>{children}</body>
		</html>
	);
}
