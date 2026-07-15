import { Hero } from "@/components/Hero";
import { BriefPillars } from "@/components/BriefPillars";
import { Statement } from "@/components/Statement";
import { Approach } from "@/components/Approach";
import { Engage } from "@/components/Engage";

export default function HomePage() {
  return (
    <>
      <Hero />
      <BriefPillars />
      <Statement />
      <Approach />
      <Engage />
    </>
  );
}
