import { motion } from "framer-motion";
import { Heart, ThumbsUp, MessageCircle, TrendingUp, BarChart3, ArrowUpRight } from "lucide-react";

const plans = [
  {
    name: "Plan Impulso Digital",
    price: "$250.000",
    subtitle: "Incluye:",
    items: [
      { text: "10 historias estratégicas", highlights: [] },
      { text: "4 Reels", highlights: [] },
      { text: "10 posteos (carrusel o imagen)", highlights: [] },
      { text: "Calendario mensual organizado", highlights: [] },
      { text: "Definición de objetivos del mes", highlights: [] },
      { text: "Análisis básico de métricas", highlights: [] },
      { text: "Ajustes según rendimiento", highlights: [] },
      { text: "Reunión mensual (opcional) o PDF simple con resumen de métricas, lo que funcionó mejor, lo que ajustamos, propuesta para el mes siguiente", highlights: [] },
    ],
    audienceTitle: "Ideal para marcas y emprendimientos que:",
    audience: [
      { text: "Quieren ordenar su presencia digital", highlights: [] },
      { text: "Necesitan una identidad clara y profesional", highlights: [] },
      { text: "Buscan una estructura profesional accesible", highlights: ["estructura profesional accesible"] },
      { text: "Quieren empezar a generar confianza y visibilidad real", highlights: ["confianza", "visibilidad"] },
    ],
    icons: [Heart, ThumbsUp, MessageCircle],
  },
  {
    name: "Plan Expansión Digital",
    price: "$300.000",
    subtitle: "Incluye todo lo anterior +:",
    items: [
      { text: "Análisis de la competencia", highlights: [] },
      { text: "Optimización más profunda de las métricas", highlights: [] },
      { text: "Ajuste estratégico quincenal", highlights: [] },
      { text: "Landing page personalizada alineada a la identidad de la marca, con presentación del negocio, servicios/productos, formulario de contacto, botón directo a WhatsApp y adaptada a celular", highlights: ["Landing page"] },
    ],
    audienceTitle: "Para negocios que buscan escalar y convertir:",
    audience: [
      { text: "Y quieren ir un paso más allá", highlights: [] },
      { text: "Buscan posicionarse con mayor autoridad", highlights: [] },
      { text: "Necesitan un ecosistema digital más completo", highlights: ["un ecosistema digital más completo"] },
      { text: "Quieren convertir visitas en oportunidades reales", highlights: [] },
    ],
    icons: [TrendingUp, BarChart3, ArrowUpRight],
  },
];

const HighlightedText = ({ text, highlights }: { text: string; highlights: string[] }) => {
  if (highlights.length === 0) return <span className="text-foreground">{text}</span>;
  
  let result: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;
  
  while (remaining.length > 0) {
    let earliestIndex = remaining.length;
    let earliestHighlight = "";
    
    for (const h of highlights) {
      const idx = remaining.toLowerCase().indexOf(h.toLowerCase());
      if (idx !== -1 && idx < earliestIndex) {
        earliestIndex = idx;
        earliestHighlight = h;
      }
    }
    
    if (earliestHighlight === "") {
      result.push(<span key={key}>{remaining}</span>);
      break;
    }
    
    if (earliestIndex > 0) {
      result.push(<span key={key}>{remaining.slice(0, earliestIndex)}</span>);
      key++;
    }
    result.push(<span key={key} className="text-primary font-medium">{remaining.slice(earliestIndex, earliestIndex + earliestHighlight.length)}</span>);
    key++;
    remaining = remaining.slice(earliestIndex + earliestHighlight.length);
  }
  
  return <span>{result}</span>;
};

const FloatingIcons = ({ icons, side }: { icons: React.ElementType[]; side: "left" | "right" }) => (
  <div className={`absolute ${side === "left" ? "-bottom-6 -right-6" : "-bottom-6 -right-6"} flex gap-2`}>
    {icons.map((Icon, i) => (
      <motion.div
        key={i}
        className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.4, ease: "easeInOut" }}
        whileHover={{ scale: 1.3, backgroundColor: "hsl(263 70% 58% / 0.4)" }}
      >
        <Icon className="w-5 h-5" />
      </motion.div>
    ))}
  </div>
);

const PricingSection = () => {
  return (
    <section id="pricing" className="py-32 px-6 md:px-12 border-t border-border/50 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />

      <div className="container relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-primary font-display text-sm tracking-[0.3em] uppercase mb-4">Planes</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold">
            Elegí el plan que<br />
            <span className="text-gradient">impulse tu marca</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12 max-w-5xl mx-auto">
          {plans.map((plan, idx) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="space-y-6"
            >
              {/* Plan card */}
              <motion.div
                className="group relative cursor-default overflow-hidden rounded-[1.75rem] border border-border/50 bg-card/35 p-8 shadow-2xl backdrop-blur-2xl transition-all duration-500 hover:border-primary/30 hover:bg-card/50"
                whileHover={{ y: -6 }}
              >
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/12 via-card/5 to-secondary/15" />
                <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

                <div className="relative mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="mb-1 font-display text-2xl font-bold text-foreground md:text-3xl">{plan.name}</h3>
                    <p className="font-display text-sm text-primary">{plan.subtitle}</p>
                  </div>

                  <div className="w-fit rounded-full border border-primary/20 bg-primary/10 px-4 py-2 backdrop-blur-md">
                    <p className="font-display text-[10px] uppercase tracking-[0.25em] text-primary/80">Inversión</p>
                    <p className="font-display text-2xl font-bold text-foreground">{plan.price}</p>
                  </div>
                </div>

                <ul className="relative space-y-3">
                  {plan.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground font-body">
                      <span className="mt-0.5 shrink-0 text-primary">•</span>
                      <HighlightedText text={item.text} highlights={item.highlights} />
                    </li>
                  ))}
                </ul>

                <FloatingIcons icons={plan.icons} side={idx === 0 ? "left" : "right"} />
              </motion.div>

              {/* Audience card */}
              <motion.div
                className="relative overflow-hidden rounded-[1.5rem] border border-border/50 bg-card/30 p-6 backdrop-blur-xl transition-all duration-500 hover:border-primary/25 hover:bg-card/45"
                whileHover={{ y: -4 }}
              >
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
                <div className="relative">
                  <span className="mb-4 inline-flex rounded-full border border-primary/20 bg-primary/10 px-3 py-1 font-display text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                    {plan.audienceTitle}
                  </span>
                </div>

                <ul className="relative space-y-3">
                  {plan.audience.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm leading-relaxed font-body">
                      <span className="mt-0.5 shrink-0 text-primary">•</span>
                      <HighlightedText text={item.text} highlights={item.highlights} />
                    </li>
                  ))}
                </ul>
              </motion.div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default PricingSection;
