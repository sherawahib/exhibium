import type { Metadata } from "next";
import { PageBanner } from "@/components/PageBanner";
import { Atlas } from "@/components/Atlas";
import { Engage } from "@/components/Engage";
import { pageImages } from "@/lib/site";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Exhibium project atlas: selected retail and development work across the United States, Latin America, Middle East, and Europe.",
};

export default function ProjectsPage() {
  return (
    <>
      <PageBanner
        kicker="Exhibium Projects"
        title="Projects"
        description="Complete project roster from the brief: USA, Mexico, Central America, Caribbean, South America (Colombia, Venezuela, Ecuador, Peru, Bolivia, Chile), Middle East, and Russia."
        image={pageImages.projects.src}
        imageAlt={pageImages.projects.alt}
      />
      <Atlas />
      <Engage compact image="/projects.jpg" />
    </>
  );
}
