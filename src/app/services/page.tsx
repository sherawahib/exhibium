import type { Metadata } from "next";
import { PageBanner } from "@/components/PageBanner";
import { Practice } from "@/components/Practice";
import { Engage } from "@/components/Engage";
import { pageImages } from "@/lib/site";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Exhibium practice groups: Market Entry Strategy, BIM Management, and Modular Development—plus strategy, market entry, and ROI advisory.",
};

export default function ServicesPage() {
  return (
    <>
      <PageBanner
        kicker="Service divisions"
        title="Services"
        description="Market Entry Strategy · BIM Management Group · Modular Development Group — plus Branding, Process Management, Development Projects, Strategy and Execution, Market Entry Services, and ROI Advisory Services."
        image={pageImages.services.src}
        imageAlt={pageImages.services.alt}
      />
      <Practice />
      <Engage compact image="/modular.jpg" />
    </>
  );
}
