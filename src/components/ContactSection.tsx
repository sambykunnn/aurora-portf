import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Send, CheckCircle } from "lucide-react";
import { useData } from "@/context/DataContext";

export function ContactSection() {
  const { siteContent } = useData();
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", email: "", message: "" });
    }, 3000);
  };

  const inputStyles: React.CSSProperties = {
    background: "var(--bg-secondary)",
    color: "var(--text-primary)",
    borderColor: "var(--divider)",
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative py-24 md:py-32 px-6"
      style={{ background: "var(--bg-primary)" }}
    >
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 md:mb-16"
        >
          <p
            className="text-sm font-semibold uppercase tracking-[0.2em] mb-3"
            style={{ color: "var(--text-tertiary)" }}
          >
            Get in Touch
          </p>
          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            {siteContent.contactHeading}
          </h2>
          <p
            className="text-lg md:text-xl max-w-lg mx-auto"
            style={{ color: "var(--text-secondary)" }}
          >
            {siteContent.contactDescription}
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          onSubmit={handleSubmit}
          className="glass-card rounded-3xl p-8 md:p-10 space-y-6"
        >
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label
                className="block text-xs font-semibold uppercase tracking-[0.15em] mb-2"
                style={{ color: "var(--text-tertiary)" }}
              >
                Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#6366f1]/30 focus:border-[#6366f1]"
                style={inputStyles}
                placeholder="Your name"
              />
            </div>
            <div>
              <label
                className="block text-xs font-semibold uppercase tracking-[0.15em] mb-2"
                style={{ color: "var(--text-tertiary)" }}
              >
                Email
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#6366f1]/30 focus:border-[#6366f1]"
                style={inputStyles}
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div>
            <label
              className="block text-xs font-semibold uppercase tracking-[0.15em] mb-2"
              style={{ color: "var(--text-tertiary)" }}
            >
              Message
            </label>
            <textarea
              required
              rows={5}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#6366f1]/30 focus:border-[#6366f1] resize-none"
              style={inputStyles}
              placeholder="Tell us about your project..."
            />
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={submitted}
            className="w-full py-4 rounded-xl text-sm font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70"
            style={{
              background: submitted
                ? "#10B981"
                : "linear-gradient(135deg, #6366f1, #8b5cf6)",
            }}
          >
            {submitted ? (
              <>
                <CheckCircle size={18} />
                Message Sent!
              </>
            ) : (
              <>
                <Send size={16} />
                Send Message
              </>
            )}
          </motion.button>
        </motion.form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <p
            className="text-sm font-medium"
            style={{ color: "var(--text-tertiary)" }}
          >
            Or reach us directly at
          </p>
          <a
            href={`mailto:${siteContent.contactEmail}`}
            className="text-base font-semibold text-gradient mt-1 inline-block"
          >
            {siteContent.contactEmail}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
