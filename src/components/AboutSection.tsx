import { motion } from "framer-motion";

const skills = ["Photo Editing", "Color Grading", "Compositing", "Video Production", "Motion Graphics", "Retouching"];

const AboutSection = () => {
  return (
    <section id="about" className="py-32 px-6 md:px-12 border-t border-border/50 relative">
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-accent/5 rounded-full blur-[100px]" />

      <div className="container relative">
        <div className="grid md:grid-cols-2 gap-16 md:gap-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-primary font-display text-sm tracking-[0.3em] uppercase mb-4">About Me</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-8">
              My Style &<br /><span className="text-gradient">Creative Process</span>
            </h2>
            <div className="space-y-5 text-muted-foreground leading-relaxed font-body">
              <p>
                I'm a visual artist and creative editor specializing in transforming raw imagery 
                into compelling visual stories. My work spans from subtle photo enhancements 
                to full-scale digital compositions and commercial video production.
              </p>
              <p>
                Every project starts with understanding the vision — then I bring it to life 
                through meticulous attention to detail, bold color choices, and a deep 
                understanding of visual storytelling.
              </p>
              <p>
                Currently available for freelance projects, collaborations, and commercial work.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <p className="text-primary font-display text-sm tracking-[0.3em] uppercase mb-4">Expertise</p>
            <div className="flex flex-wrap gap-3 mt-8">
              {skills.map((skill, i) => (
                <motion.span
                  key={skill}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.2 + i * 0.05 }}
                  className="border border-border px-5 py-2.5 font-display text-sm text-foreground rounded-md transition-all duration-300 hover:border-primary hover:text-primary hover:shadow-[0_0_15px_hsl(263_70%_58%_/_0.2)] cursor-default"
                >
                  {skill}
                </motion.span>
              ))}
            </div>

            <div className="mt-12 grid grid-cols-2 gap-6">
              {[
                { number: "5+", label: "Years Experience" },
                { number: "200+", label: "Projects Completed" },
                { number: "50+", label: "Happy Clients" },
                { number: "∞", label: "Creative Ideas" },
              ].map((stat) => (
                <div key={stat.label} className="text-center p-4 bg-card rounded-lg border border-border/50">
                  <p className="font-display text-2xl font-bold text-primary">{stat.number}</p>
                  <p className="text-muted-foreground text-xs mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
