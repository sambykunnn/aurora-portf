import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, ExternalLink } from "lucide-react";
import type { TeamMember } from "@/data/teamData";
import { GalleryCard } from "./GalleryCard";

interface MemberModalProps {
  member: TeamMember | null;
  isOpen: boolean;
  onClose: () => void;
  initialWorkIndex?: number;
}

export function MemberModal({ member, isOpen, onClose, initialWorkIndex: _initialWorkIndex }: MemberModalProps) {
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

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

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
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: "100%", filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: "100%", filter: "blur(10px)" }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed inset-0 md:inset-4 lg:inset-8 z-[70] modal-glass rounded-none md:rounded-3xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div
              className="flex-shrink-0 flex items-center justify-between px-6 md:px-10 py-5 border-b"
              style={{ borderColor: "var(--divider)" }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-10 h-10 rounded-xl overflow-hidden ring-2"
                  style={{ boxShadow: `0 0 0 2px ${member.accentColor}` }}
                >
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
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

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto hide-scrollbar">
              <div className="max-w-6xl mx-auto px-6 md:px-10 py-8 md:py-12">
                {/* Bio section */}
                <div className="grid md:grid-cols-3 gap-8 md:gap-12 mb-12 md:mb-16">
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

                  <div className="space-y-4">
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

                {/* Gallery */}
                <div>
                  <div className="flex items-center gap-3 mb-8">
                    <div
                      className="w-1 h-6 rounded-full"
                      style={{ background: member.accentColor }}
                    />
                    <h4
                      className="text-xl font-semibold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      Portfolio
                    </h4>
                    <span
                      className="text-sm font-medium"
                      style={{ color: "var(--text-tertiary)" }}
                    >
                      {member.works.length} works
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {member.works.map((work, idx) => (
                      <GalleryCard
                        key={work.id}
                        work={work}
                        accentColor={member.accentColor}
                        index={idx}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
