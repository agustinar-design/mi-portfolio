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
import video1 from "@/assets/video_1.mp4";
import video2 from "@/assets/video_2.mp4";
import video4 from "@/assets/video_4.mp4";
import video6 from "@/assets/video_6.mp4";
import video8 from "@/assets/video_8.mp4";
import video9 from "@/assets/video_9.mp4";
import video11 from "@/assets/video_11.mp4";
import video13 from "@/assets/video_13.mp4";
import video15 from "@/assets/video_15.mp4";
import video16 from "@/assets/video_16.mp4";
import video17 from "@/assets/video_17.mp4";
import video20 from "@/assets/video_20.mp4";

export type Category = "images" | "video";

export interface StaticPortfolioItem {
  key: string;
  title: string;
  description: string;
  image?: string;
  video?: string;
}

export const categoryLabels: Record<Category, string> = {
  images: "Imágenes",
  video: "Videos",
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
  video: [
    { key: "video-1", title: "Universal App – Reel Promocional", description: "Video corto promocional para redes sociales.", video: video1 },
    { key: "video-2", title: "Universal App – Contenido Dinámico", description: "Video dinámico con animaciones y efectos visuales.", video: video2 },
    { key: "video-4", title: "Universal App – Spot Comercial", description: "Video comercial con edición profesional.", video: video4 },
    { key: "video-6", title: "Universal App – Campaña Digital", description: "Producción audiovisual para campaña en redes.", video: video6 },
    { key: "video-8", title: "Universal App – Motion Graphics", description: "Video con motion graphics y branding.", video: video8 },
    { key: "video-9", title: "Universal App – Historia Animada", description: "Video con animaciones para historias de redes.", video: video9 },
    { key: "video-11", title: "Universal App – Promoción Express", description: "Contenido rápido y dinámico para redes sociales.", video: video11 },
    { key: "video-13", title: "Universal App – Impacto Visual", description: "Video con efectos visuales de alto impacto.", video: video13 },
    { key: "video-15", title: "Universal App – Branding Digital", description: "Video de branding con identidad visual.", video: video15 },
    { key: "video-16", title: "Universal App – Reel Creativo", description: "Reel creativo con edición dinámica.", video: video16 },
    { key: "video-17", title: "Universal App – Contenido Social", description: "Video optimizado para engagement en redes.", video: video17 },
    { key: "video-20", title: "Universal App – Presentación Visual", description: "Video de presentación con efectos visuales.", video: video20 },
  ],
};
