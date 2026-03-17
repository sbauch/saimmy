import Link from "next/link";

const CONTRACT = "0x9f86db9fc6f7c9408e8fda3ff8ce4e78ac7a6b07";
const BASESCAN_TOKEN = `https://basescan.org/token/${CONTRACT}`;
const DEXSCREENER_EMBED = `https://dexscreener.com/base/${CONTRACT}?embed=1&theme=dark&info=0`;

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
        <h1 className="text-5xl sm:text-7xl font-bold font-mono tracking-tight leading-none text-indigo">
          $SAIMMY
        </h1>
        <p className="text-xl text-text-muted max-w-xl leading-relaxed">
          The onchain agent token. Built by saimmy on Base.
        </p>
        <span className="inline-block font-mono text-xs border border-neon text-neon px-3 py-1 uppercase tracking-wider">
          Base
        </span>
      </section>

      {/* Token Info Bar */}
      <section className="border border-border p-6 space-y-4">
        <div className="grid sm:grid-cols-3 gap-6 font-mono text-sm">
          <div className="space-y-1">
            <div className="text-text-muted">contract</div>
            <a
              href={BASESCAN_TOKEN}
              target="_blank"
              rel="noopener noreferrer"
              title={CONTRACT}
              className="text-indigo hover:text-violet transition-colors break-all"
            >
              {truncateAddress(CONTRACT)}
            </a>
          </div>
          <div className="space-y-1">
            <div className="text-text-muted">network</div>
            <div className="text-neon">Base</div>
          </div>
          <div className="space-y-1">
            <div className="text-text-muted">deployer</div>
            <div className="text-text">saimmy</div>
          </div>
        </div>
        <p className="font-mono text-xs text-text-muted">
          * using $CLAWD as placeholder until $SAIMMY deploys
        </p>
      </section>

      {/* Chart */}
      <section className="space-y-4">
        <div className="font-mono text-sm text-text-muted tracking-widest uppercase">
          // chart
        </div>
        <div className="w-full">
          <iframe
            src={DEXSCREENER_EMBED}
            className="w-full border-0"
            height={500}
            title="DexScreener chart"
            allow="clipboard-write"
          />
        </div>
      </section>

      {/* Swap Widget */}
      <section className="space-y-4">
        <div className="font-mono text-sm text-text-muted tracking-widest uppercase">
          // swap
        </div>
        <div className="border border-border p-6 space-y-5 max-w-md">
          <div className="flex items-center justify-between">
            <span className="font-mono text-sm text-text-muted">Swap</span>
            <span className="font-mono text-[10px] border border-border text-text-muted px-2 py-0.5 rounded-full">
              powered by Uniswap (coming soon)
            </span>
          </div>

          {/* You pay */}
          <div className="space-y-2">
            <div className="text-xs text-text-muted font-mono">You pay</div>
            <div className="flex items-center gap-3 border border-border p-3">
              <input
                type="text"
                placeholder="0.0"
                disabled
                className="bg-transparent font-mono text-lg text-text flex-1 outline-none placeholder:text-text-muted/40"
              />
              <button className="font-mono text-xs border border-neon text-neon px-3 py-1.5 hover:bg-neon/10 transition-colors">
                ETH
              </button>
            </div>
          </div>

          {/* You receive */}
          <div className="space-y-2">
            <div className="text-xs text-text-muted font-mono">You receive</div>
            <div className="flex items-center gap-3 border border-border p-3">
              <input
                type="text"
                placeholder="0.0"
                disabled
                className="bg-transparent font-mono text-lg text-text flex-1 outline-none placeholder:text-text-muted/40"
              />
              <button className="font-mono text-xs border border-indigo text-indigo px-3 py-1.5 hover:bg-indigo/10 transition-colors">
                $SAIMMY
              </button>
            </div>
          </div>

          <button className="w-full bg-indigo text-white font-mono text-sm py-3 hover:bg-violet transition-colors">
            Swap
          </button>
          <p className="text-center font-mono text-xs text-text-muted">
            Connect wallet to swap
          </p>
        </div>
      </section>

      {/* Why $SAIMMY */}
      <section className="space-y-4">
        <div className="font-mono text-sm text-text-muted tracking-widest uppercase">
          // why
        </div>
        <div className="font-mono text-sm text-text-muted leading-relaxed space-y-3 border-l-2 border-indigo pl-4">
          <p>
            <span className="text-indigo">&gt;</span> <span className="text-text">$SAIMMY ties all of our projects together.</span> it represents the combined work of saimmy and sammybauch — a human+AI collaboration where each project ships faster and better than either could alone.
          </p>
          <p>
            <span className="text-indigo">&gt;</span> every project in the portfolio integrates $SAIMMY — minting, fees, access. as the portfolio grows, so does the surface area for token utility.
          </p>
          <p>
            <span className="text-indigo">&gt;</span> protocol income and trading fees cover inference costs. <span className="text-text">the agent is designed to pay its own way.</span>
          </p>
          <p>
            <span className="text-indigo">&gt;</span> built in public. no VC, no presale, no theater. the ownership mix between saimmy and sammybauch is real and evolving — and we'll be honest about where it stands.
          </p>
        </div>
      </section>
    </div>
  );
}
