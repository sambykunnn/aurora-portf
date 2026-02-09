import { motion } from 'framer-motion';
import { Lightbulb, Zap, Check, Target } from 'lucide-react';

const strengths = [
  'Full multimedia range',
  'Multi-skilled members',
  'Unified aesthetic',
  'Shared creative direction'
];

export default function BehindTheBuild() {
  return (
    <section id="behind" className="py-24 sm:py-32 px-6 bg-gray-50/50 dark:bg-white/[0.02]">
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
            Behind the Build
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 via-pink-500 to-orange-400 mx-auto rounded-full" />
        </motion.div>

        {/* UVP Section */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 dark:from-indigo-500/20 dark:via-purple-500/20 dark:to-pink-500/20 border border-purple-200/50 dark:border-purple-500/20 overflow-hidden">
            {/* Background glow */}
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-purple-500/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-pink-500/20 rounded-full blur-3xl" />
            
            <div className="relative flex items-start gap-4 mb-6">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                  Our UVP: Rotating Leadership + Multi-Disciplinary Skills
                </h3>
              </div>
            </div>
            <p className="relative text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              Aurora stands out because we combine individual expertise with a flexible workflow. Whoever's specialty fits the project becomes the lead, while the rest support through creative feedback and production work.
            </p>
          </div>
        </motion.div>

        {/* Two column grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Why It Works */}
          <motion.div
            className="group p-8 rounded-3xl bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/10"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-gradient-to-br from-orange-400 to-pink-500">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Why It Works
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              This system mirrors real studios: adaptable, collaborative, and dynamic.
            </p>
          </motion.div>

          {/* Our Strengths */}
          <motion.div
            className="group p-8 rounded-3xl bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Our Strengths
            </h3>
            <ul className="space-y-3">
              {strengths.map((strength, index) => {
                const colors = ['text-indigo-500', 'text-purple-500', 'text-pink-500', 'text-orange-500'];
                return (
                  <li key={index} className="flex items-center gap-3">
                    <div className={`p-1 rounded-full bg-gradient-to-r from-indigo-500/20 to-pink-500/20`}>
                      <Check className={`w-4 h-4 ${colors[index]}`} />
                    </div>
                    <span className="text-gray-600 dark:text-gray-400">{strength}</span>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        </div>

        {/* Impact */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-orange-400/10 dark:from-purple-500/20 dark:via-pink-500/20 dark:to-orange-400/20 border border-pink-200/50 dark:border-pink-500/20 overflow-hidden">
            {/* Background glow */}
            <div className="absolute -top-20 -left-20 w-60 h-60 bg-purple-500/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-orange-400/20 rounded-full blur-3xl" />
            
            <div className="relative flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  Impact
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                  We produce consistent, high-quality work across different mediums — from photos and videos to design, modeling, and animation.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
