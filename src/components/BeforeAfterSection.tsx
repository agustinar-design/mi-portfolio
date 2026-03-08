import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

interface BeforeAfterImage {
  id: string;
  image_url: string;
  image_type: "before" | "after";
  display_order: number;
}

interface BeforeAfterItem {
  id: string;
  brand_name: string;
  display_order: number;
  images: BeforeAfterImage[];
}

const BeforeAfterSection = () => {
  const [items, setItems] = useState<BeforeAfterItem[]>([]);

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
        display_order: item.display_order,
        images: images.filter((img: any) => img.item_id === item.id),
      }));

      // Only show items that have at least one image
      setItems(enriched.filter((item) => item.images.length > 0));
    };
    fetchItems();
  }, []);

  if (items.length === 0) return null;

  return (
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

        <div className="grid grid-cols-1 gap-16">
          {items.map((item, i) => {
            const beforeImgs = item.images.filter((img) => img.image_type === "before");
            const afterImgs = item.images.filter((img) => img.image_type === "after");

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="space-y-6"
              >
                <h3 className="font-display text-xl font-semibold text-primary">
                  {item.brand_name}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Before */}
                  {beforeImgs.length > 0 && (
                    <div className="space-y-3">
                      <span className="font-display text-xs tracking-[0.2em] uppercase text-muted-foreground">
                        Antes
                      </span>
                      <div className={`grid gap-3 ${beforeImgs.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}>
                        {beforeImgs.map((img) => (
                          <div key={img.id} className="overflow-hidden rounded-xl border border-border/50 bg-card">
                            <img
                              src={img.image_url}
                              alt={`${item.brand_name} - Antes`}
                              className="w-full h-auto object-cover"
                              loading="lazy"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* After */}
                  {afterImgs.length > 0 && (
                    <div className="space-y-3">
                      <span className="font-display text-xs tracking-[0.2em] uppercase text-primary">
                        Después
                      </span>
                      <div className={`grid gap-3 ${afterImgs.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}>
                        {afterImgs.map((img) => (
                          <div key={img.id} className="overflow-hidden rounded-xl border border-primary/30 bg-card shadow-[0_0_20px_hsl(263_70%_58%_/_0.1)]">
                            <img
                              src={img.image_url}
                              alt={`${item.brand_name} - Después`}
                              className="w-full h-auto object-cover"
                              loading="lazy"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BeforeAfterSection;
