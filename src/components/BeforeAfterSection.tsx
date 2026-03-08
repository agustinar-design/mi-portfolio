import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { X, ZoomIn, ChevronDown } from "lucide-react";

interface BeforeAfterImage {
  id: string;
  image_url: string;
  image_type: "before" | "after";
  display_order: number;
}

interface BeforeAfterItem {
  id: string;
  brand_name: string;
  description: string;
  display_order: number;
  images: BeforeAfterImage[];
}

const BeforeAfterSection = () => {
  const [items, setItems] = useState<BeforeAfterItem[]>([]);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleExpanded = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  useEffect(() => {
    const fetchItems = async () => {
      const { data: itemsData } = await supabase
        .from("before_after_items")
        .select("*")
        .order("display_order", { ascending: true });

      if (!itemsData) return;

      const { data: imagesData } = await supabase
        .from("before_after_images")
        .select("*")
        .order("display_order", { ascending: true });

      const images = (imagesData || []) as BeforeAfterImage[];

      const enriched: BeforeAfterItem[] = (itemsData as any[]).map((item) => ({
        id: item.id,
        brand_name: item.brand_name,
        description: item.description || "",
        display_order: item.display_order,
        images: images.filter((img: any) => img.item_id === item.id),
      }));

      setItems(enriched.filter((item) => item.images.length > 0));
    };
    fetchItems();
  }, []);

  if (items.length === 0) return null;

  return (
    <>
      <section id="before-after" className="py-32 px-6 md:px-12 relative">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-[120px]" />
        <div className="container relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <p className="text-primary font-display text-sm tracking-[0.3em] uppercase mb-4">
              Resultados
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Antes y Después
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl">
              El impacto de una estrategia visual y contenido bien trabajado.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-6">
            {items.map((item, i) => {
              const beforeImgs = item.images.filter((img) => img.image_type === "before");
              const afterImgs = item.images.filter((img) => img.image_type === "after");
              const isExpanded = expandedIds.has(item.id);

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden"
                >
                  {/* Clickable header */}
                  <button
                    onClick={() => toggleExpanded(item.id)}
                    className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left transition-colors duration-300 hover:bg-primary/5"
                  >
                    <div className="space-y-1">
                      <h3 className="font-display text-lg font-semibold text-primary">
                        {item.brand_name}
                      </h3>
                      {item.description && (
                        <p className="text-muted-foreground text-sm leading-relaxed max-w-2xl">
                          {item.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs font-display tracking-wider uppercase text-muted-foreground hidden sm:inline">
                        {isExpanded ? "Ocultar" : "Ver resultados"}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 text-primary transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
                      />
                    </div>
                  </button>

                  {/* Collapsible content */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 pt-2">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {beforeImgs.length > 0 && (
                              <div className="space-y-3">
                                <span className="font-display text-xs tracking-[0.2em] uppercase text-muted-foreground">
                                  Antes
                                </span>
                                <div className={`grid gap-3 ${beforeImgs.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}>
                                  {beforeImgs.map((img) => (
                                    <div
                                      key={img.id}
                                      onClick={() => setLightboxUrl(img.image_url)}
                                      className="group relative overflow-hidden rounded-xl border border-border/50 bg-card cursor-pointer transition-all duration-500 hover:border-primary/40 hover:shadow-[0_0_30px_hsl(263_70%_58%_/_0.15)]"
                                    >
                                      <img
                                        src={img.image_url}
                                        alt={`${item.brand_name} - Antes`}
                                        className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                                        loading="lazy"
                                      />
                                      <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-500 flex items-center justify-center">
                                        <ZoomIn className="w-6 h-6 text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg" />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {afterImgs.length > 0 && (
                              <div className="space-y-3">
                                <span className="font-display text-xs tracking-[0.2em] uppercase text-primary">
                                  Después
                                </span>
                                <div className={`grid gap-3 ${afterImgs.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}>
                                  {afterImgs.map((img) => (
                                    <div
                                      key={img.id}
                                      onClick={() => setLightboxUrl(img.image_url)}
                                      className="group relative overflow-hidden rounded-xl border border-primary/30 bg-card shadow-[0_0_20px_hsl(263_70%_58%_/_0.1)] cursor-pointer transition-all duration-500 hover:border-primary/50 hover:shadow-[0_0_30px_hsl(263_70%_58%_/_0.25)]"
                                    >
                                      <img
                                        src={img.image_url}
                                        alt={`${item.brand_name} - Después`}
                                        className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                                        loading="lazy"
                                      />
                                      <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-500 flex items-center justify-center">
                                        <ZoomIn className="w-6 h-6 text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg" />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm p-4 cursor-pointer"
            onClick={() => setLightboxUrl(null)}
          >
            <button
              onClick={() => setLightboxUrl(null)}
              className="absolute top-6 right-6 rounded-full p-2 bg-card border border-border/50 text-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              src={lightboxUrl}
              alt="Vista ampliada"
              className="max-w-[90vw] max-h-[90vh] object-contain rounded-xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default BeforeAfterSection;
