import { motion } from "framer-motion";

const MiniChart = () => {
  const bars = [40, 65, 50, 80, 60, 90, 70];

  return (
    <div className="flex items-end gap-1.5 h-20 mt-6 group cursor-pointer">
      {bars.map((h, i) => (
        <motion.div
          key={i}
          className="flex-1 rounded-sm bg-primary/80 transition-all duration-300 group-hover:shadow-[0_0_14px_hsl(263_70%_58%_/_0.6),0_0_30px_hsl(263_70%_58%_/_0.25)]"
          initial={{ height: 0, opacity: 0 }}
          whileInView={{ height: `${h}%`, opacity: 1 }}
          whileHover={{ height: `${Math.min(h + 20, 100)}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.15 + i * 0.08, ease: "easeOut" }}
          style={{
            boxShadow: "0 0 10px hsl(263 70% 58% / 0.4), 0 0 20px hsl(263 70% 58% / 0.15)",
          }}
        >
          <motion.div
            className="w-full h-full rounded-sm bg-primary/80"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
          />
        </motion.div>
      ))}
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
