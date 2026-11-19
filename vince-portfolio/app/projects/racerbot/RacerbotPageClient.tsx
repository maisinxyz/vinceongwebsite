"use client";

import { ProjectShell } from "@/components/projects/ProjectShell";
import { ProjectGallery } from "@/components/projects/ProjectGallery";
import { ProjectHeroScreen } from "@/components/projects/ProjectMediaView";
import { getProject } from "@/lib/data/projects";

const { media } = getProject("racerbot");

export default function RacerbotPageClient() {
  return (
    <ProjectShell slug="racerbot" screen={<ProjectHeroScreen media={media} />} screenLabel={media.alt}>
      <ProjectGallery slug="racerbot" />
    </ProjectShell>
  );
}
