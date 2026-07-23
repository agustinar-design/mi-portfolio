import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import WorkSection from "@/components/WorkSection";
import BeforeAfterSection from "@/components/BeforeAfterSection";
import LogosSection from "@/components/LogosSection";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";

const Index = () => {
  return (
    <main className="bg-background text-foreground min-h-screen">
      <Navbar />
      <HeroSection />
      <WorkSection />
      <BeforeAfterSection />
      <LogosSection />
      <AboutSection />
      <ContactSection />
    </main>
  );
};

export default Index;
