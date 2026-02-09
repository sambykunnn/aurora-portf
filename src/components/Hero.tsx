import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient orbs - Aurora colors */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute top-1/3 right-1/3 w-80 h-80 bg-violet-500/25 rounded-full blur-3xl"
          animate={{
            x: [0, -30, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/25 rounded-full blur-3xl"
          animate={{
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute bottom-1/3 left-1/3 w-72 h-72 bg-orange-400/20 rounded-full blur-3xl"
          animate={{
            x: [0, 40, 0],
            y: [0, -40, 0],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-fuchsia-500/15 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        {/* Main wordmark */}
        <motion.h1
          className="text-7xl sm:text-8xl md:text-9xl font-bold tracking-tight mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span className="bg-gradient-to-r from-indigo-500 via-purple-500 via-pink-500 to-orange-400 bg-clip-text text-transparent">
            AURORA
          </span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          className="text-2xl sm:text-3xl md:text-4xl font-light text-gray-700 dark:text-gray-300 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Five Creatives. One Studio.
        </motion.p>

        {/* Description */}
        <motion.p
          className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          A creative multimedia collective with rotating leadership. We specialize in design, animation, photography, modeling, and video — working together to create modern, story-driven visuals.
        </motion.p>

        {/* Discipline tags */}
        <motion.div
          className="flex flex-wrap justify-center gap-3 mt-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          {['Design', 'Animation', 'Photography', 'Modeling', 'Video'].map((discipline, index) => {
            const colors = [
              'from-indigo-500/20 to-indigo-500/5 border-indigo-500/30 text-indigo-600 dark:text-indigo-400',
              'from-purple-500/20 to-purple-500/5 border-purple-500/30 text-purple-600 dark:text-purple-400',
              'from-pink-500/20 to-pink-500/5 border-pink-500/30 text-pink-600 dark:text-pink-400',
              'from-rose-500/20 to-rose-500/5 border-rose-500/30 text-rose-600 dark:text-rose-400',
              'from-orange-500/20 to-orange-500/5 border-orange-500/30 text-orange-600 dark:text-orange-400',
            ];
            return (
              <span
                key={discipline}
                className={`px-4 py-2 text-sm font-medium rounded-full bg-gradient-to-r ${colors[index]} backdrop-blur-sm border`}
              >
                {discipline}
              </span>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
