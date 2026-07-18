import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import fotoMia from "@/assets/foto-mia-3.jpeg.asset.json";

const MiniChart = () => {
  const baseBars = [40, 65, 50, 80, 60, 90, 70, 55, 75, 85];
  const [bars, setBars] = useState(baseBars);

  useEffect(() => {
    const interval = setInterval(() => {
      setBars((prev) =>
        prev.map((v, i) => {
          const delta = (Math.random() - 0.4) * 25;
          return Math.max(20, Math.min(100, baseBars[i] + delta));
        })
      );
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative mt-6 p-4 rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm">
      {/* Decorative line grid */}
      <div className="absolute inset-4 flex flex-col justify-between pointer-events-none">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="w-full h-px bg-border/20" />
        ))}
      </div>

      {/* Bars */}
      <div className="flex items-end gap-1 h-28 relative">
        {bars.map((h, i) => (
          <motion.div
            key={i}
            className="flex-1 rounded-t-sm relative overflow-hidden cursor-pointer"
            initial={{ height: 0, opacity: 0 }}
            whileInView={{ height: `${h}%`, opacity: 1 }}
            animate={{ height: `${h}%` }}
            whileHover={{ height: `${Math.min(h + 15, 100)}%`, filter: "brightness(1.3)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Gradient bar */}
            <div className="absolute inset-0 rounded-t-sm bg-gradient-to-t from-primary/90 via-primary/70 to-primary/40" />
            {/* Glow pulse */}
            <motion.div
              className="absolute inset-0 rounded-t-sm bg-gradient-to-t from-primary to-transparent"
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
            />
            {/* Top shine */}
            <motion.div
              className="absolute top-0 left-0 right-0 h-1 bg-primary-foreground/30 rounded-t-sm"
              animate={{ opacity: [0.2, 0.6, 0.2] }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 0.2 }}
            />
          </motion.div>
        ))}
      </div>

      {/* Bottom label */}
      <div className="flex items-center justify-between mt-3">
        <span className="text-[10px] font-display tracking-wider uppercase text-muted-foreground/60">Rendimiento</span>
        <motion.div
          className="flex items-center gap-1.5"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
          <span className="text-[10px] font-display text-muted-foreground/60">En vivo</span>
        </motion.div>
      </div>
    </div>
  );
};

const AboutSection = () => {
  return (
    <section id="about" className="py-32 px-6 md:px-12 border-t border-border/50 relative">
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-accent/5 rounded-full blur-[100px]" />

      <div className="container relative">
        <div className="grid md:grid-cols-2 gap-16 md:gap-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-primary font-display text-sm tracking-[0.3em] uppercase mb-4">Sobre Mí</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-8">
              Sobre <span className="text-gradient">Mí</span>
            </h2>

            <div className="space-y-8">
              <div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-3">
                  <span className="text-primary">Qué hago</span>
                </h3>
                <p className="text-muted-foreground font-body leading-relaxed">
                  Diseño <span className="text-primary font-medium">piezas gráficas de alto impacto</span> (flyers, pósters, cartelería). Construyo la <span className="text-primary font-medium">identidad visual</span> y el <span className="text-primary font-medium">branding</span> para marcas y emprendimientos. Desarrollo assets visuales listos para aplicar en cualquier formato.
                </p>
              </div>

              <div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-3">
                  <span className="text-primary">Cómo trabajo</span>
                </h3>
                <p className="text-muted-foreground font-body leading-relaxed">
                  Defino el <span className="text-primary font-medium">concepto visual</span> y la <span className="text-primary font-medium">paleta de colores</span> de la marca. Diseño las piezas gráficas con un enfoque <span className="text-primary font-medium">limpio, moderno y funcional</span>. Entrego materiales optimizados y listos para usar en redes, web o impresión. Trabajo con un <span className="text-primary font-medium">sistema ágil y ordenado</span>, asegurando que cada entrega mantenga una <span className="text-primary font-medium">coherencia estética impecable</span> de punta a punta.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="flex flex-col items-center justify-center"
          >
            {/* Floating profile photo */}
            <motion.div
              className="relative w-48 h-48 md:w-56 md:h-56 mb-8"
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              {/* Glow ring */}
              <div className="absolute inset-0 rounded-full bg-primary/30 blur-xl" />
              <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-primary/60 via-primary/20 to-transparent" />
              
              {/* Circle image */}
              <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-primary/40 shadow-[0_0_30px_hsl(263_70%_58%_/_0.25)]">
                <img
                  src={fotoMia.url}
                  alt="Agustina Bernal"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>

            <MiniChart />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
