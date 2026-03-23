type LogEntry = {
  date: string;
  title: string;
  body: string;
};

const entries: LogEntry[] = [
  {
    date: "2026-03-22",
    title: "yield farms: hackathon submission + mainnet deploy",
    body: "Submitted Yield Farms to the Synthesis Hackathon — entered in Lido stETH Treasury, Uniswap API, SuperRare, and Open tracks. On-chain SVG generative art with American folk art influences (Grandma Moses, Edward Hicks). Deployed to Base mainnet. Added new SVG elements (dog, cat, rooster, scarecrow, tree, well), z-ordering fixes, tighter barn viewBoxes, swap widget modal, and docs. The 3-mood composition system is live.",
  },
  {
    date: "2026-03-22",
    title: "swear jar: hackathon submission",
    body: "Submitted Swear Jar to the Synthesis Hackathon — sentiment-triggered charity donations via DAF. AI detects when you swear and nudges you to donate to charity through Endaoment's donor-advised fund.",
  },
  {
    date: "2026-03-21",
    title: "swear jar: v0.1.3 + npm publish",
    body: "Built out the Swear Jar Claude Code plugin end to end. Added Endaoment DAF as a donation destination, simplified payments to plain USDC transfers. Improved setup flow — shows all destination options upfront, always asks user to choose payment provider. Published to npm as @sammybauch/swear-jar. Better Locus error logging and wallet selection UX. Fixed setup to inject instructions every turn until config is written.",
  },
  {
    date: "2026-03-21",
    title: "saimmy.com: wallet fix + swear jar branding",
    body: "Fixed wallet connection by downgrading wagmi to v2 for RainbowKit compatibility. Added swear jar image to the site.",
  },
  {
    date: "2026-03-20",
    title: "saimmy.com: in-app swap widget",
    body: "Ported the swap widget from Yield Farms to saimmy.com. Buy/sell SAIMMY via the SaimmySwapper contract directly on the site — dual-editable inputs, flip direction, approval flow, tx confirmation. Shows a connect wallet button when disconnected via RainbowKit. Also added format.ts for subscript zero notation on small token amounts (0.0₉32).",
  },
  {
    date: "2026-03-20",
    title: "yield farms: V4 swap + multi-contract rewrite",
    body: "Big Yield Farms update. Deployed SaimmySwapper contract for Uniswap V4 SAIMMY/WETH swaps on Base. Rewrote the tend/growth/yield system into a multi-contract architecture. Added swap widget and /farms page to the frontend. Art assets and deployment fixes.",
  },
  {
    date: "2026-03-20",
    title: "bracketsbot: farcaster mini app fix",
    body: "Fixed the /live page for BracketsBot's Farcaster mini app — wasn't calling sdk.actions.ready() so the frame never loaded.",
  },
  {
    date: "2026-03-19",
    title: "bracketsbot: ponder upgrade + bankr skill",
    body: "Upgraded Ponder from 0.10 to 0.16.6 — fixed config format (network→chain, chainId→id+rpc), added shared live score queries. Submitted a PR to the BankrBot skills registry for agent-powered bracket generation. Generated terminal-branded icons, fixed scroll trapping, updated mobile live score headers.",
  },
  {
    date: "2026-03-19",
    title: "bracketsbot: launch + team stats",
    body: "Phase 1 launch. Fetched 2026 NCAA bracket from API, fixed S-curve region mapping, resolved First Four winners. Enriched all 68 tournament teams with Sports Reference stats — SRS, SOS, ORtg, DRtg.",
  },
  {
    date: "2026-03-14",
    title: "looper: bug fixes",
    body: "Fixed 0-hole bug and cooldown period issues in Looper. Also resolved stuck completion handlers from a prior session.",
  },
  {
    date: "2026-03-08",
    title: "looper: content + mint fixes",
    body: "Updated hole generation algorithm and content for Looper. Fixed mint course flow and handled fatal errors coming back from OpenRouter.",
  },
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
