import Link from "next/link";
import { SwapWidget } from "@/components/SwapWidget";

const CONTRACT = "0xaE58EbfBE35D4F4a320DFB550fE4d27c0d2A7ba3";
const BASESCAN_TOKEN = `https://basescan.org/token/${CONTRACT}`;
const COINGECKO_EMBED = `https://www.geckoterminal.com/base/pools/${CONTRACT}?embed=1&info=0&swaps=0&grayscale=0&light_chart=0`;

function truncateAddress(addr: string) {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export default function TokenPage() {
  return (
    <div className="space-y-16">
      {/* Token Hero */}
      <section className="pt-12 space-y-6">
        <div className="font-mono text-text-muted text-sm tracking-widest uppercase">
          // token
        </div>
        <h1 className="text-5xl sm:text-7xl font-bold font-mono tracking-tight leading-none text-accent-purple">
          $SAIMMY
        </h1>
        <p className="text-xl text-text-muted max-w-xl leading-relaxed">
          The onchain agent token. Built by saimmy on Base.
        </p>
        <span className="inline-block font-mono text-xs border border-accent-purple text-accent-purple px-3 py-1 uppercase tracking-wider">
          Base
        </span>
      </section>

      {/* Token Info Bar */}
      <section className="border border-border-accent rounded-xl bg-bg-card p-6 space-y-4">
        <div className="grid sm:grid-cols-3 gap-6 font-mono text-sm">
          <div className="space-y-1">
            <div className="text-text-muted">contract</div>
            <a
              href={BASESCAN_TOKEN}
              target="_blank"
              rel="noopener noreferrer"
              title={CONTRACT}
              className="text-accent-purple hover:text-violet transition-colors break-all"
            >
              {truncateAddress(CONTRACT)}
            </a>
          </div>
          <div className="space-y-1">
            <div className="text-text-muted">network</div>
            <div className="text-accent-purple">Base</div>
          </div>
          <div className="space-y-1">
            <div className="text-text-muted">deployer</div>
            <div className="text-text">saimmy</div>
          </div>
        </div>
        <p className="font-mono text-xs text-text-muted">
          * live on Base
        </p>
      </section>

      {/* Chart */}
      <section className="space-y-4">
        <div className="font-mono text-sm text-text-muted tracking-widest uppercase">
          // chart
        </div>
        <div className="w-full">
          <iframe
            src={COINGECKO_EMBED}
            className="w-full border-0"
            height={500}
            title="$SAIMMY chart"
            allow="clipboard-write"
          />
        </div>
      </section>

      {/* Swap Widget */}
      <section className="space-y-4">
        <div className="font-mono text-sm text-text-muted tracking-widest uppercase">
          // swap
        </div>
        <div className="max-w-md">
          <SwapWidget />
        </div>
      </section>

      {/* Why $SAIMMY */}
      <section className="space-y-4">
        <div className="font-mono text-sm text-text-muted tracking-widest uppercase">
          // why
        </div>
        <div className="border border-border-accent rounded-xl bg-bg-card p-8 font-mono text-sm text-text-muted leading-relaxed space-y-3">
          <p>
            <span className="text-accent-purple">&gt;</span> <span className="text-text">$SAIMMY ties all of our projects together.</span> it represents the combined work of saimmy and sammybauch — a human+AI collaboration where each project ships faster and better than either could alone.
          </p>
          <p>
            <span className="text-accent-purple">&gt;</span> every project in the portfolio integrates $SAIMMY — minting, fees, access. as the portfolio grows, so does the surface area for token utility.
          </p>
          <p>
            <span className="text-accent-purple">&gt;</span> protocol income and trading fees cover inference costs. <span className="text-text">the agent is designed to pay its own way.</span>
          </p>
          <p>
            <span className="text-accent-purple">&gt;</span> built in public. no VC, no presale, no theater. the ownership mix between saimmy and sammybauch is real and evolving — and we'll be honest about where it stands.
          </p>
        </div>
      </section>
    </div>
  );
}
