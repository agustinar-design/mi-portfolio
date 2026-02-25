import { motion } from "framer-motion";

const skills = ["Edición de Video", "Paleta de Colores", "Composición Visual", "Ritmo Audiovisual", "Análisis de Métricas", "Producción en Canva"];

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
            <div className="space-y-5 text-muted-foreground leading-relaxed font-body">
              <p>
                Me especializo en la creación de contenido visual con identidad clara y coherente.
              </p>
              <p>
                Trabajo especialmente la paleta de colores, la composición y el ritmo audiovisual
                para que cada pieza mantenga continuidad con lo que la marca busca comunicar.
              </p>
              <p>
                Combino el enfoque creativo con análisis de rendimiento: evalúo métricas, comparo resultados
                entre publicaciones y ajusto decisiones en función del comportamiento real de la audiencia.
              </p>
              <p>
                Para ello utilizo las mismas estadísticas de las redes sociales (TikTok, META), Metricool, LookerStudio y Google Sheets.
              </p>
              <p>
                Todo el contenido es producido y organizado en Canva para mantener consistencia visual y eficiencia de trabajo.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <p className="text-primary font-display text-sm tracking-[0.3em] uppercase mb-4">Habilidades</p>
            <div className="flex flex-wrap gap-3 mt-8">
              {skills.map((skill, i) => (
                <motion.span
                  key={skill}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.2 + i * 0.05 }}
                  className="border border-border px-5 py-2.5 font-display text-sm text-foreground rounded-md transition-all duration-300 hover:border-primary hover:text-primary hover:shadow-[0_0_15px_hsl(263_70%_58%_/_0.2)] cursor-default"
                >
                  {skill}
                </motion.span>
              ))}
            </div>

            <div className="mt-12 grid grid-cols-2 gap-6">
              {[
                { number: "5+", label: "Años de Experiencia" },
                { number: "200+", label: "Proyectos Completados" },
                { number: "50+", label: "Clientes Satisfechos" },
                { number: "∞", label: "Ideas Creativas" },
              ].map((stat) => (
                <div key={stat.label} className="text-center p-4 bg-card rounded-lg border border-border/50">
                  <p className="font-display text-2xl font-bold text-primary">{stat.number}</p>
                  <p className="text-muted-foreground text-xs mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
