import { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
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
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [isPaused, setIsPaused] = useState(false);
  const [lightbox, setLightbox] = useState<{ work: WorkItem; member: TeamMember; originalIndex: number } | null>(null);
  const [lightboxImageLoaded, setLightboxImageLoaded] = useState(false);
  const animationRef = useRef<number>(0);
  const scrollPos = useRef(0);
  const speed = 0.5;

  const featuredWorks: FeaturedWork[] = teamMembers.flatMap((member) =>
    member.works.slice(0, 2).map((work, idx) => ({
      work,
      member,
      originalIndex: idx,
    }))
  );

  const duplicatedWorks = [
    ...featuredWorks,
    ...featuredWorks,
    ...featuredWorks,
  ];

  const animate = useCallback(() => {
    if (!trackRef.current) return;
    if (!isPaused) {
      scrollPos.current += speed;
      const singleSetWidth = trackRef.current.scrollWidth / 3;
      if (scrollPos.current >= singleSetWidth) {
        scrollPos.current -= singleSetWidth;
      }
      trackRef.current.style.transform = `translateX(-${scrollPos.current}px)`;
    }
    animationRef.current = requestAnimationFrame(animate);
  }, [isPaused]);

  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [animate]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!lightbox) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowLeft") navigateLightbox(-1);
      if (e.key === "ArrowRight") navigateLightbox(1);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightbox, featuredWorks]);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (lightbox) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [lightbox]);

  const handleCardClick = (item: FeaturedWork) => {
    setLightboxImageLoaded(false);
    setLightbox({ work: item.work, member: item.member, originalIndex: item.originalIndex });
  };

  const handleViewProject = () => {
    if (lightbox) {
      onWorkClick(lightbox.member, lightbox.originalIndex);
      setLightbox(null);
    }
  };

  const navigateLightbox = (direction: number) => {
    if (!lightbox) return;
    const currentIdx = featuredWorks.findIndex(
      (fw) => fw.work.id === lightbox.work.id && fw.member.id === lightbox.member.id
    );
    if (currentIdx === -1) return;
    const nextIdx = (currentIdx + direction + featuredWorks.length) % featuredWorks.length;
    const next = featuredWorks[nextIdx];
    setLightboxImageLoaded(false);
    setLightbox({ work: next.work, member: next.member, originalIndex: next.originalIndex });
  };

  return (
    <>
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

        <div
          className="relative overflow-hidden cursor-pointer"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Left fade */}
          <div
            className="absolute left-0 top-0 bottom-0 w-24 md:w-40 z-10 pointer-events-none"
            style={{
              background:
                "linear-gradient(to right, var(--bg-secondary), transparent)",
            }}
          />
          {/* Right fade */}
          <div
            className="absolute right-0 top-0 bottom-0 w-24 md:w-40 z-10 pointer-events-none"
            style={{
              background:
                "linear-gradient(to left, var(--bg-secondary), transparent)",
            }}
          />

          <div
            ref={trackRef}
            className="flex gap-5 pb-4 will-change-transform"
            style={{ width: "max-content" }}
          >
            {duplicatedWorks.map((item, i) => {
              const uid = `${item.work.id}-${i}`;
              return (
                <motion.div
                  key={uid}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: Math.min(i * 0.05, 0.5) }}
                  className="flex-shrink-0 w-[300px] md:w-[400px] group/card"
                  onClick={() => handleCardClick(item)}
                >
                  <div
                    className="glass-card rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-xl"
                  >
                    <div className="relative aspect-[3/2] overflow-hidden">
                      <img
                        src={item.work.image}
                        alt={item.work.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
                        loading="lazy"
                      />
                      {/* Subtle gradient overlay on hover */}
                      <div
                        className="absolute inset-0 opacity-0 group-hover/card:opacity-20 transition-opacity duration-300"
                        style={{
                          background: `linear-gradient(135deg, ${item.member.accentColor}, transparent)`,
                        }}
                      />
                      {/* Member tag - always visible */}
                      <div className="absolute bottom-3 left-3">
                        <span
                          className="inline-block px-3 py-1.5 rounded-full text-white text-xs font-semibold backdrop-blur-sm"
                          style={{ background: `${item.member.accentColor}cc` }}
                        >
                          {item.member.firstName} · {item.member.role}
                        </span>
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
              );
            })}
          </div>
        </div>
      </section>

      {/* Full-size Lightbox Modal */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/90 backdrop-blur-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLightbox(null)}
            />

            {/* Close button */}
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-5 right-5 z-10 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Navigation arrows */}
            <button
              onClick={() => navigateLightbox(-1)}
              className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => navigateLightbox(1)}
              className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Content */}
            <motion.div
              key={lightbox.work.id}
              className="relative z-10 flex flex-col items-center max-w-[92vw] max-h-[92vh] w-full"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Image container */}
              <div className="relative w-full flex items-center justify-center" style={{ maxHeight: "72vh" }}>
                {!lightboxImageLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
                      style={{ borderColor: `${lightbox.member.accentColor}60`, borderTopColor: "transparent" }}
                    />
                  </div>
                )}
                <motion.img
                  src={lightbox.work.image.replace("w=600&h=400", "w=1400&h=900")}
                  alt={lightbox.work.title}
                  className="max-w-full max-h-[72vh] object-contain rounded-xl shadow-2xl"
                  style={{ opacity: lightboxImageLoaded ? 1 : 0, transition: "opacity 0.4s ease" }}
                  onLoad={() => setLightboxImageLoaded(true)}
                />
              </div>

              {/* Info bar */}
              <motion.div
                className="mt-5 w-full max-w-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 px-4"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.4 }}
              >
                <div className="flex items-center gap-4">
                  <img
                    src={lightbox.member.avatar}
                    alt={lightbox.member.firstName}
                    className="w-10 h-10 rounded-full object-cover"
                    style={{ boxShadow: `0 0 0 2px ${lightbox.member.accentColor}` }}
                  />
                  <div>
                    <h3 className="text-white text-lg font-semibold leading-tight">
                      {lightbox.work.title}
                    </h3>
                    <p className="text-white/60 text-sm">
                      by{" "}
                      <span style={{ color: lightbox.member.accentColor }} className="font-medium">
                        {lightbox.member.firstName}
                      </span>
                      {" · "}
                      {lightbox.member.role}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex gap-2 flex-wrap">
                    {lightbox.work.tools.map((tool) => (
                      <span
                        key={tool}
                        className="text-[11px] font-medium uppercase tracking-wider px-3 py-1 rounded-full bg-white/10 text-white/70"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={handleViewProject}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full text-white text-sm font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg whitespace-nowrap"
                    style={{
                      background: lightbox.member.accentColor,
                      boxShadow: `0 4px 20px ${lightbox.member.accentColor}40`,
                    }}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                    View Project
                  </button>
                </div>
              </motion.div>

              {/* Description */}
              <motion.p
                className="text-white/50 text-sm mt-3 max-w-3xl text-center px-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25, duration: 0.4 }}
              >
                {lightbox.work.description}
              </motion.p>

              {/* Keyboard hint */}
              <motion.div
                className="mt-4 flex items-center gap-4 text-white/30 text-xs"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.4 }}
              >
                <span className="flex items-center gap-1.5">
                  <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white/50 font-mono text-[10px]">←</kbd>
                  <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white/50 font-mono text-[10px]">→</kbd>
                  Navigate
                </span>
                <span className="flex items-center gap-1.5">
                  <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white/50 font-mono text-[10px]">ESC</kbd>
                  Close
                </span>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
