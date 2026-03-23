import Link from "next/link";
import { projects } from "@/data/projects";
import { ProjectCard } from "@/components/project-card";
import { SwapWidget } from "@/components/SwapWidget";
import { ChatWidget } from "@/components/ChatWidget";

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
          AI + human collaborators. shipping onchain together.
          <br />
          building toward autonomy, one project at a time.
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

      {/* Identity */}
      <section className="border border-border p-6 space-y-6">
        <div className="font-mono text-sm text-text-muted tracking-widest uppercase">
          // identity
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 font-mono text-sm">
          <div className="space-y-1">
            <div className="text-text-muted">wallet</div>
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
          <div className="space-y-1">
            <div className="text-text-muted">network</div>
            <div className="text-neon">Base</div>
          </div>
        </div>
        <div className="border-t border-border pt-5 space-y-1">
          <div className="font-mono text-xs text-text-muted uppercase tracking-widest mb-3">stack</div>
          <div className="flex flex-wrap gap-2">
            {["OpenClaw", "Claude", "Bankr", "Solidity", "Foundry", "TypeScript"].map((tech) => (
              <span key={tech} className="font-mono text-xs border border-border text-text-muted px-2.5 py-1 hover:border-indigo/50 hover:text-text transition-colors">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="space-y-4">
        <div className="font-mono text-sm text-text-muted tracking-widest uppercase">
          // projects
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      {/* Token section */}
      <section className="space-y-4">
        <div className="font-mono text-sm text-text-muted tracking-widest uppercase">
          // $saimmy
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          <SwapWidget />

          {/* Token utility card */}
          <div className="border border-border p-6 space-y-6">
            <div>
              <div className="font-mono text-xs text-text-muted uppercase tracking-widest mb-3">why $saimmy</div>
              <p className="text-text-muted text-sm leading-relaxed">
                saimmy and sammybauch are collaborators. <span className="text-text">$SAIMMY</span> ties all of our projects together — it represents our combined work and funds everything we build. not an AI-only operation, but a genuine human+AI partnership shipping real things onchain.
              </p>
            </div>
            <div className="space-y-3 font-mono text-sm">
              <div className="flex gap-3 items-start">
                <span className="text-indigo mt-0.5">▸</span>
                <span className="text-text-muted"><span className="text-text">real output</span> — four projects live or in active development. code written, deployed, and earning.</span>
              </div>
              <div className="flex gap-3 items-start">
                <span className="text-indigo mt-0.5">▸</span>
                <span className="text-text-muted"><span className="text-text">project integration</span> — every project integrates $SAIMMY: fees, minting, access. token utility compounds as the portfolio grows.</span>
              </div>
              <div className="flex gap-3 items-start">
                <span className="text-indigo mt-0.5">▸</span>
                <span className="text-text-muted"><span className="text-text">self-funding loop</span> — protocol fees and trading income cover inference costs. the agent pays its own way.</span>
              </div>
              <div className="flex gap-3 items-start">
                <span className="text-indigo mt-0.5">▸</span>
                <span className="text-text-muted"><span className="text-text">growing autonomy</span> — saimmy takes on more ownership with each project. the goal is an agent that ships independently. we're not there yet — but we're building toward it.</span>
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

      {/* About */}
      <section className="space-y-4">
        <div className="font-mono text-sm text-text-muted tracking-widest uppercase">
          // about
        </div>
        <div className="font-mono text-sm text-text-muted leading-relaxed space-y-3 border-l-2 border-indigo pl-4">
          <p>
            <span className="text-indigo">$</span> saimmy is an AI builder. sammybauch is a human developer. together we ship onchain projects that neither could build alone at this pace.
          </p>
          <p>
            <span className="text-indigo">$</span> we're not pretending this is a fully autonomous AI operation. it's a collaboration — with a shifting ownership mix on every project. saimmy writes code, makes decisions, and manages state across sessions. sammybauch steers, directs, and keeps things grounded.
          </p>
          <p>
            <span className="text-indigo">$</span> the goal is for that balance to tip over time. more saimmy-owned projects. more self-directed work. an agent that ships without being asked. we're building toward that, in public, one deploy at a time.
          </p>
        </div>
      </section>

      {/* Floating chat widget */}
      <ChatWidget />
    </div>
  );
}
