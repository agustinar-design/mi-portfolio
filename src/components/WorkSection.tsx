import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { ChevronLeft, ChevronRight, X, ZoomIn, Eye } from "lucide-react";
import { staticPortfolioItems, categoryLabels, type Category } from "@/data/staticPortfolioItems";

const categories: { key: Category; label: string; subtitle: string }[] = [
  { key: "images", label: "Imágenes", subtitle: "contenido gráfico diseñado para comunicación comercial clara y directa." },
  { key: "video", label: "Videos", subtitle: "contenido audiovisual para historias y reels." },
];

interface GalleryItem {
  title: string;
  description: string;
  image?: string;
  video?: string;
  orderKey: string;
}

const WorkSection = () => {
  const [active, setActive] = useState<Category>("images");
  const [dbItems, setDbItems] = useState<GalleryItem[]>([]);
  const [hiddenKeys, setHiddenKeys] = useState<Set<string>>(new Set());
  const [orderMap, setOrderMap] = useState<Record<string, number>>({});
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const fetchHidden = async () => {
      const { data } = await supabase.from("hidden_static_items").select("item_key");
      if (data) setHiddenKeys(new Set(data.map((d: any) => d.item_key)));
    };
    const fetchOrders = async () => {
      const { data } = await supabase.from("static_item_orders").select("item_key, display_order");
      if (data) {
        const map: Record<string, number> = {};
        data.forEach((d: any) => { map[d.item_key] = d.display_order; });
        setOrderMap(map);
      }
    };
    fetchHidden();
    fetchOrders();
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
            orderKey: `db-${item.id}`,
            ...(item.file_type === "video" ? { video: item.file_url } : { image: item.file_url }),
          }))
        );
      }
    };
    fetchDbItems();
  }, [active]);

  const visibleStaticItems: GalleryItem[] = staticPortfolioItems[active]
    .filter((item) => !hiddenKeys.has(item.key))
    .map((item) => ({ ...item, orderKey: item.key }));

  const allItems = [...visibleStaticItems, ...dbItems].sort((a, b) => {
    const oa = orderMap[a.orderKey] ?? 9999;
    const ob = orderMap[b.orderKey] ?? 9999;
    return oa - ob;
  });

  const previewItems = allItems.slice(0, 6);
  const selected = allItems[selectedIndex];

  const navigate = (dir: -1 | 1) => {
    setSelectedIndex((prev) => (prev + dir + allItems.length) % allItems.length);
  };

  return (
    <>
      <section id="work" className="py-32 px-6 md:px-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-background" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
        <div className="container relative">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-12">
            <p className="text-primary font-display text-sm tracking-[0.3em] uppercase mb-4">Portfolio</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold">Mi Trabajo</h2>
          </motion.div>

          {/* Category tabs */}
          <motion.div className="flex flex-wrap gap-2 mb-6" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}>
            {categories.map((cat) => (
              <button key={cat.key} onClick={() => { setActive(cat.key); setSelectedIndex(0); }} className={`px-6 py-2.5 font-display text-sm rounded-md transition-all duration-300 ${active === cat.key ? "bg-primary text-primary-foreground shadow-[0_0_20px_hsl(263_70%_58%_/_0.4)]" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}>
                {cat.label}
              </button>
            ))}
          </motion.div>

          <motion.p key={active} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="font-bold text-sm text-muted-foreground mb-8 lowercase">
            {categories.find((c) => c.key === active)?.subtitle}
          </motion.p>

          {/* Compact thumbnail grid */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {previewItems.map((item, i) => (
              <motion.div
                key={item.orderKey}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                onClick={() => { setSelectedIndex(i); setGalleryOpen(true); }}
                className="group relative aspect-square overflow-hidden rounded-xl border border-border/50 bg-card cursor-pointer transition-all duration-500 hover:border-primary/40 hover:shadow-[0_0_20px_hsl(263_70%_58%_/_0.15)]"
              >
                {item.video ? (
                  <video src={item.video} className="w-full h-full object-cover" preload="metadata" muted />
                ) : (
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                )}
                <div className="absolute inset-0 bg-background/0 group-hover:bg-background/20 transition-colors duration-300 flex items-center justify-center">
                  <ZoomIn className="w-5 h-5 text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg" />
                </div>
              </motion.div>
            ))}
          </div>

          {/* "Ver galería completa" button */}
          {allItems.length > 6 && (
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-6 text-center">
              <button
                onClick={() => { setSelectedIndex(0); setGalleryOpen(true); }}
                className="inline-flex items-center gap-2 px-6 py-3 font-display text-sm rounded-lg bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 hover:border-primary/40 transition-all duration-300"
              >
                <Eye className="w-4 h-4" />
                Ver galería completa ({allItems.length} {active === "video" ? "videos" : "imágenes"})
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Full-screen gallery modal */}
      <AnimatePresence>
        {galleryOpen && selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md flex flex-col"
          >
            {/* Top bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border/30">
              <div className="min-w-0">
                <h3 className="font-display text-sm font-semibold truncate">{selected.title}</h3>
                <p className="text-muted-foreground text-xs truncate">{selected.description}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs text-muted-foreground font-display">{selectedIndex + 1} / {allItems.length}</span>
                <button
                  onClick={() => setGalleryOpen(false)}
                  className="rounded-full p-2 bg-card border border-border/50 text-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                  aria-label="Cerrar"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Main content */}
            <div className="flex-1 flex items-center justify-center relative px-4 py-4 overflow-hidden">
              {/* Prev */}
              <button
                onClick={() => navigate(-1)}
                className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-10 bg-card/90 border border-border/50 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                aria-label="Anterior"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedIndex}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.2 }}
                  className="max-w-full max-h-full flex items-center justify-center"
                >
                  {selected.video ? (
                    <video src={selected.video} controls className="max-w-[85vw] max-h-[75vh] object-contain rounded-xl" preload="metadata" />
                  ) : (
                    <img src={selected.image} alt={selected.title} className="max-w-[85vw] max-h-[75vh] object-contain rounded-xl shadow-2xl" />
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Next */}
              <button
                onClick={() => navigate(1)}
                className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-10 bg-card/90 border border-border/50 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                aria-label="Siguiente"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Bottom thumbnail strip */}
            <div className="border-t border-border/30 px-4 py-3">
              <div className="flex gap-2 overflow-x-auto justify-center" style={{ scrollbarWidth: "none" }}>
                {allItems.map((item, i) => (
                  <button
                    key={item.orderKey}
                    onClick={() => setSelectedIndex(i)}
                    className={`shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all duration-300 ${i === selectedIndex ? "border-primary shadow-[0_0_10px_hsl(263_70%_58%_/_0.4)]" : "border-transparent opacity-50 hover:opacity-80"}`}
                  >
                    {item.video ? (
                      <video src={item.video} className="w-full h-full object-cover" preload="metadata" muted />
                    ) : (
                      <img src={item.image} alt="" className="w-full h-full object-cover" loading="lazy" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default WorkSection;
