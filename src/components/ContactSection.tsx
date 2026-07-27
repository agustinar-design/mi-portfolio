import { motion } from "framer-motion";
import { Instagram, Mail, MessageCircle } from "lucide-react";
import logo from "@/assets/LogoIMPRONTA_en_blanco.png.asset.json";

const ContactSection = () => {
  return (
    <section id="contact" className="py-32 px-6 md:px-12 border-t border-border/50 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px]" />

      {/* Brand logo corner */}
      <img
        src={logo.url}
        alt="Contenido Visual"
        className="absolute bottom-4 right-4 md:bottom-6 md:right-6 h-12 md:h-16 w-auto max-w-[180px] md:max-w-[260px] opacity-90 drop-shadow-[0_0_20px_hsl(263_70%_58%_/_0.4)] hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10 object-contain"
      />

      <div className="container relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto">

          <p className="text-primary font-display text-sm tracking-[0.3em] uppercase mb-4">CONTACTO</p>
          <h2 className="font-display text-4xl md:text-6xl font-bold mb-6 normal-case">
            Hagamos que tu marca{" "}
            <span className="text-primary">destaque</span>
            <span className="text-foreground">.</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-10 font-body">
            ¿Qué visión tenés para tu empresa? Me encantaría acompañarte.
          </p>

          <p className="text-foreground text-sm mb-6 font-body">
            Escribime por el canal que prefieras:
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://wa.link/dc1x5t"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 font-display text-sm tracking-wide rounded-md transition-all duration-300 hover:shadow-[0_0_30px_hsl(263_70%_58%_/_0.5)]">
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </a>
            <a
              href="mailto:ab.contactowork@gmail.com"
              className="inline-flex items-center gap-2 border border-primary/40 text-foreground px-8 py-4 font-display text-sm tracking-wide rounded-md transition-all duration-300 hover:border-primary hover:text-primary hover:shadow-[0_0_20px_hsl(263_70%_58%_/_0.3)]">
              <Mail className="w-4 h-4" />
              Enviar Email
            </a>
          </div>

        </motion.div>

        {/* Footer */}
        <div className="mt-32 pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm font-body">
            © 2026 Agustina Bernal. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-8">
            <a
              href="https://www.instagram.com/impronta.ab?igsh=dGU2YW8yYzIzdW1q"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground text-sm hover:text-primary transition-colors duration-300 font-body flex items-center gap-2">
              <Instagram className="h-4 w-4" />
              Instagram
            </a>
            <a
              href="https://www.tiktok.com/@abcontenidovisual?_r=1&_t=ZS-98B2GPGpEAf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground text-sm hover:text-primary transition-colors duration-300 font-body flex items-center gap-2">
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
              </svg>
              TikTok
            </a>
          </div>
        </div>
      </div>
    </section>);

};

export default ContactSection;