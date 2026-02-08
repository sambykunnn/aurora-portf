import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { teamMembers as defaultTeamMembers, type TeamMember } from "@/data/teamData";

export interface SiteContent {
  studioName: string;
  studioTagline: string;
  heroSubtitle: string;
  heroDescription: string;
  contactEmail: string;
  contactHeading: string;
  contactDescription: string;
  disciplines: string[];
  teamSectionTitle: string;
  teamSectionSubtitle: string;
  teamSectionDescription: string;
  worksSectionTitle: string;
  worksSectionSubtitle: string;
}

export const defaultSiteContent: SiteContent = {
  studioName: "Aurora",
  studioTagline: "Creative Multimedia Studio",
  heroSubtitle: "We design, animate, capture, and create.",
  heroDescription: "Five creatives. One vision.",
  contactEmail: "hello@aurorastudio.com",
  contactHeading: "Let's Create",
  contactDescription: "Have a project in mind? We'd love to hear from you.",
  disciplines: ["Design", "3D", "Video", "Modelling", "Photo"],
  teamSectionTitle: "Meet the Team",
  teamSectionSubtitle: "The Collective",
  teamSectionDescription: "Five creatives, each mastering their craft.",
  worksSectionTitle: "Selected Works",
  worksSectionSubtitle: "Portfolio",
};

interface DataContextType {
  siteContent: SiteContent;
  teamMembers: TeamMember[];
  updateSiteContent: (content: Partial<SiteContent>) => void;
  updateTeamMembers: (members: TeamMember[]) => void;
  updateTeamMember: (id: string, member: Partial<TeamMember>) => void;
  resetToDefaults: () => void;
}

const DataContext = createContext<DataContextType | null>(null);

const SITE_KEY = "aurora_site_content";
const TEAM_KEY = "aurora_team_members";

export function DataProvider({ children }: { children: ReactNode }) {
  const [siteContent, setSiteContent] = useState<SiteContent>(() => {
    try {
      const saved = localStorage.getItem(SITE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...defaultSiteContent, ...parsed };
      }
    } catch { /* ignore */ }
    return defaultSiteContent;
  });

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() => {
    try {
      const saved = localStorage.getItem(TEAM_KEY);
      if (saved) return JSON.parse(saved);
    } catch { /* ignore */ }
    return defaultTeamMembers;
  });

  useEffect(() => {
    localStorage.setItem(SITE_KEY, JSON.stringify(siteContent));
  }, [siteContent]);

  useEffect(() => {
    localStorage.setItem(TEAM_KEY, JSON.stringify(teamMembers));
  }, [teamMembers]);

  const updateSiteContent = (content: Partial<SiteContent>) => {
    setSiteContent((prev) => ({ ...prev, ...content }));
  };

  const updateTeamMembers = (members: TeamMember[]) => {
    setTeamMembers(members);
  };

  const updateTeamMember = (id: string, updates: Partial<TeamMember>) => {
    setTeamMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updates } : m))
    );
  };

  const resetToDefaults = () => {
    setSiteContent(defaultSiteContent);
    setTeamMembers(defaultTeamMembers);
    localStorage.removeItem(SITE_KEY);
    localStorage.removeItem(TEAM_KEY);
  };

  return (
    <DataContext.Provider
      value={{
        siteContent,
        teamMembers,
        updateSiteContent,
        updateTeamMembers,
        updateTeamMember,
        resetToDefaults,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}
