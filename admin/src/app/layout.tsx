import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
	title: "APP 190 - Admin",
	description: "Painel Administrativo - App da SSP-BA",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<head></head>
			<body className="">
				<Script
					async
					id="google-adsense"
					src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-${process.env.NEXT_GOOGLE_ADSENSE}`}
					crossOrigin="anonymous"
				>
					<div className="wrapper">{children}</div>
				</Script>
			</body>
		</html>
	);
}
