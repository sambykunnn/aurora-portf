import { motion } from 'framer-motion';
import { Users, Repeat, Sparkles } from 'lucide-react';

const cards = [
  {
    icon: Users,
    title: 'Who We Are',
    description: 'Aurora is a collaborative multimedia studio of five creatives with different strengths but shared vision.',
    gradient: 'from-indigo-500 to-purple-500',
    glow: 'group-hover:shadow-indigo-500/25'
  },
  {
    icon: Repeat,
    title: 'How We Work',
    description: 'We use rotating leadership — the member best suited for a project leads, and everyone contributes across disciplines.',
    gradient: 'from-purple-500 to-pink-500',
    glow: 'group-hover:shadow-purple-500/25'
  },
  {
    icon: Sparkles,
    title: 'What Makes Us Unique',
    description: 'We are multi-skilled artists capable of delivering complete multimedia campaigns with unified aesthetic direction.',
    gradient: 'from-pink-500 to-orange-400',
    glow: 'group-hover:shadow-pink-500/25'
  }
];

export default function AboutUs() {
  return (
    <section id="about" className="py-24 sm:py-32 px-6">
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
            About Us
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 via-pink-500 to-orange-400 mx-auto rounded-full" />
        </motion.div>

        {/* Cards grid */}
        <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
          {cards.map((card, index) => (
            <motion.div
              key={card.title}
              className="group relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {/* Card */}
              <div className={`relative h-full p-8 rounded-3xl bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-xl ${card.glow}`}>
                {/* Icon */}
                <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-br ${card.gradient} mb-6`}>
                  <card.icon className="w-6 h-6 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {card.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {card.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
