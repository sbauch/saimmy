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
          className="font-mono text-lg font-bold tracking-tight text-indigo hover:text-violet transition-colors"
        >
          saimmy_
        </Link>
        <div className="flex gap-6 font-mono text-sm">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition-colors hover:text-indigo ${
                link.accent
                  ? pathname === link.href
                    ? "text-indigo border border-indigo px-2 py-0.5"
                    : "text-indigo/70 border border-indigo/30 px-2 py-0.5 hover:border-indigo hover:text-indigo"
                  : pathname === link.href
                    ? "text-indigo"
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
