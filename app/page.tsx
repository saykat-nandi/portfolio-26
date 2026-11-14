import Hero from "@/components/Hero";
import HeroExitStage from "@/components/HeroExitStage";
import ScrollManifesto from "@/components/ScrollManifesto";
import ScrollShippedSystems from "@/components/ScrollShippedSystems";
import ScrollTechStack from "@/components/ScrollTechStack";
import ScrollHardwareLab from "@/components/ScrollHardwareLab";
import { OrvanteTrust } from "@/components/orvante/Trust";
import { Footer } from "@/components/Footer";
import { About } from "@/components/sections/About";
import { Experience } from "@/components/sections/Experience";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <main className="relative bg-[#0B0B0D]">
        {/* Sticky Receding Hero Stage */}
        <HeroExitStage>
          <Hero />
        </HeroExitStage>

        {/* Section 2: Rising Obsidian Shutter + Pinned Manifesto */}
        <ScrollManifesto />

        <OrvanteTrust />
        <About />
        <ScrollShippedSystems />
        <ScrollTechStack />
        <Experience />
        <ScrollHardwareLab />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
