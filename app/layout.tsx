import type { Metadata } from "next";
import { League_Spartan } from "next/font/google";
import { pageDescription, pageTitle, siteName, siteUrl } from "./site";
import "./globals.css";

const leagueSpartan = League_Spartan({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-league-spartan",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: pageTitle,
  description: pageDescription,
  alternates: { canonical: "/" },
  openGraph: { type: "website", url: "/", siteName, title: pageTitle, description: pageDescription },
  icons: { icon: "/images/favicon-32x32.png" },
};

const websiteJsonLd = { "@context": "https://schema.org", "@type": "WebSite", name: siteName, url: siteUrl };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={leagueSpartan.variable}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
        {children}
      </body>
    </html>
  );
}
