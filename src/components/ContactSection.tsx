import { motion } from "framer-motion";

const ContactSection = () => {
  return (
    <section id="contact" className="py-32 px-6 md:px-12 border-t border-border/50 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px]" />

      <div className="container relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto">

          <p className="text-primary font-display text-sm tracking-[0.3em] uppercase mb-4">CONTACTO</p>
          <h2 className="font-display text-4xl md:text-6xl font-bold mb-6">Llevemos tu marca
a las redes sociales.
            <br />
            <span className="text-gradient">something amazing</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-4 font-body">
            Have a project in mind? I'd love to bring your vision to life.
          </p>
          <p className="text-muted-foreground text-sm mb-12 font-body">
            Currently accepting new projects — reach out and let's discuss your ideas.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">Verificar disponibilidad
            <a href="mailto:hello@example.com"
            className="bg-primary text-primary-foreground px-10 py-4 font-display text-sm tracking-wide rounded-md transition-all duration-300 hover:shadow-[0_0_30px_hsl(263_70%_58%_/_0.5)] animate-pulse-glow">

              hello@example.com
            </a>
          </div>

          <div className="mt-8 flex items-center justify-center gap-2 text-muted-foreground text-sm">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>Available for new projects</span>
          </div>
        </motion.div>

        {/* Footer */}
        <div className="mt-32 pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm font-body">
            © 2025 Studio. All rights reserved.
          </p>
          <div className="flex gap-8">
            {["Instagram", "Behance", "Twitter", "LinkedIn"].map((link) =>
            <a
              key={link}
              href="#"
              className="text-muted-foreground text-sm hover:text-primary transition-colors duration-300 font-body">

                {link}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>);

};

export default ContactSection;