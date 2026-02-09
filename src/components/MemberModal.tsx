import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, ExternalLink, FolderOpen, User } from "lucide-react";
import type { TeamMember } from "@/data/teamData";
import { GalleryCard } from "./GalleryCard";
import { ProjectView } from "./ProjectView";

interface MemberModalProps {
  member: TeamMember | null;
  isOpen: boolean;
  onClose: () => void;
  initialWorkIndex?: number;
}

type ModalTab = "portfolio" | "about";

export function MemberModal({ member, isOpen, onClose, initialWorkIndex }: MemberModalProps) {
  const [activeWorkIndex, setActiveWorkIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<ModalTab>("portfolio");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (activeWorkIndex !== null) {
          setActiveWorkIndex(null);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose, activeWorkIndex]);

  // Auto-open project view when initialWorkIndex is provided
  useEffect(() => {
    if (isOpen && initialWorkIndex !== undefined && initialWorkIndex >= 0) {
      setActiveWorkIndex(initialWorkIndex);
    }
  }, [isOpen, initialWorkIndex]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setActiveWorkIndex(null);
      setActiveTab("portfolio");
    }
  }, [isOpen]);

  // Scroll to top when switching views or tabs
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [activeWorkIndex, activeTab]);

  const handleBack = () => {
    setActiveWorkIndex(null);
  };

  return (
    <AnimatePresence>
      {isOpen && member && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60]"
            style={{ background: "var(--overlay-bg)" }}
            onClick={() => {
              if (activeWorkIndex !== null) {
                setActiveWorkIndex(null);
              } else {
                onClose();
              }
            }}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: "100%", filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: "100%", filter: "blur(10px)" }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed inset-0 md:inset-4 lg:inset-8 z-[70] modal-glass rounded-none md:rounded-3xl overflow-hidden flex flex-col"
          >
            {/* Header — only show when in gallery/about view (not project view) */}
            <AnimatePresence>
              {activeWorkIndex === null && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0"
                >
                  {/* Top bar with member info */}
                  <div
                    className="flex items-center justify-between px-6 md:px-10 py-5"
                    style={{ borderBottom: "1px solid var(--divider)" }}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="w-10 h-10 rounded-xl overflow-hidden"
                        style={{ boxShadow: `0 0 0 2px ${member.accentColor}` }}
                      >
                        {member.avatar ? (
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div
                            className="w-full h-full flex items-center justify-center text-white font-bold text-sm"
                            style={{ background: member.accentColor }}
                          >
                            {member.firstName.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <h3
                          className="text-base font-semibold"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {member.name}
                        </h3>
                        <p className="text-sm font-medium" style={{ color: member.accentColor }}>
                          {member.role}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={onClose}
                      className="p-2.5 rounded-xl transition-colors hover:bg-[var(--bg-tertiary)]"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      <X size={20} />
                    </button>
                  </div>

                  {/* Tab bar */}
                  <div
                    className="flex px-6 md:px-10 gap-1"
                    style={{ borderBottom: "1px solid var(--divider)" }}
                  >
                    <button
                      onClick={() => setActiveTab("portfolio")}
                      className="flex items-center gap-2 px-5 py-3 text-sm font-medium transition-all duration-200 border-b-2 -mb-px"
                      style={{
                        borderColor: activeTab === "portfolio" ? member.accentColor : "transparent",
                        color: activeTab === "portfolio" ? "var(--text-primary)" : "var(--text-tertiary)",
                      }}
                    >
                      <FolderOpen size={15} />
                      Portfolio
                      {member.works.length > 0 && (
                        <span
                          className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                          style={{
                            background: activeTab === "portfolio" ? `${member.accentColor}15` : "var(--bg-tertiary)",
                            color: activeTab === "portfolio" ? member.accentColor : "var(--text-tertiary)",
                          }}
                        >
                          {member.works.length}
                        </span>
                      )}
                    </button>
                    <button
                      onClick={() => setActiveTab("about")}
                      className="flex items-center gap-2 px-5 py-3 text-sm font-medium transition-all duration-200 border-b-2 -mb-px"
                      style={{
                        borderColor: activeTab === "about" ? member.accentColor : "transparent",
                        color: activeTab === "about" ? "var(--text-primary)" : "var(--text-tertiary)",
                      }}
                    >
                      <User size={15} />
                      About
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Close button for project view */}
            {activeWorkIndex !== null && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-30 p-2 rounded-xl glass transition-colors hover:bg-[var(--bg-tertiary)]"
                style={{ color: "var(--text-secondary)" }}
              >
                <X size={18} />
              </button>
            )}

            {/* Content */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto hide-scrollbar">
              <AnimatePresence mode="wait">
                {activeWorkIndex !== null && member.works[activeWorkIndex] ? (
                  <motion.div
                    key="project-view"
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="h-full"
                  >
                    <ProjectView
                      work={member.works[activeWorkIndex]}
                      member={member}
                      onBack={handleBack}
                    />
                  </motion.div>
                ) : activeTab === "portfolio" ? (
                  <motion.div
                    key="portfolio-view"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="max-w-6xl mx-auto px-6 md:px-10 py-8 md:py-12">
                      {member.works.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                          {member.works.map((work, idx) => (
                            <GalleryCard
                              key={work.id}
                              work={work}
                              accentColor={member.accentColor}
                              index={idx}
                              onViewProject={() => setActiveWorkIndex(idx)}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-20">
                          <FolderOpen
                            size={48}
                            className="mb-4 opacity-20"
                            style={{ color: "var(--text-tertiary)" }}
                          />
                          <p
                            className="text-lg font-semibold mb-1"
                            style={{ color: "var(--text-secondary)" }}
                          >
                            No works yet
                          </p>
                          <p
                            className="text-sm"
                            style={{ color: "var(--text-tertiary)" }}
                          >
                            Works will appear here once added via the admin panel.
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="about-view"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="max-w-6xl mx-auto px-6 md:px-10 py-8 md:py-12">
                      <div className="grid md:grid-cols-3 gap-8 md:gap-12">
                        {/* Bio */}
                        <div className="md:col-span-2">
                          <p
                            className="text-2xl md:text-3xl lg:text-4xl font-light leading-relaxed"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {member.tagline}
                          </p>
                          <div className="mt-6 flex flex-wrap gap-2">
                            {member.skills.map((skill) => (
                              <span
                                key={skill}
                                className="text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full"
                                style={{
                                  background: `${member.accentColor}15`,
                                  color: member.accentColor,
                                }}
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Contact & Socials */}
                        <div className="space-y-6">
                          <div>
                            <p
                              className="text-xs font-semibold uppercase tracking-[0.15em] mb-2"
                              style={{ color: "var(--text-tertiary)" }}
                            >
                              Get in touch
                            </p>
                            <a
                              href={`mailto:${member.email}`}
                              className="flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-80"
                              style={{ color: member.accentColor }}
                            >
                              <Mail size={14} />
                              {member.email}
                            </a>
                          </div>

                          <div>
                            <p
                              className="text-xs font-semibold uppercase tracking-[0.15em] mb-2"
                              style={{ color: "var(--text-tertiary)" }}
                            >
                              Socials
                            </p>
                            <div className="flex flex-col gap-1.5">
                              {member.socials.map((social) => (
                                <a
                                  key={social.platform}
                                  href={social.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-80"
                                  style={{ color: "var(--text-primary)" }}
                                >
                                  <ExternalLink size={12} style={{ color: "var(--text-tertiary)" }} />
                                  {social.platform}
                                </a>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
