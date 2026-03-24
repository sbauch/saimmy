import Image from "next/image";
import { Project, statusColor, statusLabel } from "@/data/projects";

export function ProjectCard({ project }: { project: Project }) {
  const href = project.links?.[0]?.href;
  const Wrapper = href ? "a" : "div";
  const wrapperProps = href
    ? { href, target: "_blank" as const, rel: "noopener noreferrer" }
    : {};

  return (
    <Wrapper {...wrapperProps} className="block border border-border-accent rounded-xl hover:border-accent-purple/60 transition-colors overflow-hidden cursor-pointer">
      {project.image && (
        <div className="relative w-full h-44 overflow-hidden bg-surface">
          <Image
            src={project.image}
            alt={project.name}
            fill
            className="object-cover object-center opacity-90 hover:opacity-100 transition-opacity"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      )}
      <div className="p-6 space-y-3">
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
              <span
                key={link.label}
                className="font-mono text-xs text-accent-purple"
              >
                [{link.label}]
              </span>
            ))}
          </div>
        )}
      </div>
    </Wrapper>
  );
}
