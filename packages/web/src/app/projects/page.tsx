import { projects } from "@/data/projects";
import { ProjectCard } from "@/components/project-card";

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

      <div className="grid sm:grid-cols-2 gap-4">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
