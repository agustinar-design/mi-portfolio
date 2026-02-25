import { motion } from "framer-motion";

const ContactSection = () => {
  return (
    <section id="contact" className="py-32 px-6 md:px-12 border-t border-border">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto"
        >
          <p className="text-primary font-display text-sm tracking-[0.3em] uppercase mb-4">
            Contact
          </p>
          <h2 className="font-display text-4xl md:text-6xl font-bold mb-6">
            Let's work
            <br />
            <span className="text-gradient">together</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-12">
            Have a project in mind? I'd love to hear about it.
          </p>
          <a
            href="mailto:hello@example.com"
            className="inline-block bg-primary text-primary-foreground px-10 py-4 font-display text-sm tracking-wide hover:opacity-90 transition-opacity rounded-sm"
          >
            hello@example.com
          </a>
        </motion.div>

        <div className="mt-32 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm font-body">
            © 2025 Portfolio. All rights reserved.
          </p>
          <div className="flex gap-8">
            {["Twitter", "LinkedIn", "GitHub", "Dribbble"].map((link) => (
              <a
                key={link}
                href="#"
                className="text-muted-foreground text-sm hover:text-primary transition-colors font-body"
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
