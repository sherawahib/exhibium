import { Hero } from "@/components/Hero";
import { ProofBar } from "@/components/ProofBar";
import { Statement } from "@/components/Statement";
import { Approach } from "@/components/Approach";
import { Engage } from "@/components/Engage";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ProofBar />
      <Approach />
      <Statement />
      <Engage />
    </>
  );
}
