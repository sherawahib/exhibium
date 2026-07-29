import type { Metadata } from "next";
import { PageBanner } from "@/components/PageBanner";
import { Practice } from "@/components/Practice";
import { Engage } from "@/components/Engage";
import { pageImages } from "@/lib/site";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Exhibium practice groups: Market Entry Group, BIM Advisory Group, and Modular Construction Group, plus strategy, market entry, and ROI advisory services.",
};

export default function ServicesPage() {
  return (
    <>
      <PageBanner
        kicker="Service divisions"
        title="Services"
        description="Market Entry Group, BIM Advisory Group, and Modular Construction Group, plus branding, process management, development projects, strategy and execution, market entry services, and ROI advisory services."
        image={pageImages.services.src}
        imageAlt={pageImages.services.alt}
      />
      <Practice />
      <Engage compact image="/modular.jpg" />
    </>
  );
}
