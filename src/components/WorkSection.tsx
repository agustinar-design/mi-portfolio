import { useState } from "react";
import { motion } from "framer-motion";
import basico1 from "@/assets/contenido_basico_1.png";
import basico2 from "@/assets/contenido_basico_2.png";
import basico3 from "@/assets/contenido_basico_3.png";
import basico4 from "@/assets/contenido_basico_4.png";
import basico5 from "@/assets/contenido_basico_5.png";
import basico6 from "@/assets/contenido_basico_6.png";
import basico7 from "@/assets/contenido_basico_7.png";
import basico8 from "@/assets/contenido_basico_8.png";
import visual1 from "@/assets/contenido_visual_1.png";
import visual2 from "@/assets/contenido_visual_2.png";
import visual3 from "@/assets/contenido_visual_3.png";
import visual4 from "@/assets/contenido_visual_4.png";
import visual5 from "@/assets/contenido_visual_5.png";
import visual6 from "@/assets/contenido_visual_6.png";
import visual7 from "@/assets/contenido_visual_7.png";
import visual8 from "@/assets/contenido_visual_8.png";
import video1 from "@/assets/video_1.mp4";
import video2 from "@/assets/video_2.mp4";
import video4 from "@/assets/video_4.mp4";
import video6 from "@/assets/video_6.mp4";
import video8 from "@/assets/video_8.mp4";
import video20 from "@/assets/video_20.mp4";

type Category = "basic" | "elaborate" | "video";

const categories: { key: Category; label: string }[] = [
  { key: "basic", label: "Ediciones Simples" },
  { key: "elaborate", label: "Contenido con + Detalle Visual" },
  { key: "video", label: "Videos Para Las Redes" },
];

const projects: Record<Category, { title: string; description: string; image?: string; video?: string }[]> = {
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
    { title: "Universal App – Asesoría y Ventas", description: "Diseño visual con identidad de marca y datos de contacto.", image: visual1 },
    { title: "Universal App – Página Web", description: "Contenido promocional para negocio organizado con web propia.", image: visual2 },
    { title: "Universal App – Agradecimiento", description: "Pieza circular de agradecimiento con branding de marca.", image: visual3 },
    { title: "Universal App – Cierre de Año", description: "Contenido estacional con calendario y llamado a la acción.", image: visual4 },
    { title: "Universal App – Digitalización", description: "Diseño comparativo papel vs sistema digital.", image: visual5 },
    { title: "Universal App – Gestión Multirubro", description: "Pieza con precios y demo del sistema de gestión.", image: visual6 },
    { title: "Universal App – Planes y Precios", description: "Contenido con opciones de planes mensual, anual y pago único.", image: visual7 },
    { title: "Universal App – Métricas Detalle", description: "Diseño mostrando métricas y funcionalidades del sistema.", image: visual8 },
  ],
  video: [
    { title: "Universal App – Reel Promocional", description: "Video corto promocional para redes sociales.", video: video1 },
    { title: "Universal App – Contenido Dinámico", description: "Video dinámico con animaciones y efectos visuales.", video: video2 },
    { title: "Universal App – Spot Comercial", description: "Video comercial con edición profesional.", video: video4 },
    { title: "Universal App – Campaña Digital", description: "Producción audiovisual para campaña en redes.", video: video6 },
    { title: "Universal App – Motion Graphics", description: "Video con motion graphics y branding.", video: video8 },
    { title: "Universal App – Presentación Visual", description: "Video de presentación con efectos visuales.", video: video20 },
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
          <h2 className="font-display text-4xl md:text-5xl font-bold">Mi Trabajo</h2>
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
                <div className={`${project.video ? 'aspect-video' : 'aspect-[16/10]'} overflow-hidden`}>
                  {project.video ? (
                    <video
                      src={project.video}
                      controls
                      className="w-full h-full object-cover"
                      preload="metadata"
                    />
                  ) : (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60 pointer-events-none" />
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
