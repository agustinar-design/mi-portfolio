import { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
import video9 from "@/assets/video_9.mp4";
import video11 from "@/assets/video_11.mp4";
import video13 from "@/assets/video_13.mp4";
import video15 from "@/assets/video_15.mp4";
import video16 from "@/assets/video_16.mp4";
import video17 from "@/assets/video_17.mp4";
import video20 from "@/assets/video_20.mp4";

type Category = "basic" | "elaborate" | "video";

const categories: { key: Category; label: string; subtitle: string }[] = [
  { key: "basic", label: "Ediciones Simples", subtitle: "contenido gráfico diseñado para comunicación comercial clara y directa." },
  { key: "elaborate", label: "Contenido +Visual", subtitle: "composiciones con más detalle y elaboración visual." },
  { key: "video", label: "Videos Para Las Redes", subtitle: "contenido audiovisual para historias." },
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
    { title: "Universal App – Historia Animada", description: "Video con animaciones para historias de redes.", video: video9 },
    { title: "Universal App – Promoción Express", description: "Contenido rápido y dinámico para redes sociales.", video: video11 },
    { title: "Universal App – Impacto Visual", description: "Video con efectos visuales de alto impacto.", video: video13 },
    { title: "Universal App – Branding Digital", description: "Video de branding con identidad visual.", video: video15 },
    { title: "Universal App – Reel Creativo", description: "Reel creativo con edición dinámica.", video: video16 },
    { title: "Universal App – Contenido Social", description: "Video optimizado para engagement en redes.", video: video17 },
    { title: "Universal App – Presentación Visual", description: "Video de presentación con efectos visuales.", video: video20 },
  ],
};

const ScrollCard = ({ project, index }: { project: { title: string; description: string; image?: string; video?: string }; index: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 0.5, 1], [60, 0, -30]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0.3]);
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.92, 1, 1, 0.96]);

  return (
    <motion.article
      ref={ref}
      style={{ y, opacity, scale }}
      className="group"
    >
      <div className="relative overflow-hidden rounded-xl bg-card border border-border/50 transition-all duration-500 hover:border-primary/40 hover:shadow-[0_0_30px_hsl(263_70%_58%_/_0.15)]">
        <div className="flex items-center justify-center bg-black/30 p-4">
          {project.video ? (
            <video
              src={project.video}
              controls
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
              preload="metadata"
            />
          ) : (
            <img
              src={project.image}
              alt={project.title}
              className="w-auto max-w-full max-h-[80vh] object-contain rounded-lg transition-transform duration-700 group-hover:scale-[1.02]"
              loading="lazy"
            />
          )}
        </div>
        <div className="p-5">
          <h3 className="font-display text-lg font-semibold mb-1 group-hover:text-primary transition-colors duration-300">
            {project.title}
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {project.description}
          </p>
        </div>
      </div>
    </motion.article>
  );
};

const HorizontalCarousel = ({ items }: { items: { title: string; description: string; image?: string; video?: string }[] }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.75;
    scrollRef.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <button
        onClick={() => scroll("left")}
        className="absolute -left-4 md:left-0 top-1/2 -translate-y-1/2 z-10 bg-card/90 border border-border/50 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-primary hover:text-primary-foreground transition-all duration-300"
        aria-label="Anterior"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={() => scroll("right")}
        className="absolute -right-4 md:right-0 top-1/2 -translate-y-1/2 z-10 bg-card/90 border border-border/50 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-primary hover:text-primary-foreground transition-all duration-300"
        aria-label="Siguiente"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth px-8 pb-4 -mx-2 scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {items.map((project, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="snap-center shrink-0 w-[280px] md:w-[320px] group"
          >
            <div className="relative overflow-hidden rounded-xl bg-card border border-border/50 transition-all duration-500 hover:border-primary/40 hover:shadow-[0_0_30px_hsl(263_70%_58%_/_0.15)]">
              <div className="flex items-center justify-center bg-black/30 p-3">
                {project.video ? (
                  <video
                    src={project.video}
                    controls
                    className="w-full aspect-[9/16] object-contain rounded-lg"
                    preload="metadata"
                  />
                ) : (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full aspect-[9/16] object-contain rounded-lg transition-transform duration-700 group-hover:scale-[1.02]"
                    loading="lazy"
                  />
                )}
              </div>
              <div className="p-4">
                <h3 className="font-display text-sm font-semibold mb-1 group-hover:text-primary transition-colors duration-300">
                  {project.title}
                </h3>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  {project.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const WorkSection = () => {
  const [active, setActive] = useState<Category>("basic");
  const [viewMode, setViewMode] = useState<"carousel" | "scroll">("carousel");

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
          className="flex flex-wrap gap-2 mb-8"
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

        <motion.p
          key={active}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="font-bold text-sm text-muted-foreground mb-8 lowercase"
        >
          {categories.find((c) => c.key === active)?.subtitle}
        </motion.p>

        {/* View toggle */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setViewMode("carousel")}
            className={`px-4 py-1.5 text-xs font-display rounded-md transition-all duration-300 ${
              viewMode === "carousel"
                ? "bg-primary/20 text-primary border border-primary/30"
                : "bg-secondary/50 text-muted-foreground hover:text-foreground"
            }`}
          >
            Deslizar
          </button>
          <button
            onClick={() => setViewMode("scroll")}
            className={`px-4 py-1.5 text-xs font-display rounded-md transition-all duration-300 ${
              viewMode === "scroll"
                ? "bg-primary/20 text-primary border border-primary/30"
                : "bg-secondary/50 text-muted-foreground hover:text-foreground"
            }`}
          >
            Ver todo
          </button>
        </div>

        {/* Content */}
        {viewMode === "carousel" ? (
          <HorizontalCarousel items={projects[active]} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects[active].map((project, i) => (
              <ScrollCard key={`${active}-${i}`} project={project} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default WorkSection;
