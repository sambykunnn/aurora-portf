import { motion } from "framer-motion";
import { ArrowUpRight, Layers } from "lucide-react";
import type { WorkItem } from "@/data/teamData";

interface GalleryCardProps {
  work: WorkItem;
  accentColor: string;
  index: number;
  onViewProject: () => void;
}

export function GalleryCard({ work, accentColor, index, onViewProject }: GalleryCardProps) {
  const hasBlocks = (work.contentBlocks?.length || 0) > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group cursor-pointer"
      onClick={onViewProject}
    >
      <div
        className="rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2"
        style={{
          background: "var(--card-bg)",
          border: "1px solid var(--glass-border)",
          boxShadow: "0 4px 20px var(--glass-shadow)",
        }}
      >
        {/* Image */}
        <div className="relative aspect-[3/2] overflow-hidden">
          <img
            src={work.image}
            alt={work.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
          {/* Accent overlay on hover */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-25 transition-opacity duration-500"
            style={{ background: `linear-gradient(135deg, ${accentColor}, transparent)` }}
          />
          {/* View project badge */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <motion.div
              initial={false}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-white text-xs font-semibold backdrop-blur-md"
              style={{ background: `${accentColor}cc` }}
            >
              <ArrowUpRight size={14} />
              View Project
            </motion.div>
          </div>
          {/* Content blocks indicator */}
          {hasBlocks && (
            <div
              className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full text-white text-[10px] font-semibold backdrop-blur-md"
              style={{ background: "rgba(0,0,0,0.5)" }}
            >
              <Layers size={10} />
              {work.contentBlocks!.length}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <h4 className="text-sm font-semibold mb-1 truncate" style={{ color: "var(--text-primary)" }}>
            {work.title}
          </h4>
          <p
            className="text-xs line-clamp-2 leading-relaxed mb-3"
            style={{ color: "var(--text-secondary)" }}
          >
            {work.description}
          </p>
          <div className="flex gap-2 flex-wrap">
            {work.tools.map((tool) => (
              <span
                key={tool}
                className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full"
                style={{
                  background: `${accentColor}12`,
                  color: accentColor,
                }}
              >
                {tool}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
