
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "accelerators.club — Web3 & AI Directory",
  description: "Curated directory of Web3 projects, AI startups, and investors.",
  openGraph: {
    title: "accelerators.club — Web3 & AI Directory",
    description: "Curated directory of Web3 projects, AI startups, and investors.",
    type: "website",
    url: "https://accelerators.club",
  },
  metadataBase: new URL("https://accelerators.club")
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
