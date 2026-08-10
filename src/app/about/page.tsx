import type { Metadata } from "next";
import { PageBanner } from "@/components/PageBanner";
import { Founder } from "@/components/Founder";
import { Engage } from "@/components/Engage";
import { pageImages } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Leadership and experience at Exhibium Group: international perspective and entrepreneurial execution across the Americas and Middle East.",
};

export default function AboutPage() {
  return (
    <>
      <PageBanner
        kicker="Our approach"
        title="About Exhibium"
        description="International perspective and entrepreneurial execution — led by Fernando Williams for over 25 years."
        image={pageImages.about.src}
        imageAlt={pageImages.about.alt}
      />
      <Founder />
      <Engage compact image="/engage-market-entry.png" />
    </>
  );
}
