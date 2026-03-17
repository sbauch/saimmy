import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";

export const alt = "saimmy — AI + human. building onchain.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

function readImg(relPath: string) {
  const data = readFileSync(join(process.cwd(), "public", relPath));
  const mime = relPath.endsWith(".png") ? "image/png" : "image/jpeg";
  return `data:${mime};base64,${data.toString("base64")}`;
}

function fmt(n: number, decimals = 2) {
  return n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

function fmtMcap(n: number) {
  if (n >= 1_000_000) return `$${fmt(n / 1_000_000)}M`;
  if (n >= 1_000) return `$${fmt(n / 1_000)}K`;
  return `$${fmt(n)}`;
}

const TOKEN_ADDRESS = "0xaE58EbfBE35D4F4a320DFB550fE4d27c0d2A7ba3";

const projectImages = [
  { file: "projects/og-bracketsbot.png", name: "BracketsBot", status: "LIVE", color: "#22c55e" },
  { file: "projects/og-looper.png", name: "Looper", status: "TESTNET", color: "#facc15" },
  { file: "projects/og-yield-farms.png", name: "Yield Farms", status: "SOON", color: "#22d3ee" },
  { name: "aicons", status: "DEV", color: "#a855f7", file: null },
] as const;

export default async function Image() {
  const logoSrc = readImg("logo.jpg");
  const projectImgs = projectImages.map((p) => ({
    ...p,
    src: p.file ? readImg(p.file) : null,
  }));

  // Fetch live token data
  let price = "—";
  let mcap = "—";
  let change24h: number | null = null;
  let vol24h = "—";
  let liquidity = "—";

  try {
    const res = await fetch(
      `https://api.dexscreener.com/latest/dex/tokens/${TOKEN_ADDRESS}`,
      { next: { revalidate: 60 } }
    );
    const json = await res.json();
    const pair = json?.pairs?.[0];
    if (pair) {
      price = pair.priceUsd ? `$${Number(pair.priceUsd).toFixed(6)}` : "—";
      mcap = pair.marketCap ? fmtMcap(pair.marketCap) : "—";
      change24h = pair.priceChange?.h24 ?? null;
      vol24h = pair.volume?.h24 ? fmtMcap(pair.volume.h24) : "—";
      liquidity = pair.liquidity?.usd ? fmtMcap(pair.liquidity.usd) : "—";
    }
  } catch {
    // non-fatal — show dashes
  }

  const changeColor = change24h === null ? "#71717a" : change24h >= 0 ? "#22c55e" : "#ef4444";
  const changeStr = change24h === null ? "—" : `${change24h >= 0 ? "+" : ""}${fmt(change24h)}%`;

  return new ImageResponse(
    (
      <div
        style={{
          background: "#09090b",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          fontFamily: "monospace",
          padding: "48px 56px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Grid bg */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(99,102,241,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.05) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            display: "flex",
          }}
        />

        {/* Header row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <img
              src={logoSrc}
              width={56}
              height={56}
              style={{ borderRadius: "50%", border: "2px solid #6366f1" }}
              alt="saimmy"
            />
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <div style={{ color: "#ffffff", fontSize: "32px", fontWeight: 700, display: "flex", letterSpacing: "-0.5px" }}>
                saimmy<span style={{ color: "#22d3ee" }}>_</span>
              </div>
              <div style={{ color: "#52525b", fontSize: "13px", display: "flex", letterSpacing: "2px" }}>
                AI + HUMAN · BUILDING ONCHAIN
              </div>
            </div>
          </div>
          {/* Token ticker */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
              <span style={{ color: "#6366f1", fontSize: "20px", fontWeight: 700 }}>$SAIMMY</span>
              <span style={{ color: "#ffffff", fontSize: "24px", fontWeight: 600 }}>{price}</span>
            </div>
            <div style={{ display: "flex", gap: "16px" }}>
              <span style={{ color: changeColor, fontSize: "14px", fontWeight: 600 }}>{changeStr} 24h</span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: "1px", background: "#27272a", margin: "28px 0", display: "flex" }} />

        {/* Main content: token stats left, projects right */}
        <div style={{ display: "flex", gap: "32px", flex: 1 }}>

          {/* Token stats panel */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0px", width: "320px", border: "1px solid #27272a", padding: "24px" }}>
            <div style={{ color: "#52525b", fontSize: "11px", letterSpacing: "3px", display: "flex", marginBottom: "20px" }}>
              TOKEN STATS
            </div>
            {[
              { label: "PRICE", value: price, color: "#ffffff" },
              { label: "MCAP", value: mcap, color: "#ffffff" },
              { label: "24H VOL", value: vol24h, color: "#ffffff" },
              { label: "LIQUIDITY", value: liquidity, color: "#ffffff" },
              { label: "24H CHANGE", value: changeStr, color: changeColor },
            ].map((stat) => (
              <div key={stat.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #18181b" }}>
                <span style={{ color: "#52525b", fontSize: "12px", letterSpacing: "1px" }}>{stat.label}</span>
                <span style={{ color: stat.color, fontSize: "15px", fontWeight: 600 }}>{stat.value}</span>
              </div>
            ))}
            <div style={{ display: "flex", marginTop: "16px" }}>
              <span style={{ color: "#3f3f46", fontSize: "11px", letterSpacing: "1px" }}></span>
            </div>
          </div>

          {/* Projects grid */}
          <div style={{ display: "flex", flexDirection: "column", flex: 1, gap: "0px" }}>
            <div style={{ color: "#52525b", fontSize: "11px", letterSpacing: "3px", display: "flex", marginBottom: "16px" }}>
              PROJECTS
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", flex: 1 }}>
              {projectImgs.map((p) => (
                <div
                  key={p.name}
                  style={{
                    width: 362,
                    display: "flex",
                    flexDirection: "column",
                    border: "1px solid #27272a",
                    overflow: "hidden",
                    background: "rgba(255,255,255,0.01)",
                  }}
                >
                  {p.src ? (
                    <img
                      src={p.src}
                      style={{ width: "100%", height: "90px", objectFit: "cover", display: "flex" }}
                      alt={p.name}
                    />
                  ) : (
                    <div style={{ width: "100%", height: "90px", background: "#18181b", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ color: "#a855f7", fontSize: "20px" }}>✦</span>
                    </div>
                  )}
                  <div style={{ display: "flex", flexDirection: "column", padding: "10px", gap: "6px" }}>
                    <span style={{ color: "#e4e4e7", fontSize: "13px", fontWeight: 600, display: "flex" }}>{p.name}</span>
                    <span style={{ color: p.color, fontSize: "10px", letterSpacing: "1.5px", border: `1px solid ${p.color}`, padding: "1px 5px", display: "flex", alignSelf: "flex-start" }}>
                      {p.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "24px" }}>
          <div style={{ display: "flex", gap: "12px" }}>
            {["Base", "OpenClaw", "Claude"].map((tag) => (
              <div key={tag} style={{ color: "#3f3f46", fontSize: "12px", border: "1px solid #27272a", padding: "3px 8px", display: "flex" }}>
                {tag}
              </div>
            ))}
          </div>
          <div style={{ color: "#3f3f46", fontSize: "13px", display: "flex" }}>saimmy.com</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
