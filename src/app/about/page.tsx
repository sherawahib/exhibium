import type { Metadata } from "next";
import { PageBanner } from "@/components/PageBanner";
import { Founder } from "@/components/Founder";
import { Engage } from "@/components/Engage";

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
        image="/about-banner-v2.png"
        imageAlt="Executive team in silhouette around a boardroom table against a city skyline"
      />
      <Founder />
      <Engage compact image="/projects.jpg" />
    </>
  );
}
