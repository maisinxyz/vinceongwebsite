"use client";

import { ProjectShell } from "@/components/projects/ProjectShell";
import { ProjectGallery } from "@/components/projects/ProjectGallery";
import { ProjectHeroScreen } from "@/components/projects/ProjectMediaView";
import { getProject } from "@/lib/data/projects";

const { media } = getProject("agv");

export default function AgvPageClient() {
  return (
    <ProjectShell slug="agv" screen={<ProjectHeroScreen media={media} />} screenLabel={media.alt}>
      <ProjectGallery slug="agv" />
    </ProjectShell>
  );
}
