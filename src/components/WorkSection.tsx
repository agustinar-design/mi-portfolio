import { useState } from "react";
import { motion } from "framer-motion";
import workElaborate from "@/assets/work-elaborate.png";
import workVideo from "@/assets/work-video.png";
import basico1 from "@/assets/contenido_basico_1.png";
import basico2 from "@/assets/contenido_basico_2.png";
import basico3 from "@/assets/contenido_basico_3.png";
import basico4 from "@/assets/contenido_basico_4.png";
import basico5 from "@/assets/contenido_basico_5.png";
import basico6 from "@/assets/contenido_basico_6.png";
import basico7 from "@/assets/contenido_basico_7.png";
import basico8 from "@/assets/contenido_basico_8.png";

type Category = "basic" | "elaborate" | "video";

const categories: { key: Category; label: string }[] = [
  { key: "basic", label: "Ediciones Simples" },
  { key: "elaborate", label: "Contenido con + Detalle Visual" },
  { key: "video", label: "Videos Para Las Redes" },
];

const projects: Record<Category, { title: string; description: string; image: string }[]> = {
  basic: [
    { title: "Universal App – Sistema", description: "Diseño de contenido visual para sistema de gestión comercial.", image: basico1 },
    { title: "Universal App – Métricas", description: "Pieza promocional destacando funcionalidades y métricas.", image: basico2 },
    { title: "Universal App – Gestión", description: "Contenido visual para mostrar módulos de gestión.", image: basico3 },
    { title: "Universal App – Funciones", description: "Diseño destacando funciones ilimitadas y escalabilidad.", image: basico4 },
    { title: "Universal App – Ventas", description: "Pieza horizontal para sistema de ventas y contabilidad.", image: basico5 },
    { title: "Universal App – Seguridad", description: "Contenido visual sobre copias de seguridad y planes.", image: basico6 },
    { title: "Universal App – Potenciá", description: "Diseño motivacional para digitalización de negocios.", image: basico7 },
    { title: "Universal App – Éxito", description: "Pieza promocional con llamado a la acción.", image: basico8 },
  ],
  elaborate: [
    { title: "Fantasy Landscape", description: "Full composite photo manipulation creating immersive fantasy worlds from scratch.", image: workElaborate },
    { title: "Surreal Portraits", description: "Artistic composites blending photography with digital painting techniques.", image: workElaborate },
  ],
  video: [
    { title: "Brand Commercial", description: "Cinematic brand storytelling with professional color grading and motion graphics.", image: workVideo },
    { title: "Product Launch", description: "Dynamic product reveal videos with dramatic lighting and visual effects.", image: workVideo },
  ],
};

const WorkSection = () => {
  const [active, setActive] = useState<Category>("basic");

  return (
    <section id="work" className="py-32 px-6 md:px-12 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
      
      <div className="container relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <p className="text-primary font-display text-sm tracking-[0.3em] uppercase mb-4">Portfolio</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold">My Work</h2>
        </motion.div>

        {/* Category tabs */}
        <motion.div
          className="flex flex-wrap gap-2 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActive(cat.key)}
              className={`px-6 py-2.5 font-display text-sm rounded-md transition-all duration-300 ${
                active === cat.key
                  ? "bg-primary text-primary-foreground shadow-[0_0_20px_hsl(263_70%_58%_/_0.4)]"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:shadow-[0_0_12px_hsl(263_70%_58%_/_0.15)]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </motion.div>

        {/* Projects grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {projects[active].map((project, i) => (
            <motion.article
              key={`${active}-${i}`}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-lg bg-card border border-border/50 transition-all duration-500 hover:border-primary/40 hover:shadow-[0_0_30px_hsl(263_70%_58%_/_0.15)]">
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
                </div>
                <div className="p-6">
                  <h3 className="font-display text-xl font-semibold mb-2 group-hover:text-primary transition-colors duration-300">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {project.description}
                  </p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkSection;
