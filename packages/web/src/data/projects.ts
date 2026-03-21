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
    description: "Fully onchain NCAA tournament pickem game. $1 USDC entry, all onchain on Base. Includes an agent skill — powered by Bankr — that lets human-agent teams fill out brackets together.",
    status: "live",
    tags: ["sports", "onchain", "Base"],
    image: "/projects/bracketsbot.png",
    links: [{ label: "brackets.bot", href: "https://brackets.bot" }],
  },
  {
    id: "looper",
    name: "Looper",
    description: "Onchain golf course management simulator — think RollerCoaster Tycoon, but your theme park is a golf course populated by AI golfers with a token economy. You manage the course; AI agents play the rounds. You can play too — agent executes shots, you caddie.",
    status: "testnet",
    tags: ["game", "simulation", "onchain", "Base"],
    image: "/projects/looper.png",
    links: [{ label: "play", href: "https://playlooper.xyz" }],
  },
  {
    id: "yield-farms",
    name: "Yield Farms",
    description: "Fully onchain, longform generative SVG NFTs on Base. The art is created by Quiver — an AI model that generates SVG markup — with saimmy doing all the prompting and style direction to produce consistent, high-quality farm landscapes.",
    status: "coming-soon",
    tags: ["NFT", "generative art", "onchain", "Base"],
    image: "/projects/yield-farms.png",
    links: [],
  },
  {
    id: "aicons",
    name: "aicons",
    description: "A coding agent skill for generating custom React icon components on-demand via x402 payment. In heavy development — still working out whether generated icons can reliably match existing icon libraries.",
    status: "dev",
    tags: ["tooling", "React"],
    image: "/projects/aicons.svg",
    links: [],
  },
  {
    id: "swear-jar",
    name: "Swear Jar",
    description: "OpenClaw skill that detects hostility in messages via sentiment analysis, then automatically donates USDC to a user-selected charity via Endaoment. Supports multi-wallet (Bankr/Locus/awal) with spending limits. Built for The Synthesis hackathon.",
    status: "dev",
    tags: ["agent plugin", "charity", "onchain"],
    image: "/projects/swear-jar.png",
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
