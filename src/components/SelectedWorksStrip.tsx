import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { TeamMember, WorkItem } from "@/data/teamData";
import { useData } from "@/context/DataContext";

interface SelectedWorksStripProps {
  onWorkClick: (member: TeamMember, workIndex: number) => void;
}

interface FeaturedWork {
  work: WorkItem;
  member: TeamMember;
  originalIndex: number;
}

export function SelectedWorksStrip({ onWorkClick }: SelectedWorksStripProps) {
  const { teamMembers, siteContent } = useData();
  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const featuredWorks: FeaturedWork[] = teamMembers.flatMap((member) =>
    member.works.slice(0, 2).map((work, idx) => ({
      work,
      member,
      originalIndex: idx,
    }))
  );

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const amount = scrollRef.current.clientWidth * 0.6;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -amount : amount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      id="works"
      ref={sectionRef}
      className="relative py-24 md:py-32 overflow-hidden"
      style={{ background: "var(--bg-secondary)" }}
    >
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <p
            className="text-sm font-semibold uppercase tracking-[0.2em] mb-3"
            style={{ color: "var(--text-tertiary)" }}
          >
            {siteContent.worksSectionSubtitle}
          </p>
          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
            style={{ color: "var(--text-primary)" }}
          >
            {siteContent.worksSectionTitle}
          </h2>
        </motion.div>
      </div>

      <div className="relative group">
        <button
          onClick={() => scroll("left")}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 glass p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:scale-110"
          style={{ color: "var(--text-primary)" }}
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => scroll("right")}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 glass p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:scale-110"
          style={{ color: "var(--text-primary)" }}
        >
          <ChevronRight size={20} />
        </button>

        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto hide-scrollbar px-6 pb-4 snap-x snap-mandatory"
        >
          {featuredWorks.map((item, i) => (
            <motion.div
              key={item.work.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="flex-shrink-0 w-[320px] md:w-[400px] snap-start cursor-pointer group/card"
              onMouseEnter={() => setHoveredId(item.work.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => onWorkClick(item.member, item.originalIndex)}
            >
              <div className="glass-card rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2">
                <div className="relative aspect-[3/2] overflow-hidden">
                  <img
                    src={item.work.image}
                    alt={item.work.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
                    loading="lazy"
                  />
                  <div
                    className="absolute inset-0 transition-opacity duration-300"
                    style={{
                      opacity: hoveredId === item.work.id ? 0.3 : 0,
                      background: `linear-gradient(135deg, ${item.member.accentColor}, transparent)`,
                    }}
                  />
                  <div className="absolute bottom-3 left-3">
                    <motion.span
                      initial={false}
                      animate={{ opacity: hoveredId === item.work.id ? 1 : 0, y: hoveredId === item.work.id ? 0 : 10 }}
                      transition={{ duration: 0.3 }}
                      className="inline-block px-3 py-1.5 rounded-full text-white text-xs font-semibold"
                      style={{ background: `${item.member.accentColor}cc` }}
                    >
                      {item.member.firstName} · {item.member.role}
                    </motion.span>
                  </div>
                </div>
                <div className="p-5">
                  <h3
                    className="text-base font-semibold mb-1 truncate"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {item.work.title}
                  </h3>
                  <p
                    className="text-sm line-clamp-2"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {item.work.description}
                  </p>
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {item.work.tools.map((tool) => (
                      <span
                        key={tool}
                        className="text-[10px] font-medium uppercase tracking-wider px-2.5 py-1 rounded-full"
                        style={{
                          background: "var(--bg-tertiary)",
                          color: "var(--text-tertiary)",
                        }}
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
