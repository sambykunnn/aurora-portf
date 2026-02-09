import { motion } from 'framer-motion';
import { Mail, Instagram, Facebook } from 'lucide-react';

export default function ContactSection() {
  return (
    <section id="contact" className="py-24 sm:py-32 px-6 bg-gray-50/50 dark:bg-white/[0.02]">
      <div className="max-w-3xl mx-auto text-center">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Let's Work Together
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 via-pink-500 to-orange-400 mx-auto rounded-full mb-6" />
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-12">
            For inquiries or collaborations:
          </p>
        </motion.div>

        {/* Email */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <a
            href="mailto:aurora.studio.team@gmail.com"
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300"
          >
            <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-medium text-gray-900 dark:text-white">
              aurora.studio.team@gmail.com
            </span>
          </a>
        </motion.div>

        {/* Socials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <p className="text-sm text-gray-500 dark:text-gray-500 mb-4 uppercase tracking-wider">
            Socials
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="https://instagram.com/aurora.studio"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 px-6 py-3 rounded-xl bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 hover:scale-105 hover:shadow-lg hover:shadow-pink-500/10 transition-all duration-300"
            >
              <Instagram className="w-5 h-5 text-pink-500" />
              <span className="font-medium text-gray-700 dark:text-gray-300">IG</span>
            </a>
            <a
              href="https://facebook.com/aurora.studio"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 px-6 py-3 rounded-xl bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300"
            >
              <Facebook className="w-5 h-5 text-indigo-500" />
              <span className="font-medium text-gray-700 dark:text-gray-300">FB</span>
            </a>
            <a
              href="https://tiktok.com/@aurora.studio"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 px-6 py-3 rounded-xl bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300"
            >
              <svg className="w-5 h-5 text-purple-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
              </svg>
              <span className="font-medium text-gray-700 dark:text-gray-300">TikTok</span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
