import { motion } from "framer-motion";
import fotoMia from "@/assets/foto-mia-3.jpeg.asset.json";

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

          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
