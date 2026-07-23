import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { X, ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";

interface LogoItem {
  id: string;
  title: string;
  description: string;
  image_url: string;
  display_order: number;
  images: string[];
}

const LogosSection = () => {
  const [items, setItems] = useState<LogoItem[]>([]);
  const [lightbox, setLightbox] = useState<{ images: string[]; index: number } | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      const { data: logos } = await supabase
        .from("logos")
        .select("*")
        .order("display_order", { ascending: true });
      const { data: imgs } = await supabase
        .from("logo_images")
        .select("*")
        .order("display_order", { ascending: true });
      if (logos) {
        const merged = (logos as any[]).map((l) => {
          const extra = ((imgs as any[]) || []).filter((i) => i.logo_id === l.id).map((i) => i.image_url);
          return { ...l, images: extra.length ? extra : [l.image_url] } as LogoItem;
        });
        setItems(merged);
      }
    };
    fetchItems();
  }, []);

  if (items.length === 0) return null;

  const closeLightbox = () => setLightbox(null);
  const nextImg = () => setLightbox((l) => l && { ...l, index: (l.index + 1) % l.images.length });
  const prevImg = () => setLightbox((l) => l && { ...l, index: (l.index - 1 + l.images.length) % l.images.length });

  return (
    <>
      <section id="logos" className="py-32 px-6 md:px-12 relative">
        <div className="absolute top-0 left-0 w-80 h-80 bg-primary/5 rounded-full blur-[120px]" />
        <div className="container relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <p className="text-primary font-display text-sm tracking-[0.3em] uppercase mb-4">
              Branding
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Logos
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Identidades de marcas.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden transition-all duration-500 hover:border-primary/50 hover:shadow-[0_0_30px_hsl(263_70%_58%_/_0.2)]"
              >
                <div
                  onClick={() => setLightbox({ images: item.images, index: 0 })}
                  className="relative aspect-square overflow-hidden bg-card cursor-pointer"
                >
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-full h-full object-contain p-4 transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-500 flex items-center justify-center">
                    <ZoomIn className="w-6 h-6 text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg" />
                  </div>
                  {item.images.length > 1 && (
                    <span className="absolute bottom-2 right-2 text-[10px] font-semibold bg-background/80 text-primary px-2 py-0.5 rounded-full backdrop-blur-sm">
                      +{item.images.length - 1}
                    </span>
                  )}
                </div>
                {item.images.length > 1 && (
                  <div className="flex gap-1 px-3 pt-3 overflow-x-auto">
                    {item.images.slice(1, 5).map((url, idx) => (
                      <button
                        key={idx}
                        onClick={() => setLightbox({ images: item.images, index: idx + 1 })}
                        className="shrink-0 w-12 h-12 rounded-md overflow-hidden border border-border/50 hover:border-primary transition-colors bg-card"
                      >
                        <img src={url} alt="" className="w-full h-full object-contain p-1" />
                      </button>
                    ))}
                    {item.images.length > 5 && (
                      <div className="shrink-0 w-12 h-12 rounded-md border border-border/50 flex items-center justify-center text-xs text-muted-foreground">
                        +{item.images.length - 5}
                      </div>
                    )}
                  </div>
                )}
                <div className="p-5 space-y-2 border-t border-border/50">
                  <h3 className="font-display text-lg font-semibold text-primary">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm p-4 cursor-pointer"
            onClick={closeLightbox}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 rounded-full p-2 bg-card border border-border/50 text-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
            {lightbox.images.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); prevImg(); }}
                  className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 rounded-full p-3 bg-card border border-border/50 text-foreground hover:bg-primary hover:text-primary-foreground transition-all"
                  aria-label="Anterior"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); nextImg(); }}
                  className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 rounded-full p-3 bg-card border border-border/50 text-foreground hover:bg-primary hover:text-primary-foreground transition-all"
                  aria-label="Siguiente"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <span className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs bg-card border border-border/50 px-3 py-1 rounded-full">
                  {lightbox.index + 1} / {lightbox.images.length}
                </span>
              </>
            )}
            <motion.img
              key={lightbox.index}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              src={lightbox.images[lightbox.index]}
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

export default LogosSection;