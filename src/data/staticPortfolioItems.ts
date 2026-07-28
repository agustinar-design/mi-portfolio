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

export type Category = "images";

export interface StaticPortfolioItem {
  key: string;
  title: string;
  description: string;
  image?: string;
  video?: string;
}

export const categoryLabels: Record<Category, string> = {
  images: "Imágenes",
};

export const staticPortfolioItems: Record<Category, StaticPortfolioItem[]> = {
  images: [
    { key: "basic-1", title: "Universal App – Sistema", description: "Diseño de contenido visual para sistema de gestión comercial.", image: basico1 },
    { key: "basic-2", title: "Universal App – Métricas", description: "Pieza promocional destacando funcionalidades y métricas.", image: basico2 },
    { key: "basic-3", title: "Universal App – Gestión", description: "Contenido visual para mostrar módulos de gestión.", image: basico3 },
    { key: "basic-4", title: "Universal App – Funciones", description: "Diseño destacando funciones ilimitadas y escalabilidad.", image: basico4 },
    { key: "basic-5", title: "Universal App – Ventas", description: "Pieza horizontal para sistema de ventas y contabilidad.", image: basico5 },
    { key: "basic-6", title: "Universal App – Seguridad", description: "Contenido visual sobre copias de seguridad y planes.", image: basico6 },
    { key: "basic-7", title: "Universal App – Potenciá", description: "Diseño motivacional para digitalización de negocios.", image: basico7 },
    { key: "basic-8", title: "Universal App – Éxito", description: "Pieza promocional con llamado a la acción.", image: basico8 },
    { key: "elaborate-1", title: "Universal App – Asesoría y Ventas", description: "Diseño visual con identidad de marca y datos de contacto.", image: visual1 },
    { key: "elaborate-2", title: "Universal App – Página Web", description: "Contenido promocional para negocio organizado con web propia.", image: visual2 },
    { key: "elaborate-3", title: "Universal App – Agradecimiento", description: "Pieza circular de agradecimiento con branding de marca.", image: visual3 },
    { key: "elaborate-4", title: "Universal App – Cierre de Año", description: "Contenido estacional con calendario y llamado a la acción.", image: visual4 },
    { key: "elaborate-5", title: "Universal App – Digitalización", description: "Diseño comparativo papel vs sistema digital.", image: visual5 },
    { key: "elaborate-6", title: "Universal App – Gestión Multirubro", description: "Pieza con precios y demo del sistema de gestión.", image: visual6 },
    { key: "elaborate-7", title: "Universal App – Planes y Precios", description: "Contenido con opciones de planes mensual, anual y pago único.", image: visual7 },
    { key: "elaborate-8", title: "Universal App – Métricas Detalle", description: "Diseño mostrando métricas y funcionalidades del sistema.", image: visual8 },
  ],
};
