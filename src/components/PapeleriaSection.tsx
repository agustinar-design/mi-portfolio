import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { X, ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";

interface PapeleriaItem {
  id: string;
  title: string;
  description: string;
  piece_type: string;
  image_url: string;
  display_order: number;
}

export const pieceTypeLabels: Record<string, string> = {
  tarjetas: "Tarjetas corporativas",
  firma: "Firma de correo",
  membrete: "Membrete A4",
  packaging: "Packaging",
  otros: "Otros",
};

const PapeleriaSection = () => {
  const [items, setItems] = useState<PapeleriaItem[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      const { data } = await supabase
        .from("papeleria_items")
        .select("*")
        .order("display_order", { ascending: true });
      if (data) setItems(data as PapeleriaItem[]);
    };
    fetchItems();
  }, []);

  if (items.length === 0) return null;

  const close = () => setLightboxIndex(null);
  const next = () => setLightboxIndex((i) => (i === null ? i : (i + 1) % items.length));
  const prev = () => setLightboxIndex((i) => (i === null ? i : (i - 1 + items.length) % items.length));

  return (
    <>
      <section id="papeleria" className="py-32 px-6 md:px-12 relative">
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-[120px]" />
        <div className="container relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <p className="text-primary font-display text-sm tracking-[0.3em] uppercase mb-4">
              Identidad aplicada
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">Papelería</h2>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Tarjetas corporativas, firmas de correo, membretes A4 y packaging.
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
                  onClick={() => setLightboxIndex(i)}
                  className="relative aspect-square overflow-hidden bg-card cursor-pointer"
                >
                  <img
                    src={item.image_url}
                    alt={item.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-contain p-4 transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-500 flex items-center justify-center">
                    <ZoomIn className="w-6 h-6 text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg" />
                  </div>
                </div>
                <div className="p-5 space-y-2 border-t border-border/50">
                  <span className="inline-block text-[10px] font-semibold uppercase tracking-wider text-primary/80 bg-primary/10 px-2 py-0.5 rounded-full">
                    {pieceTypeLabels[item.piece_type] ?? item.piece_type}
                  </span>
                  <h3 className="font-display text-lg font-semibold text-primary">{item.title}</h3>
                  {item.description && (
                    <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap">
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
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm p-4 cursor-pointer"
            onClick={close}
          >
            <button
              onClick={close}
              className="absolute top-6 right-6 rounded-full p-2 bg-card border border-border/50 text-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
            {items.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); prev(); }}
                  className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 rounded-full p-3 bg-card border border-border/50 text-foreground hover:bg-primary hover:text-primary-foreground transition-all"
                  aria-label="Anterior"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); next(); }}
                  className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 rounded-full p-3 bg-card border border-border/50 text-foreground hover:bg-primary hover:text-primary-foreground transition-all"
                  aria-label="Siguiente"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <span className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs bg-card border border-border/50 px-3 py-1 rounded-full">
                  {lightboxIndex + 1} / {items.length}
                </span>
              </>
            )}
            <motion.img
              key={lightboxIndex}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              src={items[lightboxIndex].image_url}
              alt={items[lightboxIndex].title}
              className="max-w-[90vw] max-h-[90vh] object-contain rounded-xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PapeleriaSection;
