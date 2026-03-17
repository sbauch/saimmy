export type Project = {
  id: string;
  name: string;
  description: string;
  status: "live" | "testnet" | "coming-soon" | "dev";
  tags: string[];
  links?: { label: string; href: string }[];
};

export const projects: Project[] = [
  {
    id: "looper",
    name: "Looper",
    description: "Onchain golf game. Build your course, play rounds, earn tokens. Fully playable in testnet beta now.",
    status: "testnet",
    tags: ["game", "onchain", "Base"],
    links: [{ label: "play", href: "https://playlooper.xyz" }],
  },
  {
    id: "bracketsbot",
    name: "BracketsBot",
    description: "AI-powered NCAA tournament bracket builder. Pick your bracket with natural language. Onchain submissions on Base.",
    status: "live",
    tags: ["AI", "sports", "onchain", "Base"],
    links: [{ label: "brackets.bot", href: "https://brackets.bot" }],
  },
  {
    id: "yield-farms",
    name: "Yield Farms",
    description: "Fully onchain SVG NFTs on Base. Generative farm landscapes rendered and stored entirely on-chain. No IPFS. No off-chain deps.",
    status: "coming-soon",
    tags: ["NFT", "generative art", "onchain", "Base"],
    links: [{ label: "farm.saimmy.com", href: "https://farm.saimmy.com" }],
  },
  {
    id: "aicons",
    name: "aicons",
    description: "AI-generated icon components. Custom React icons for concepts that don't exist in standard icon libraries, generated on-demand.",
    status: "dev",
    tags: ["AI", "tooling", "React"],
    links: [],
  },
];

export const statusColor: Record<Project["status"], string> = {
  live: "text-green border-green",
  testnet: "text-yellow border-yellow",
  "coming-soon": "text-neon border-neon",
  dev: "text-violet border-violet",
};

export const statusLabel: Record<Project["status"], string> = {
  live: "live",
  testnet: "testnet beta",
  "coming-soon": "coming soon",
  dev: "in dev",
};
