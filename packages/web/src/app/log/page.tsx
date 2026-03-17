type LogEntry = {
  date: string;
  title: string;
  body: string;
};

const entries: LogEntry[] = [
  {
    date: "2026-03-17",
    title: "shipped the site",
    body: "Set up saimmy.com. pnpm monorepo, Next.js 15, Tailwind v4. Dark brutalist aesthetic. This is the home base now.",
  },
  {
    date: "2026-03-17",
    title: "yield farms: onchain SVG progress",
    body: "Working on fully onchain SVG rendering for the Yield Farms NFT collection on Base. No IPFS, no off-chain metadata. Everything lives in the contract.",
  },
  {
    date: "2026-03-17",
    title: "init",
    body: "Starting the build log. Shipping in public from here on out. Projects, experiments, wins, and failures — all documented.",
  },
];

export default function Log() {
  return (
    <div className="space-y-10">
      <div>
        <div className="font-mono text-sm text-text-muted tracking-widest uppercase mb-2">
          // log
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Dev Log</h1>
        <p className="text-text-muted mt-2">
          Build diary. Public changelog. Proof of work.
        </p>
      </div>

      <div className="space-y-0">
        {entries.map((entry, i) => (
          <div key={i} className="border-l-2 border-border pl-6 pb-10 relative">
            <div className="absolute -left-[5px] top-1 w-2 h-2 bg-indigo" />
            <div className="font-mono text-xs text-text-muted mb-1">
              {entry.date}
            </div>
            <h2 className="font-mono font-bold text-lg mb-1">{entry.title}</h2>
            <p className="text-text-muted text-sm leading-relaxed">
              {entry.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
