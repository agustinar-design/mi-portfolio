import { motion } from "framer-motion";
import { useState, useEffect } from "react";

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
              Lo que me<br /><span className="text-gradient">destaca</span>
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-3">Qué hago</h3>
                <ul className="space-y-2 text-muted-foreground font-body leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">—</span>
                    Diseño contenido visual para redes sociales
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">—</span>
                    Construyo identidad estética para marcas
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">—</span>
                    Organizo perfiles para que comuniquen mejor
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-3">Cómo trabajo</h3>
                <ul className="space-y-2 text-muted-foreground font-body leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">—</span>
                    Analizo el perfil actual
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">—</span>
                    Defino objetivos de contenido
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">—</span>
                    Diseño una estructura visual coherente
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">—</span>
                    Ajusto según métricas
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">—</span>
                    <span className="text-muted-foreground font-body leading-relaxed">
                      Trabajo con un <span className="text-primary font-medium">sistema propio</span> de <span className="text-primary font-medium">planificación</span> y <span className="text-primary font-medium">análisis de contenido</span>, que me permite <span className="text-primary font-medium">organizar publicaciones</span>, <span className="text-primary font-medium">medir rendimiento</span> y <span className="text-primary font-medium">optimizar</span> cada estrategia mes a mes.
                    </span>
                  </li>
                </ul>
              </div>

            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <div className="grid grid-cols-2 gap-6">
              {[
                { number: "5+", label: "Años de Experiencia" },
                { number: "∞", label: "Ideas Creativas" },
              ].map((stat) => (
                <div key={stat.label} className="text-center p-4 bg-card rounded-lg border border-border/50">
                  <p className="font-display text-2xl font-bold text-primary">{stat.number}</p>
                  <p className="text-muted-foreground text-xs mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            <MiniChart />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <blockquote className="font-display text-xl md:text-2xl text-muted-foreground italic leading-relaxed max-w-3xl mx-auto">
            "Si todas las marcas comunican igual, ninguna destaca. Mi trabajo es construir una presencia visual que se vea{" "}
            <span className="text-primary font-semibold not-italic">diferente</span>."
          </blockquote>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
