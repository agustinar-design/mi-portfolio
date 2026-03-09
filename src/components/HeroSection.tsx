import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import portfolioBg from "@/assets/portfolio-bg.jpg";

const phrases = ["Tu visión", "Tu marca", "Tu historia"];

const HeroSection = () => {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = phrases[phraseIndex];
    const speed = isDeleting ? 60 : 100;

    if (!isDeleting && displayed === current) {
      const timeout = setTimeout(() => setIsDeleting(true), 1800);
      return () => clearTimeout(timeout);
    }

    if (isDeleting && displayed === "") {
      setIsDeleting(false);
      setPhraseIndex((prev) => (prev + 1) % phrases.length);
      return;
    }

    const timeout = setTimeout(() => {
      setDisplayed(
        isDeleting ? current.slice(0, displayed.length - 1) : current.slice(0, displayed.length + 1)
      );
    }, speed);

    return () => clearTimeout(timeout);
  }, [displayed, isDeleting, phraseIndex]);

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${portfolioBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/80 to-background" />
        <div className="absolute inset-0 bg-background/40" />
      </div>

      {/* Floating orbs */}
      <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-primary/10 rounded-full blur-[100px] animate-float" />
      <div className="absolute bottom-1/3 left-1/5 w-48 h-48 bg-accent/10 rounded-full blur-[80px] animate-float" style={{ animationDelay: "2s" }} />

      <div className="container relative z-10 px-6 md:px-12">
        <motion.p
          className="text-primary font-display text-sm md:text-base tracking-[0.3em] uppercase mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
          SOCIAL MEDIA CREATIVA
        </motion.p>

        <motion.h1
          className="font-display text-5xl md:text-7xl lg:text-[5.5rem] font-bold leading-[0.95] tracking-tight mb-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}>
          <span className="text-foreground">{displayed}</span>
          <span className="animate-pulse text-foreground">|</span>
          <br />
          <span className="text-primary">hecha realidad</span>
          <span className="text-primary text-6xl md:text-8xl lg:text-[6.5rem]">.</span>
        </motion.h1>

        <motion.p
          className="text-muted-foreground text-lg md:text-xl max-w-lg font-body leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}>
          Ideas, contenido y edición para marcas que quieren destacar en redes.
        </motion.p>

        <motion.div
          className="mt-12 flex flex-wrap gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.45 }}>
          <a
            href="#work"
            className="bg-primary text-primary-foreground px-8 py-3.5 font-display text-sm tracking-wide rounded-md transition-all duration-300 hover:shadow-[0_0_25px_hsl(263_70%_58%_/_0.5)]">
            Explorar Mi Trabajo
          </a>
          <a
            href="#contact"
            className="border border-primary/30 text-foreground px-8 py-3.5 font-display text-sm tracking-wide rounded-md transition-all duration-300 hover:border-primary hover:text-primary hover:shadow-[0_0_15px_hsl(263_70%_58%_/_0.2)]">
            Contáctame
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}>
        <div className="w-5 h-9 border border-primary/30 rounded-full flex items-start justify-center p-1.5">
          <div className="w-1 h-2.5 bg-primary rounded-full" />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
