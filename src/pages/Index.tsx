import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import WorkSection from "@/components/WorkSection";
import LogosSection from "@/components/LogosSection";
import PapeleriaSection from "@/components/PapeleriaSection";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";

const Index = () => {
  return (
    <main className="bg-background text-foreground min-h-screen">
      <Navbar />
      <HeroSection />
      <WorkSection />
      <LogosSection />
      <PapeleriaSection />
      <AboutSection />
      <ContactSection />

    </main>
  );
};

export default Index;
