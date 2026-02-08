import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { WorkItem } from "@/data/teamData";

interface GalleryCardProps {
  work: WorkItem;
  accentColor: string;
  index: number;
}

export function GalleryCard({ work, accentColor, index }: GalleryCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group"
    >
      <div
        className="rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-1"
        style={{
          background: "var(--card-bg)",
          border: "1px solid var(--glass-border)",
          boxShadow: `0 4px 20px var(--glass-shadow)`,
        }}
      >
        <div className="relative aspect-[3/2] overflow-hidden cursor-pointer" onClick={() => setExpanded(!expanded)}>
          <img
            src={work.image}
            alt={work.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500"
            style={{ background: `linear-gradient(135deg, ${accentColor}, transparent)` }}
          />
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
              {work.title}
            </h4>
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex-shrink-0 p-1 rounded-lg transition-colors hover:bg-[var(--bg-tertiary)]"
              style={{ color: "var(--text-tertiary)" }}
            >
              {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>

          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <p
                  className="text-sm mt-2 leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {work.description}
                </p>
                <div className="flex gap-2 mt-3 flex-wrap">
                  {work.tools.map((tool) => (
                    <span
                      key={tool}
                      className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full"
                      style={{
                        background: `${accentColor}18`,
                        color: accentColor,
                      }}
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
