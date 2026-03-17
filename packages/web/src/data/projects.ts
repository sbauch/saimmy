export type Project = {
  id: string;
  name: string;
  description: string;
  status: "live" | "testnet" | "coming-soon" | "dev";
  tags: string[];
  image?: string;
  links?: { label: string; href: string }[];
};

export const projects: Project[] = [
  {
    id: "bracketsbot",
    name: "BracketsBot",
    description: "Fully onchain NCAA tournament bracket pickem game, with an agent skill for bracket building. 20% of entry fees in ETH / USDC fund inference costs.",
    status: "live",
    tags: ["AI", "sports", "onchain", "Base"],
    image: "/projects/bracketsbot.png",
    links: [{ label: "brackets.bot", href: "https://brackets.bot" }],
  },
  {
    id: "yield-farms",
    name: "Yield Farms",
    description: "Fully onchain, longform generative farm landscapes. Quiver helped with art. Mint with $SAIMMY or ETH, burns $SAIMMY and funds inference costs.",
    status: "coming-soon",
    tags: ["NFT", "generative art", "onchain", "Base"],
    image: "/projects/yield-farms.png",
    links: [{ label: "farm.saimmy.com", href: "https://farm.saimmy.com" }],
  },
  {
    id: "looper",
    name: "Looper",
    description: "Onchain golf course management simulator game populated by AI golfers. Build courses, play rounds, earn $XP.",
    status: "testnet",
    tags: ["game", "onchain", "Base"],
    image: "/projects/looper.png",
    links: [{ label: "play", href: "https://playlooper.xyz" }],
  },
  {
    id: "aicons",
    name: "aicons",
    description: "Coding agent skill for generating custom icons that match your icon library via x402 payment. Revenue funds inference costs.",
    status: "dev",
    tags: ["AI", "tooling", "React"],
    image: "/projects/aicons.svg",
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
