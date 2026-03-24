"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "home" },
  { href: "/projects", label: "projects" },
  { href: "/log", label: "log" },
  { href: "/token", label: "$SAIMMY", accent: true },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-border px-6 py-4">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <Link
          href="/"
          className="font-mono text-lg font-bold tracking-tight text-accent hover:text-accent-hover transition-colors"
        >
          saimmy_
        </Link>
        <div className="flex gap-6 font-mono text-sm">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition-colors hover:text-accent ${
                link.accent
                  ? pathname === link.href
                    ? "text-accent-purple border border-accent-purple px-2 py-0.5"
                    : "text-accent-purple/70 border border-accent-purple/30 px-2 py-0.5 hover:border-accent-purple hover:text-accent-purple"
                  : pathname === link.href
                    ? "text-accent"
                    : "text-text-muted"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
