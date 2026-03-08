import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

interface BeforeAfterItem {
  id: string;
  brand_name: string;
  before_image_url: string;
  after_image_url: string;
  display_order: number;
}

const BeforeAfterSection = () => {
  const [items, setItems] = useState<BeforeAfterItem[]>([]);

  useEffect(() => {
    const fetchItems = async () => {
      const { data } = await supabase
        .from("before_after_items")
        .select("*")
        .order("display_order", { ascending: true });
      if (data) setItems(data as BeforeAfterItem[]);
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="space-y-4"
            >
              <h3 className="font-display text-xl font-semibold text-primary">
                {item.brand_name}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <span className="font-display text-xs tracking-[0.2em] uppercase text-muted-foreground">
                    Antes
                  </span>
                  <div className="overflow-hidden rounded-xl border border-border/50 bg-card">
                    <img
                      src={item.before_image_url}
                      alt={`${item.brand_name} - Antes`}
                      className="w-full h-auto object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <span className="font-display text-xs tracking-[0.2em] uppercase text-primary">
                    Después
                  </span>
                  <div className="overflow-hidden rounded-xl border border-primary/30 bg-card shadow-[0_0_20px_hsl(263_70%_58%_/_0.1)]">
                    <img
                      src={item.after_image_url}
                      alt={`${item.brand_name} - Después`}
                      className="w-full h-auto object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BeforeAfterSection;
