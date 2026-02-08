import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import type { TeamMember } from "@/data/teamData";
import { useData } from "@/context/DataContext";

interface TeamGridProps {
  onMemberClick: (member: TeamMember) => void;
}

export function TeamGrid({ onMemberClick }: TeamGridProps) {
  const { teamMembers, siteContent } = useData();
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <section
      id="team"
      ref={sectionRef}
      className="relative py-24 md:py-32 px-6"
      style={{ background: "var(--bg-primary)" }}
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 md:mb-20"
        >
          <p
            className="text-sm font-semibold uppercase tracking-[0.2em] mb-3"
            style={{ color: "var(--text-tertiary)" }}
          >
            {siteContent.teamSectionSubtitle}
          </p>
          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            {siteContent.teamSectionTitle}
          </h2>
          <p
            className="text-lg md:text-xl max-w-xl mx-auto"
            style={{ color: "var(--text-secondary)" }}
          >
            {siteContent.teamSectionDescription}
          </p>
        </motion.div>

        {/* Grid: 3 top, 2 bottom centered */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {teamMembers.slice(0, 3).map((member, i) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.12 }}
              className="cursor-pointer group"
              onMouseEnter={() => setHoveredId(member.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => onMemberClick(member)}
            >
              <TeamCard member={member} isHovered={hoveredId === member.id} />
            </motion.div>
          ))}
        </div>
        {teamMembers.length > 3 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6 mt-5 md:mt-6 max-w-4xl mx-auto">
            {teamMembers.slice(3, 5).map((member, i) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: (i + 3) * 0.12 }}
                className="cursor-pointer group"
                onMouseEnter={() => setHoveredId(member.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => onMemberClick(member)}
              >
                <TeamCard member={member} isHovered={hoveredId === member.id} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function TeamCard({ member, isHovered }: { member: TeamMember; isHovered: boolean }) {
  return (
    <div
      className="glass-card rounded-3xl p-6 md:p-8 transition-all duration-500 relative overflow-hidden"
      style={{
        boxShadow: isHovered
          ? `0 8px 40px rgba(${member.accentColorRGB}, 0.25), 0 0 0 1px rgba(${member.accentColorRGB}, 0.15)`
          : `0 4px 20px var(--glass-shadow)`,
        transform: isHovered ? "translateY(-6px)" : "translateY(0)",
      }}
    >
      {/* Accent glow */}
      <div
        className="absolute -top-20 -right-20 w-40 h-40 rounded-full transition-opacity duration-500 blur-3xl"
        style={{
          background: member.accentColor,
          opacity: isHovered ? 0.15 : 0,
        }}
      />

      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-5">
          <div
            className="w-14 h-14 rounded-2xl overflow-hidden transition-all duration-500"
            style={{
              boxShadow: isHovered ? `0 0 0 2px ${member.accentColor}` : "0 0 0 2px transparent",
            }}
          >
            <img
              src={member.avatar}
              alt={member.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
          <div>
            <h3
              className="text-base font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              {member.firstName}
            </h3>
            <p
              className="text-sm transition-colors duration-300"
              style={{ color: isHovered ? member.accentColor : "var(--text-secondary)" }}
            >
              {member.role}
            </p>
          </div>
        </div>

        <p
          className="text-sm leading-relaxed mb-5"
          style={{ color: "var(--text-secondary)" }}
        >
          {member.tagline}
        </p>

        {/* Skills preview */}
        <div className="flex flex-wrap gap-2">
          {member.skills.slice(0, 3).map((skill) => (
            <span
              key={skill}
              className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full transition-all duration-300"
              style={{
                background: isHovered ? `${member.accentColor}18` : "var(--bg-tertiary)",
                color: isHovered ? member.accentColor : "var(--text-tertiary)",
              }}
            >
              {skill}
            </span>
          ))}
        </div>

        {/* Hover CTA */}
        <motion.div
          initial={false}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 5 }}
          transition={{ duration: 0.3 }}
          className="mt-4 text-xs font-semibold uppercase tracking-[0.15em]"
          style={{ color: member.accentColor }}
        >
          View Portfolio →
        </motion.div>
      </div>
    </div>
  );
}
