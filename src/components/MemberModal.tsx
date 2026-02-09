import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, ExternalLink, FolderOpen, ArrowLeft } from "lucide-react";
import type { TeamMember } from "@/data/teamData";
import { GalleryCard } from "./GalleryCard";
import { ProjectView } from "./ProjectView";

interface MemberModalProps {
  member: TeamMember | null;
  isOpen: boolean;
  onClose: () => void;
  initialWorkIndex?: number;
}

const accentColors: Record<string, { gradient: string; bgLight: string }> = {
  indigo: { gradient: 'from-indigo-500 to-blue-500', bgLight: 'bg-indigo-500/10' },
  pink: { gradient: 'from-pink-500 to-rose-500', bgLight: 'bg-pink-500/10' },
  amber: { gradient: 'from-amber-500 to-orange-500', bgLight: 'bg-amber-500/10' },
  emerald: { gradient: 'from-emerald-500 to-teal-500', bgLight: 'bg-emerald-500/10' },
  violet: { gradient: 'from-violet-500 to-purple-500', bgLight: 'bg-violet-500/10' }
};

export function MemberModal({ member, isOpen, onClose, initialWorkIndex }: MemberModalProps) {
  const [activeWorkIndex, setActiveWorkIndex] = useState<number | null>(null);
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
    }
  }, [isOpen]);

  // Scroll to top when switching views
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [activeWorkIndex]);

  const handleBack = () => {
    setActiveWorkIndex(null);
  };

  if (!member) return null;

  const colors = accentColors[member.accentColor] || accentColors.indigo;

  return (
    <AnimatePresence>
      {isOpen && (
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
            {/* Header — only show when in main view (not project view) */}
            <AnimatePresence>
              {activeWorkIndex === null && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0"
                  style={{ borderBottom: "1px solid var(--divider)" }}
                >
                  <div className="flex items-center justify-between px-6 md:px-10 py-5">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-12 h-12 rounded-xl overflow-hidden ring-2"
                        style={{ '--tw-ring-color': member.accentColor } as React.CSSProperties}
                      >
                        {member.avatar ? (
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div
                            className={`w-full h-full flex items-center justify-center text-white font-bold text-lg bg-gradient-to-br ${colors.gradient}`}
                          >
                            {member.firstName.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <h3
                          className="text-lg font-bold"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {member.name}
                        </h3>
                        <p 
                          className="text-sm font-semibold" 
                          style={{ color: member.accentColor }}
                        >
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
                </motion.div>
              )}
            </AnimatePresence>

            {/* Close button for project view */}
            {activeWorkIndex !== null && (
              <div className="absolute top-4 right-4 z-30 flex gap-2">
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl glass transition-colors hover:bg-[var(--bg-tertiary)]"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <ArrowLeft size={16} />
                  <span className="text-sm font-medium">Back</span>
                </button>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl glass transition-colors hover:bg-[var(--bg-tertiary)]"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <X size={18} />
                </button>
              </div>
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
                ) : (
                  <motion.div
                    key="main-view"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Combined Profile & Portfolio View */}
                    <div className="max-w-6xl mx-auto px-6 md:px-10 py-8 md:py-12">
                      
                      {/* About Section */}
                      <div className="mb-12">
                        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
                          {/* Bio */}
                          <div className="md:col-span-2">
                            <p
                              className="text-2xl md:text-3xl font-light leading-relaxed"
                              style={{ color: "var(--text-primary)" }}
                            >
                              {member.tagline || `${member.role} at Aurora Studio`}
                            </p>
                            <div className="mt-6 flex flex-wrap gap-2">
                              {member.skills.map((skill) => (
                                <span
                                  key={skill}
                                  className={`text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full ${colors.bgLight}`}
                                  style={{ color: member.accentColor }}
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Contact & Socials */}
                          <div className="space-y-6">
                            {member.email && (
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
                            )}

                            {member.socials && member.socials.length > 0 && (
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
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Divider */}
                      <div 
                        className="h-px w-full mb-10"
                        style={{ background: "var(--divider)" }}
                      />

                      {/* Portfolio Section */}
                      <div>
                        <div className="flex items-center justify-between mb-8">
                          <div className="flex items-center gap-3">
                            <FolderOpen size={20} style={{ color: member.accentColor }} />
                            <h4 
                              className="text-xl font-bold"
                              style={{ color: "var(--text-primary)" }}
                            >
                              Portfolio
                            </h4>
                            {member.works.length > 0 && (
                              <span
                                className={`text-xs font-bold px-2 py-1 rounded-full ${colors.bgLight}`}
                                style={{ color: member.accentColor }}
                              >
                                {member.works.length} {member.works.length === 1 ? 'work' : 'works'}
                              </span>
                            )}
                          </div>
                        </div>

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
                          <div className="flex flex-col items-center justify-center py-16 rounded-2xl border-2 border-dashed" style={{ borderColor: "var(--divider)" }}>
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
                              className="text-sm text-center max-w-xs"
                              style={{ color: "var(--text-tertiary)" }}
                            >
                              Portfolio works will appear here once added via the admin panel.
                            </p>
                          </div>
                        )}
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
