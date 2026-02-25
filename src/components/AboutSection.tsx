import { motion } from "framer-motion";

const skills = ["UI/UX Design", "React", "TypeScript", "Figma", "Motion Design", "Branding"];

const AboutSection = () => {
  return (
    <section id="about" className="py-32 px-6 md:px-12 border-t border-border">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-16 md:gap-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-primary font-display text-sm tracking-[0.3em] uppercase mb-4">
              About
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-8">
              A bit about me
            </h2>
            <div className="space-y-5 text-muted-foreground leading-relaxed">
              <p>
                I'm a designer and developer passionate about creating digital
                products that are both beautiful and functional. With over 5 years
                of experience, I bring ideas to life through clean code and
                thoughtful design.
              </p>
              <p>
                Currently available for freelance projects and collaborations.
                Let's build something great together.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="text-primary font-display text-sm tracking-[0.3em] uppercase mb-4">
              Skills
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="border border-border px-5 py-2.5 font-display text-sm text-foreground hover:border-primary hover:text-primary transition-colors cursor-default rounded-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
