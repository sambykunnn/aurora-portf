import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Settings } from "lucide-react";
import { useData } from "@/context/DataContext";

interface FooterProps {
  onAdminClick: () => void;
}

export function Footer({ onAdminClick }: FooterProps) {
  const { siteContent } = useData();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <footer
      ref={ref}
      className="py-12 px-6 border-t"
      style={{
        background: "var(--bg-secondary)",
        borderColor: "var(--divider)",
      }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8 }}
        className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4"
      >
        <div className="flex items-center gap-2">
          <span
            className="text-lg font-bold tracking-tight"
            style={{ color: "var(--text-primary)" }}
          >
            {siteContent.studioName}
          </span>
          <span className="text-gradient text-[10px] font-semibold uppercase tracking-[0.2em]">
            Studio
          </span>
        </div>
        <div className="flex items-center gap-4">
          <p
            className="text-sm"
            style={{ color: "var(--text-tertiary)" }}
          >
            © {new Date().getFullYear()} {siteContent.studioName} Creative Studio. All rights reserved.
          </p>
          <button
            onClick={onAdminClick}
            className="p-2 rounded-xl transition-all duration-300 hover:bg-[var(--bg-tertiary)] opacity-30 hover:opacity-100"
            style={{ color: "var(--text-tertiary)" }}
            title="Admin Panel"
          >
            <Settings size={14} />
          </button>
        </div>
      </motion.div>
    </footer>
  );
}
