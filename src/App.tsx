import { useState, useEffect, useCallback } from "react";
import type { TeamMember } from "@/data/teamData";
import { DataProvider } from "@/context/DataContext";
import { LoadingScreen } from "@/components/LoadingScreen";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { SelectedWorksStrip } from "@/components/SelectedWorksStrip";
import { TeamGrid } from "@/components/TeamGrid";
import { MemberModal } from "@/components/MemberModal";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";
import { AdminPanel } from "@/components/admin/AdminPanel";

function AppContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [initialWorkIndex, setInitialWorkIndex] = useState(0);
  const [adminOpen, setAdminOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  // Check for #admin hash
  useEffect(() => {
    const checkHash = () => {
      if (window.location.hash === "#admin") {
        setAdminOpen(true);
        window.location.hash = "";
      }
    };
    checkHash();
    window.addEventListener("hashchange", checkHash);
    return () => window.removeEventListener("hashchange", checkHash);
  }, []);

  const toggleTheme = useCallback(() => setIsDark((prev) => !prev), []);

  const openMemberModal = useCallback((member: TeamMember, workIndex = 0) => {
    setSelectedMember(member);
    setInitialWorkIndex(workIndex);
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setTimeout(() => setSelectedMember(null), 500);
  }, []);

  const handleWorkClick = useCallback(
    (member: TeamMember, workIndex: number) => {
      openMemberModal(member, workIndex);
    },
    [openMemberModal]
  );

  return (
    <div
      className="min-h-screen transition-colors duration-500"
      style={{ background: "var(--bg-primary)", color: "var(--text-primary)" }}
    >
      <LoadingScreen isLoading={isLoading} />
      <Navbar isDark={isDark} toggleTheme={toggleTheme} />
      <Hero />
      <SelectedWorksStrip onWorkClick={handleWorkClick} />
      <TeamGrid onMemberClick={openMemberModal} />
      <ContactSection />
      <Footer onAdminClick={() => setAdminOpen(true)} />
      <MemberModal
        member={selectedMember}
        isOpen={modalOpen}
        onClose={closeModal}
        initialWorkIndex={initialWorkIndex}
      />
      <AdminPanel isOpen={adminOpen} onClose={() => setAdminOpen(false)} />
    </div>
  );
}

export function App() {
  return (
    <DataProvider>
      <AppContent />
    </DataProvider>
  );
}
