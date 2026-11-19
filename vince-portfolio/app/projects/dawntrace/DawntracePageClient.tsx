"use client";

import { ProjectShell } from "@/components/projects/ProjectShell";
import { ProjectGallery } from "@/components/projects/ProjectGallery";
import { ProjectHeroScreen } from "@/components/projects/ProjectMediaView";
import { getProject } from "@/lib/data/projects";

const { media } = getProject("dawntrace");

export default function DawntracePageClient() {
  return (
    <ProjectShell slug="dawntrace" screen={<ProjectHeroScreen media={media} />} screenLabel={media.alt}>
      <ProjectGallery slug="dawntrace" />
    </ProjectShell>
  );
}
