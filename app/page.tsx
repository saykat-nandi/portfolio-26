import Hero from "@/components/Hero";
import HeroExitStage from "@/components/HeroExitStage";
import ScrollManifesto from "@/components/ScrollManifesto";
import SelectedWorks from "@/components/SelectedWorks";
import { OrvanteTrust } from "@/components/orvante/Trust";
import ScrollTechStack from "@/components/ScrollTechStack";
import ScrollHardwareLab from "@/components/ScrollHardwareLab";
import { Footer } from "@/components/Footer";
import { About } from "@/components/sections/About";
import { Experience } from "@/components/sections/Experience";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <main className="relative overflow-x-clip bg-ink">
        {/*
          PERMANENT shutter pair — do not unwrap.
          Sticky scope ends when this wrapper ends, so the hero
          never see-throughs under later sections.
        */}
        <div className="relative">
          <HeroExitStage>
            <Hero />
          </HeroExitStage>

          {/* Section 2: Engineering Philosophy */}
          <ScrollManifesto />
        </div>

        {/* Section 3: Selected Works (#work) — sticky split-screen */}
        <SelectedWorks />

        {/* Section 4: Panoramic engineering bento (#stack) — after case studies */}
        <OrvanteTrust />

        <About />
        <ScrollTechStack />
        <Experience />
        <ScrollHardwareLab />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
