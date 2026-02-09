import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Menu, X } from "lucide-react";
import { useData } from "@/context/DataContext";

interface NavbarProps {
  isDark: boolean;
  toggleTheme: () => void;
}

export function Navbar({ isDark, toggleTheme }: NavbarProps) {
  const { siteContent } = useData();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Behind the Build", href: "#behind" },
    { label: "Works", href: "#works" },
    { label: "Team", href: "#team" },
    { label: "Contact", href: "#contact" },
  ];

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${
          scrolled ? "w-[92%] max-w-3xl" : "w-[95%] max-w-4xl"
        }`}
      >
        <div
          className={`glass rounded-2xl px-5 py-3 flex items-center justify-between transition-all duration-500 ${
            scrolled ? "shadow-lg" : "shadow-sm"
          }`}
        >
          <button onClick={() => scrollTo("#hero")} className="flex items-center gap-2 group">
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 via-pink-500 to-orange-400 bg-clip-text text-transparent">
              {siteContent.studioName}
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 opacity-60 group-hover:opacity-100 transition-opacity">
              Studio
            </span>
          </button>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => scrollTo(link.href)}
                className="px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300 hover:bg-[var(--bg-tertiary)]"
                style={{ color: "var(--text-secondary)" }}
              >
                {link.label}
              </button>
            ))}
            <div className="w-px h-5 mx-2" style={{ background: "var(--divider)" }} />
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl transition-all duration-300 hover:bg-[var(--bg-tertiary)]"
              style={{ color: "var(--text-secondary)" }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isDark ? "moon" : "sun"}
                  initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.3 }}
                >
                  {isDark ? <Sun size={18} /> : <Moon size={18} />}
                </motion.div>
              </AnimatePresence>
            </button>
          </div>

          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl transition-all duration-300"
              style={{ color: "var(--text-secondary)" }}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-xl transition-all duration-300"
              style={{ color: "var(--text-secondary)" }}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="glass rounded-2xl mt-2 p-4 md:hidden"
            >
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => scrollTo(link.href)}
                  className="block w-full text-left px-4 py-3 text-base font-medium rounded-xl transition-colors hover:bg-[var(--bg-tertiary)]"
                  style={{ color: "var(--text-primary)" }}
                >
                  {link.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}
