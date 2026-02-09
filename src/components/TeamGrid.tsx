import { motion } from 'framer-motion';
import { useData } from '../context/DataContext';

interface TeamGridProps {
  onMemberClick: (memberId: string) => void;
}

export default function TeamGrid({ onMemberClick }: TeamGridProps) {
  const { teamMembers } = useData();

  return (
    <section id="team" className="py-24 sm:py-32 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Meet the Team
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 via-pink-500 to-amber-500 mx-auto rounded-full mb-6" />
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Explore the work of each Aurora creatives — photography, modeling, design, animation, and video production — all unified through collaborative vision and rotating leadership.
          </p>
        </motion.div>

        {/* Team grid - 6 column system for alignment */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
          {teamMembers.map((member, index) => {
            const isTopRow = index < 3;
            const isBottomRow = index >= 3;
            // Use the actual accent color from member settings
            const accentColor = member.accentColor || '#6366f1';
            
            return (
              <motion.div
                key={member.id}
                className={`group cursor-pointer ${
                  isTopRow 
                    ? 'lg:col-span-2' 
                    : isBottomRow && index === 3
                      ? 'lg:col-span-2 lg:col-start-2'
                      : 'lg:col-span-2'
                } ${!isTopRow && index === 3 ? 'md:col-span-1' : ''}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={() => onMemberClick(member.id)}
              >
                <div 
                  className="relative h-full p-6 rounded-3xl bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 transition-all duration-500 group-hover:scale-[1.03] group-hover:shadow-2xl"
                  style={{
                    '--accent': accentColor,
                    '--accent-10': `${accentColor}1a`,
                    '--accent-20': `${accentColor}33`,
                    '--accent-40': `${accentColor}66`,
                  } as React.CSSProperties}
                >
                  {/* Accent gradient line */}
                  <div 
                    className="absolute top-0 left-8 right-8 h-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
                    style={{ background: accentColor }}
                  />
                  
                  {/* Colored background glow on hover */}
                  <div 
                    className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                    style={{ background: accentColor }}
                  />
                  
                  {/* Colored border glow on hover */}
                  <div 
                    className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ 
                      boxShadow: `0 0 0 2px ${accentColor}40, 0 20px 40px -10px ${accentColor}30`
                    }}
                  />
                  
                  {/* Avatar */}
                  <div className="relative w-24 h-24 mx-auto mb-5">
                    {/* Glow behind avatar on hover */}
                    <div 
                      className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md"
                      style={{ background: accentColor }}
                    />
                    {member.avatar ? (
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="relative w-full h-full rounded-full object-cover border-2 transition-all duration-300"
                        style={{ 
                          borderColor: 'transparent',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.borderColor = accentColor}
                        onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}
                      />
                    ) : (
                      <div 
                        className="relative w-full h-full rounded-full flex items-center justify-center shadow-lg"
                        style={{ background: accentColor }}
                      >
                        <span className="text-3xl font-bold text-white">
                          {member.firstName.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="relative text-center">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {member.name}
                    </h3>
                    
                    {/* Role badge with member's accent color */}
                    <div 
                      className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4"
                      style={{ background: accentColor }}
                    >
                      <span className="text-sm font-semibold text-white">
                        {member.role}
                      </span>
                    </div>
                    
                    {/* Skills preview */}
                    <div className="flex flex-wrap justify-center gap-1.5 mb-5">
                      {member.skills.slice(0, 3).map((skill) => (
                        <span
                          key={skill}
                          className="px-2.5 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-400"
                        >
                          {skill}
                        </span>
                      ))}
                      {member.skills.length > 3 && (
                        <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-500">
                          +{member.skills.length - 3}
                        </span>
                      )}
                    </div>

                    {/* CTA */}
                    <div 
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300"
                      style={{ 
                        borderColor: `${accentColor}50`,
                        color: accentColor,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = accentColor;
                        e.currentTarget.style.color = 'white';
                        e.currentTarget.style.borderColor = accentColor;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = accentColor;
                        e.currentTarget.style.borderColor = `${accentColor}50`;
                      }}
                    >
                      View Portfolio
                      <span className="transition-transform group-hover:translate-x-1">→</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
