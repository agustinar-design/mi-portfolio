import { motion } from "framer-motion";
import heroBg from "@/assets/hero-bg.png";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBg}
          alt=""
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
      </div>

      <div className="container relative z-10 px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-primary font-display text-sm md:text-base tracking-[0.3em] uppercase mb-6">
            Designer & Developer
          </p>
        </motion.div>

        <motion.h1
          className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] tracking-tight mb-8"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          I craft digital
          <br />
          <span className="text-gradient">experiences</span> that
          <br />
          stand out.
        </motion.h1>

        <motion.p
          className="text-muted-foreground text-lg md:text-xl max-w-lg font-body leading-relaxed"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          Building beautiful, functional products at the intersection of design
          and technology.
        </motion.p>

        <motion.div
          className="mt-12 flex gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <a
            href="#projects"
            className="bg-primary text-primary-foreground px-8 py-3.5 font-display text-sm tracking-wide hover:opacity-90 transition-opacity rounded-sm"
          >
            View Work
          </a>
          <a
            href="#contact"
            className="border border-foreground/20 text-foreground px-8 py-3.5 font-display text-sm tracking-wide hover:border-primary hover:text-primary transition-colors rounded-sm"
          >
            Get in Touch
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      >
        <div className="w-5 h-8 border border-foreground/20 rounded-full flex items-start justify-center p-1.5">
          <div className="w-1 h-2 bg-primary rounded-full" />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
