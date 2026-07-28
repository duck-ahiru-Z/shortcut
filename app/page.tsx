import HeroSection from "@/components/lp/HeroSection";
import FeaturesSection from "@/components/lp/FeaturesSection";
import NecessitySection from "@/components/lp/NecessitySection";
import FlowSection from "@/components/lp/FlowSection";
import CtaSection from "@/components/lp/CtaSection";

export default function LandingPage() {
  return (
    <main style={{ paddingBottom: "80px" }}>
      <HeroSection />
      <FeaturesSection />
      <NecessitySection />
      <FlowSection />
      <CtaSection />
    </main>
  );
}
