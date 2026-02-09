import { motion } from 'framer-motion';
import { useData } from '../context/DataContext';

interface TeamGridProps {
  onMemberClick: (memberId: string) => void;
}

const accentColors: Record<string, string> = {
  indigo: 'from-indigo-500 to-blue-500',
  pink: 'from-pink-500 to-rose-500',
  amber: 'from-amber-500 to-orange-500',
  emerald: 'from-emerald-500 to-teal-500',
  violet: 'from-violet-500 to-purple-500'
};

const accentGlows: Record<string, string> = {
  indigo: 'group-hover:shadow-indigo-500/25',
  pink: 'group-hover:shadow-pink-500/25',
  amber: 'group-hover:shadow-amber-500/25',
  emerald: 'group-hover:shadow-emerald-500/25',
  violet: 'group-hover:shadow-violet-500/25'
};

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
          <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full mb-6" />
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Explore the work of each Aurora creatives — photography, modeling, design, animation, and video production — all unified through collaborative vision and rotating leadership.
          </p>
        </motion.div>

        {/* Team grid - 6 column system for alignment */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
          {teamMembers.map((member, index) => {
            const isTopRow = index < 3;
            const isBottomRow = index >= 3;
            
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
                <div className={`relative h-full p-6 rounded-3xl bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-2xl ${accentGlows[member.accentColor]}`}>
                  {/* Accent gradient line */}
                  <div className={`absolute top-0 left-8 right-8 h-1 rounded-full bg-gradient-to-r ${accentColors[member.accentColor]} opacity-0 group-hover:opacity-100 transition-opacity`} />
                  
                  {/* Avatar */}
                  <div className="relative w-20 h-20 mx-auto mb-4">
                    {member.avatar ? (
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <div className={`w-full h-full rounded-full bg-gradient-to-br ${accentColors[member.accentColor]} flex items-center justify-center`}>
                        <span className="text-2xl font-bold text-white">
                          {member.firstName.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      {member.name}
                    </h3>
                    <p className={`text-sm font-medium bg-gradient-to-r ${accentColors[member.accentColor]} bg-clip-text text-transparent mb-3`}>
                      {member.role}
                    </p>
                    
                    {/* Skills preview */}
                    <div className="flex flex-wrap justify-center gap-1.5 mb-4">
                      {member.skills.slice(0, 3).map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-400"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* CTA */}
                    <div className={`inline-flex items-center gap-1 text-sm font-medium bg-gradient-to-r ${accentColors[member.accentColor]} bg-clip-text text-transparent opacity-0 group-hover:opacity-100 transition-opacity`}>
                      View Portfolio
                      <span>→</span>
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
