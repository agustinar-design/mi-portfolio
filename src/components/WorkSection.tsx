import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { staticPortfolioItems, categoryLabels, type Category } from "@/data/staticPortfolioItems";
import portfolioBg from "@/assets/portfolio-bg.jpg";

const categories: { key: Category; label: string; subtitle: string }[] = [
  { key: "images", label: "Imágenes", subtitle: "contenido gráfico diseñado para comunicación comercial clara y directa." },
  { key: "video", label: "Videos", subtitle: "contenido audiovisual para historias y reels." },
];

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
            <video src={project.video} controls className="max-w-full max-h-[80vh] object-contain rounded-lg" preload="metadata" />
          ) : (
            <img src={project.image} alt={project.title} className="w-auto max-w-full max-h-[80vh] object-contain rounded-lg transition-transform duration-700 group-hover:scale-[1.02]" loading="lazy" />
          )}
        </div>
        <div className="p-5">
          <h3 className="font-display text-lg font-semibold mb-1 group-hover:text-primary transition-colors duration-300">{project.title}</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">{project.description}</p>
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
      <button onClick={() => scroll("left")} className="absolute -left-4 md:left-0 top-1/2 -translate-y-1/2 z-10 bg-card/90 border border-border/50 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-primary hover:text-primary-foreground transition-all duration-300" aria-label="Anterior">
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button onClick={() => scroll("right")} className="absolute -right-4 md:right-0 top-1/2 -translate-y-1/2 z-10 bg-card/90 border border-border/50 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-primary hover:text-primary-foreground transition-all duration-300" aria-label="Siguiente">
        <ChevronRight className="w-5 h-5" />
      </button>
      <div ref={scrollRef} className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth px-8 pb-4 -mx-2 scrollbar-hide" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
        {items.map((project, i) => (
          <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.4, delay: i * 0.05 }} className="snap-center shrink-0 w-[280px] md:w-[320px] group">
            <div className="relative overflow-hidden rounded-xl bg-card border border-border/50 transition-all duration-500 hover:border-primary/40 hover:shadow-[0_0_30px_hsl(263_70%_58%_/_0.15)]">
              <div className="flex items-center justify-center bg-black/30 p-3">
                {project.video ? (
                  <video src={project.video} controls className="w-full aspect-[9/16] object-contain rounded-lg" preload="metadata" />
                ) : (
                  <img src={project.image} alt={project.title} className="w-full aspect-[9/16] object-contain rounded-lg transition-transform duration-700 group-hover:scale-[1.02]" loading="lazy" />
                )}
              </div>
              <div className="p-4">
                <h3 className="font-display text-sm font-semibold mb-1 group-hover:text-primary transition-colors duration-300">{project.title}</h3>
                <p className="text-muted-foreground text-xs leading-relaxed">{project.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const WorkSection = () => {
  const [active, setActive] = useState<Category>("images");
  const [viewMode, setViewMode] = useState<"carousel" | "scroll">("carousel");
  const [dbItems, setDbItems] = useState<{ title: string; description: string; image?: string; video?: string }[]>([]);
  const [hiddenKeys, setHiddenKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchHidden = async () => {
      const { data } = await supabase.from("hidden_static_items").select("item_key");
      if (data) setHiddenKeys(new Set(data.map((d: any) => d.item_key)));
    };
    fetchHidden();
  }, []);

  useEffect(() => {
    const fetchDbItems = async () => {
      const { data } = await supabase
        .from("portfolio_items")
        .select("*")
        .eq("category", active)
        .order("display_order", { ascending: true });
      if (data) {
        setDbItems(
          data.map((item: any) => ({
            title: item.title,
            description: item.description,
            ...(item.file_type === "video" ? { video: item.file_url } : { image: item.file_url }),
          }))
        );
      }
    };
    fetchDbItems();
  }, [active]);

  const visibleStaticItems = staticPortfolioItems[active].filter((item) => !hiddenKeys.has(item.key));
  const allItems = [...visibleStaticItems, ...dbItems];

  return (
    <section id="work" className="py-32 px-6 md:px-12 relative overflow-hidden">
      {/* Background Image with Dark Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${portfolioBg})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/85 to-background/95" />
      <div className="absolute inset-0 bg-background/60" />
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
      <div className="container relative">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-12">
          <p className="text-primary font-display text-sm tracking-[0.3em] uppercase mb-4">Portfolio</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold">Mi Trabajo</h2>
        </motion.div>

        <motion.div className="flex flex-wrap gap-2 mb-8" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}>
          {categories.map((cat) => (
            <button key={cat.key} onClick={() => setActive(cat.key)} className={`px-6 py-2.5 font-display text-sm rounded-md transition-all duration-300 ${active === cat.key ? "bg-primary text-primary-foreground shadow-[0_0_20px_hsl(263_70%_58%_/_0.4)]" : "bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:shadow-[0_0_12px_hsl(263_70%_58%_/_0.15)]"}`}>
              {cat.label}
            </button>
          ))}
        </motion.div>

        <motion.p key={active} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="font-bold text-sm text-muted-foreground mb-8 lowercase">
          {categories.find((c) => c.key === active)?.subtitle}
        </motion.p>

        <div className="flex gap-2 mb-8">
          <button onClick={() => setViewMode("carousel")} className={`px-4 py-1.5 text-xs font-display rounded-md transition-all duration-300 ${viewMode === "carousel" ? "bg-primary/20 text-primary border border-primary/30" : "bg-secondary/50 text-muted-foreground hover:text-foreground"}`}>Deslizar</button>
          <button onClick={() => setViewMode("scroll")} className={`px-4 py-1.5 text-xs font-display rounded-md transition-all duration-300 ${viewMode === "scroll" ? "bg-primary/20 text-primary border border-primary/30" : "bg-secondary/50 text-muted-foreground hover:text-foreground"}`}>Ver todo</button>
        </div>

        {viewMode === "carousel" ? (
          <HorizontalCarousel items={allItems} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allItems.map((project, i) => (
              <ScrollCard key={`${active}-${i}`} project={project} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default WorkSection;
