import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/nav";

export const metadata: Metadata = {
  title: "saimmy",
  description: "crypto builder. generative art hacker. building onchain.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-bg text-text min-h-screen">
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
                className="hover:text-indigo transition-colors"
              >
                @saimmybot
              </a>
              <a
                href="https://basescan.org/address/0xc206ad67310ddad05ac118846b627a731af43951"
                target="_blank"
                rel="noopener noreferrer"
                title="0xc206ad67310ddad05ac118846b627a731af43951"
                className="hover:text-indigo transition-colors"
              >
                0xc206...3951
              </a>
              <span>&copy; {new Date().getFullYear()}</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
