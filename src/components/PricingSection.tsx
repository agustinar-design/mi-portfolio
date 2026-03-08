import { motion } from "framer-motion";
import { Heart, ThumbsUp, MessageCircle, TrendingUp, BarChart3, ArrowUpRight } from "lucide-react";

const plans = [
  {
    name: "Plan Impulso Digital",
    subtitle: "Incluye:",
    items: [
      "10 historias estratégicas",
      "4 Reels",
      "10 posteos (carrusel o imagen)",
      "Calendario mensual organizado",
      "Definición de objetivos del mes",
      "Análisis básico de métricas",
      "Ajustes según rendimiento",
      "Reunión mensual (opcional) o PDF simple con resumen de métricas, lo que funcionó mejor, lo que ajustamos, propuesta para el mes siguiente",
    ],
    audience: [
      { text: "Quieren ordenar su presencia digital", highlight: false },
      { text: "Necesitan una identidad clara y profesional", highlight: false },
      { text: "Buscan una estructura profesional accesible", highlight: true },
      { text: "Quieren empezar a generar confianza y visibilidad real", highlight: true },
    ],
    icons: [Heart, ThumbsUp, MessageCircle],
  },
  {
    name: "Plan Expansión Digital",
    subtitle: "Incluye todo lo anterior +:",
    items: [
      "Análisis de la competencia",
      "Optimización más profunda de las métricas",
      "Ajuste estratégico quincenal",
      "Landing page personalizada alineada a la identidad de la marca, con presentación del negocio, servicios/productos, formulario de contacto, botón directo a WhatsApp y adaptada a celular",
    ],
    audience: [
      { text: "Y quieren ir un paso más allá", highlight: false },
      { text: "Buscan posicionarse con mayor autoridad", highlight: false },
      { text: "Necesitan un ecosistema digital más completo", highlight: true },
      { text: "Quieren convertir visitas en oportunidades reales", highlight: false },
    ],
    icons: [TrendingUp, BarChart3, ArrowUpRight],
  },
];

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
                className="relative rounded-xl border border-border/50 bg-card/80 backdrop-blur-sm p-8 transition-all duration-500 group cursor-default"
                whileHover={{
                  borderColor: "hsl(263 70% 58% / 0.5)",
                  boxShadow: "0 0 30px hsl(263 70% 58% / 0.15), 0 0 60px hsl(263 70% 58% / 0.05)",
                }}
              >
                <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-1">{plan.name}</h3>
                <p className="text-primary font-display text-sm mb-6">{plan.subtitle}</p>
                <ul className="space-y-3">
                  {plan.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-muted-foreground font-body text-sm leading-relaxed">
                      <span className="text-primary mt-0.5 shrink-0">•</span>
                      {item}
                    </li>
                  ))}
                </ul>

                <FloatingIcons icons={plan.icons} side={idx === 0 ? "left" : "right"} />
              </motion.div>

              {/* Audience card */}
              <motion.div
                className="rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm p-6 transition-all duration-500"
                whileHover={{
                  borderColor: "hsl(263 70% 58% / 0.4)",
                  boxShadow: "0 0 20px hsl(263 70% 58% / 0.1)",
                }}
              >
                <ul className="space-y-3">
                  {plan.audience.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 font-body text-sm leading-relaxed">
                      <span className="text-primary mt-0.5 shrink-0">•</span>
                      <span className={item.highlight ? "text-primary font-medium" : "text-foreground"}>
                        {item.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center text-muted-foreground font-body text-sm mt-12"
        >
          ¿Querés saber más? <a href="#contact" className="text-primary hover:underline">Hablemos</a> y armamos algo a tu medida.
        </motion.p>
      </div>
    </section>
  );
};

export default PricingSection;
