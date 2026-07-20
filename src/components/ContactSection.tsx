import { motion } from "framer-motion";
import { Instagram, Mail, MessageCircle } from "lucide-react";
import logo from "@/assets/MiLogoPNG.png.asset.json";

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
          <div className="flex gap-8">
            <a
              href="https://www.instagram.com/abcontenidodigital/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground text-sm hover:text-primary transition-colors duration-300 font-body flex items-center gap-2">
              <Instagram className="h-4 w-4" />
              Instagram
            </a>
          </div>
        </div>
      </div>
    </section>);

};

export default ContactSection;