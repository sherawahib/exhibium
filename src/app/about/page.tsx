import type { Metadata } from "next";
import { PageBanner } from "@/components/PageBanner";
import { Founder } from "@/components/Founder";
import { Statement } from "@/components/Statement";
import { Engage } from "@/components/Engage";
import { pageImages } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Exhibium Group is led by Fernando Williams—founder, chief strategist, and pioneer of Emotional Commerce across the Americas and Middle East.",
};

export default function AboutPage() {
  return (
    <>
      <PageBanner
        kicker="Executive summary"
        title="About Exhibium"
        description="Branding, BIM modeling, Modular Construction, and enhanced ROI-based solutions—led by Fernando Williams for over 25 years."
        image={pageImages.about.src}
        imageAlt={pageImages.about.alt}
      />
      <Statement showMedia={false} />
      <Founder />
      <Engage compact image="/about.jpg" />
    </>
  );
}
