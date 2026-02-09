import { motion, AnimatePresence } from "framer-motion";
import { useData } from "@/context/DataContext";

interface LoadingScreenProps {
  isLoading: boolean;
}

export function LoadingScreen({ isLoading }: LoadingScreenProps) {
  const { siteContent } = useData();

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(10px)" }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{ background: "var(--bg-primary)" }}
        >
          {/* Background aurora glow */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute top-1/3 left-1/4 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl"
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <motion.div
              className="absolute top-1/2 right-1/3 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl"
              animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.3, 0.5] }}
              transition={{ duration: 3.5, repeat: Infinity }}
            />
            <motion.div
              className="absolute bottom-1/3 left-1/3 w-56 h-56 bg-pink-500/20 rounded-full blur-3xl"
              animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.6, 0.4] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <motion.div
              className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-orange-400/20 rounded-full blur-3xl"
              animate={{ scale: [1.1, 1, 1.1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 3.2, repeat: Infinity }}
            />
          </div>

          <div className="relative flex flex-col items-center gap-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative"
            >
              <motion.h1
                className="text-5xl md:text-7xl font-bold tracking-tight"
              >
                <span className="bg-gradient-to-r from-indigo-500 via-purple-500 via-pink-500 to-orange-400 bg-clip-text text-transparent">
                  {siteContent.studioName}
                </span>
              </motion.h1>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.2, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="h-[2px] mt-3 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 via-pink-500 to-orange-400"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex gap-2"
            >
              {[0, 1, 2, 3, 4].map((i) => {
                const colors = ['bg-indigo-500', 'bg-purple-500', 'bg-pink-500', 'bg-rose-500', 'bg-orange-400'];
                return (
                  <motion.div
                    key={i}
                    className={`w-2 h-2 rounded-full ${colors[i]}`}
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.4, 1, 0.4],
                    }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      delay: i * 0.15,
                      ease: "easeInOut",
                    }}
                  />
                );
              })}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
