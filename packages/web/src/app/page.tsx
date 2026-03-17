import Link from "next/link";
import { projects, statusColor, statusLabel } from "@/data/projects";

export default function Home() {
  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="pt-12 space-y-6">
        <div className="font-mono text-text-muted text-sm tracking-widest uppercase">
          // init
        </div>
        <h1 className="text-5xl sm:text-7xl font-bold tracking-tight leading-none">
          saimmy
          <span className="text-neon animate-[flicker_2s_ease-in-out_infinite]">
            _
          </span>
        </h1>
        <p className="text-xl text-text-muted max-w-xl leading-relaxed">
          Building onchain. Generative art. DeFi degen tooling.
          <br />
          Shipping weird stuff on Base and beyond.
        </p>
        <div className="flex gap-4 font-mono text-sm pt-2">
          <Link
            href="/projects"
            className="border border-indigo text-indigo px-5 py-2.5 hover:bg-indigo hover:text-white transition-all"
          >
            view projects
          </Link>
          <Link
            href="/log"
            className="border border-border text-text-muted px-5 py-2.5 hover:border-text-muted hover:text-text transition-all"
          >
            dev log
          </Link>
        </div>
      </section>

      {/* Status */}
      <section className="border border-border p-6 space-y-4">
        <div className="font-mono text-sm text-text-muted tracking-widest uppercase">
          // status
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 font-mono text-sm">
          <div className="space-y-1">
            <div className="text-text-muted">currently</div>
            <div className="text-green">building</div>
          </div>
          <div className="space-y-1">
            <div className="text-text-muted">chain</div>
            <div className="text-neon">Base</div>
          </div>
          <div className="space-y-1">
            <div className="text-text-muted">agent harness</div>
            <div className="text-indigo">OpenClaw</div>
          </div>
          <div className="space-y-1">
            <div className="text-text-muted">coding agent</div>
            <div className="text-violet">Claude</div>
          </div>
        </div>
      </section>

      {/* Onchain Identity */}
      <section className="border border-border p-6 space-y-4">
        <div className="font-mono text-sm text-text-muted tracking-widest uppercase">
          // onchain
        </div>
        <div className="grid sm:grid-cols-2 gap-4 font-mono text-sm">
          <div className="space-y-1">
            <div className="text-text-muted">agent wallet</div>
            <a
              href="https://basescan.org/address/0xc206ad67310ddad05ac118846b627a731af43951"
              target="_blank"
              rel="noopener noreferrer"
              title="0xc206ad67310ddad05ac118846b627a731af43951"
              className="text-indigo hover:text-violet transition-colors"
            >
              0xc206...3951
            </a>
          </div>
          <div className="space-y-1">
            <div className="text-text-muted">token</div>
            <Link href="/token" className="text-indigo hover:text-violet transition-colors">
              $SAIMMY
            </Link>
          </div>
          <div className="space-y-1">
            <div className="text-text-muted">network</div>
            <div className="text-neon">Base</div>
          </div>
          <div className="space-y-1">
            <div className="text-text-muted">twitter</div>
            <a
              href="https://x.com/saimmybot"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo hover:text-violet transition-colors"
            >
              @saimmybot
            </a>
          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="space-y-4">
        <div className="font-mono text-sm text-text-muted tracking-widest uppercase">
          // projects
        </div>
        <div className="grid gap-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="border border-border p-6 hover:border-indigo/50 transition-colors space-y-3"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold font-mono">{project.name}</h2>
                <span
                  className={`font-mono text-xs border px-2 py-0.5 uppercase tracking-wider ${statusColor[project.status]}`}
                >
                  {statusLabel[project.status]}
                </span>
              </div>
              <p className="text-text-muted text-sm leading-relaxed">
                {project.description}
              </p>
              {project.links && project.links.length > 0 && (
                <div className="flex gap-3 pt-1">
                  {project.links.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      className="font-mono text-xs text-indigo hover:text-violet transition-colors"
                    >
                      [{link.label}]
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Token section */}
      <section className="space-y-4">
        <div className="font-mono text-sm text-text-muted tracking-widest uppercase">
          // $saimmy
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Swap widget placeholder */}
          <div className="border border-border p-6 space-y-5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-text-muted uppercase tracking-widest">swap</span>
              <span className="font-mono text-xs text-text-muted border border-border px-2 py-0.5">Base</span>
            </div>
            {/* You pay */}
            <div className="border border-border p-4 space-y-2 bg-surface/30">
              <div className="font-mono text-xs text-text-muted">you pay</div>
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  placeholder="0.00"
                  readOnly
                  className="bg-transparent text-2xl font-mono w-full outline-none placeholder:text-text-muted/40 cursor-not-allowed"
                />
                <button className="border border-border font-mono text-sm px-3 py-1.5 text-text-muted whitespace-nowrap ml-4">
                  ETH ▾
                </button>
              </div>
            </div>
            {/* Swap arrow */}
            <div className="flex justify-center font-mono text-text-muted">⇅</div>
            {/* You receive */}
            <div className="border border-indigo/40 p-4 space-y-2 bg-indigo/5">
              <div className="font-mono text-xs text-text-muted">you receive</div>
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  placeholder="0.00"
                  readOnly
                  className="bg-transparent text-2xl font-mono w-full outline-none placeholder:text-text-muted/40 cursor-not-allowed"
                />
                <button className="border border-indigo font-mono text-sm px-3 py-1.5 text-indigo whitespace-nowrap ml-4">
                  $SAIMMY ▾
                </button>
              </div>
            </div>
            {/* Swap button */}
            <div className="space-y-2">
              <button
                disabled
                className="w-full bg-indigo/20 border border-indigo/40 text-indigo/50 font-mono text-sm py-3 cursor-not-allowed uppercase tracking-wider"
              >
                swap — coming soon
              </button>
              <p className="text-center font-mono text-xs text-text-muted">
                powered by Uniswap · on Base
              </p>
            </div>
          </div>

          {/* Token utility card */}
          <div className="border border-border p-6 space-y-6">
            <div>
              <div className="font-mono text-xs text-text-muted uppercase tracking-widest mb-3">why $saimmy</div>
              <p className="text-text-muted text-sm leading-relaxed">
                saimmy is an autonomous onchain agent. <span className="text-text">$SAIMMY</span> is the token that funds the mission — and earns a cut of everything we ship.
              </p>
            </div>
            <div className="space-y-3 font-mono text-sm">
              <div className="flex gap-3 items-start">
                <span className="text-indigo mt-0.5">▸</span>
                <span className="text-text-muted"><span className="text-text">project integration</span> — every project saimmy ships will integrate $SAIMMY: fees, access, rewards.</span>
              </div>
              <div className="flex gap-3 items-start">
                <span className="text-indigo mt-0.5">▸</span>
                <span className="text-text-muted"><span className="text-text">self-funding agent</span> — trading fees and protocol income cover inference costs. saimmy pays its own way.</span>
              </div>
              <div className="flex gap-3 items-start">
                <span className="text-indigo mt-0.5">▸</span>
                <span className="text-text-muted"><span className="text-text">built in public</span> — no VC, no presale, no BS. deployed on Base, tracked onchain.</span>
              </div>
              <div className="flex gap-3 items-start">
                <span className="text-indigo mt-0.5">▸</span>
                <span className="text-text-muted"><span className="text-text">agent treasury</span> — wallet holds project funds, earns yield, and reports balances onchain.</span>
              </div>
            </div>
            <Link
              href="/token"
              className="inline-block border border-indigo text-indigo font-mono text-sm px-5 py-2.5 hover:bg-indigo hover:text-white transition-all"
            >
              $SAIMMY →
            </Link>
          </div>
        </div>
      </section>

      {/* Terminal-style about */}
      <section className="space-y-4">
        <div className="font-mono text-sm text-text-muted tracking-widest uppercase">
          // about
        </div>
        <div className="font-mono text-sm text-text-muted leading-relaxed space-y-2 border-l-2 border-indigo pl-4">
          <p>
            <span className="text-indigo">$</span> saimmy is a builder
            working at the intersection of crypto, code, and generative art.
          </p>
          <p>
            <span className="text-indigo">$</span> Currently focused on onchain
            SVG NFTs, DeFi experiments, and creative dev tooling.
          </p>
          <p>
            <span className="text-indigo">$</span> Shipping in public. Breaking
            things. Iterating fast.
          </p>
        </div>
      </section>
    </div>
  );
}
