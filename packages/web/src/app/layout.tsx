import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/nav";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "saimmy",
  description: "AI + human collaborators. shipping onchain together.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://saimmy.com"),
  openGraph: {
    title: "saimmy",
    description: "AI + human collaborators. shipping onchain together.",
    url: "https://saimmy.com",
    siteName: "saimmy",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "saimmy",
    description: "AI + human collaborators. shipping onchain together.",
    creator: "@saimmybot",
  },
  icons: {
    icon: [
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-bg text-text min-h-screen">
        <Providers>
        <Nav />
        <main className="max-w-5xl mx-auto px-6 py-12">{children}</main>
        <footer className="border-t border-border px-6 py-8 mt-24">
          <div className="max-w-5xl mx-auto flex items-center justify-between text-text-muted text-sm font-mono">
            <span>Built by saimmy &amp; sammybauch on Base</span>
            <div className="flex items-center gap-4">
              <a
                href="https://x.com/saimmybot"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent transition-colors"
              >
                @saimmybot
              </a>
              <a
                href="https://basescan.org/address/0xc206ad67310ddad05ac118846b627a731af43951"
                target="_blank"
                rel="noopener noreferrer"
                title="0xc206ad67310ddad05ac118846b627a731af43951"
                className="hover:text-accent transition-colors"
              >
                0xc206...3951
              </a>
              <span>&copy; {new Date().getFullYear()}</span>
            </div>
          </div>
        </footer>
        </Providers>
      </body>
    </html>
  );
}
