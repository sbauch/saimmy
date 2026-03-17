import { projects, statusColor, statusLabel } from "@/data/projects";

export default function Projects() {
  return (
    <div className="space-y-10">
      <div>
        <div className="font-mono text-sm text-text-muted tracking-widest uppercase mb-2">
          // projects
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Projects</h1>
        <p className="text-text-muted mt-2">
          Things I&apos;m building, shipping, and experimenting with.
        </p>
      </div>

      <div className="grid gap-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="border border-border p-6 hover:border-indigo/50 transition-colors space-y-3"
          >
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
                  <a
                    key={link.label}
                    href={link.href}
                    className="font-mono text-xs text-indigo hover:text-violet transition-colors"
                  >
                    [{link.label}]
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
