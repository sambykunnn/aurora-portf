import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { teamMembers as defaultTeamMembers, type TeamMember } from "@/data/teamData";

/* ─── Types ─── */

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

/* File-based mapping: each member id → filename (without .json) */
const MEMBER_FILE_MAP: Record<string, string> = {
  gian: "gian-carlo",
  sergs: "sergs",
  lorie: "lorie-jane",
  rica: "rica-mea",
  erin: "erin",
};

export function getMemberFileName(memberId: string): string {
  return MEMBER_FILE_MAP[memberId] || memberId;
}

interface DataContextType {
  siteContent: SiteContent;
  teamMembers: TeamMember[];
  updateSiteContent: (content: Partial<SiteContent>) => void;
  updateTeamMembers: (members: TeamMember[]) => void;
  updateTeamMember: (id: string, member: Partial<TeamMember>) => void;
  resetToDefaults: () => void;
  dataSource: "default" | "localStorage" | "data.json";
}

const DataContext = createContext<DataContextType | null>(null);

const SITE_KEY = "aurora_site_content";
const TEAM_KEY = "aurora_team_members";
const DATA_SOURCE_KEY = "aurora_data_source";
const DATA_VERSION_KEY = "aurora_data_version";
const CURRENT_DATA_VERSION = "3"; // Bump to force-clear old data

// Clear stale data from previous versions
(() => {
  try {
    const v = localStorage.getItem(DATA_VERSION_KEY);
    if (v !== CURRENT_DATA_VERSION) {
      localStorage.removeItem(SITE_KEY);
      localStorage.removeItem(TEAM_KEY);
      localStorage.removeItem(DATA_SOURCE_KEY);
      // Clean up old GitHub keys
      localStorage.removeItem("aurora_github_config");
      localStorage.removeItem("aurora_last_deploy");
      localStorage.setItem(DATA_VERSION_KEY, CURRENT_DATA_VERSION);
    }
  } catch { /* ignore */ }
})();

/* ─── Provider ─── */

export function DataProvider({ children }: { children: ReactNode }) {
  const [dataLoaded, setDataLoaded] = useState(false);
  const [dataSource, setDataSource] = useState<"default" | "localStorage" | "data.json">("default");

  const [siteContent, setSiteContent] = useState<SiteContent>(() => {
    try {
      const saved = localStorage.getItem(SITE_KEY);
      if (saved) return { ...defaultSiteContent, ...JSON.parse(saved) };
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

  /* ─── Load data from /data/ folder on mount ─── */
  useEffect(() => {
    async function loadData() {
      const hasLocalSite = localStorage.getItem(SITE_KEY);
      const hasLocalTeam = localStorage.getItem(TEAM_KEY);

      // Try fetching from /data/ folder (deployed files in GitHub)
      try {
        const siteResp = await fetch("/data/site.json");
        if (siteResp.ok) {
          const ct = siteResp.headers.get("content-type") || "";
          if (ct.includes("json")) {
            const site = await siteResp.json();
            if (!hasLocalSite) {
              setSiteContent({ ...defaultSiteContent, ...site });
            }

            // Load team index
            const indexResp = await fetch("/data/team/index.json");
            if (indexResp.ok) {
              const index = await indexResp.json();
              const memberFileNames: string[] = index.members || [];

              const memberPromises = memberFileNames.map(async (fileName: string) => {
                try {
                  const resp = await fetch(`/data/team/${fileName}.json`);
                  if (resp.ok) {
                    const raw = await resp.json();
                    // Normalize shortName → firstName
                    if (!raw.firstName && raw.shortName) raw.firstName = raw.shortName;
                    if (!raw.accentColorRGB && raw.accentColor) {
                      const hex = raw.accentColor;
                      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                      if (result) raw.accentColorRGB = `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`;
                    }
                    return raw as TeamMember;
                  }
                } catch { /* ignore */ }
                return null;
              });

              const members = (await Promise.all(memberPromises)).filter(Boolean) as TeamMember[];
              if (members.length > 0 && !hasLocalTeam) {
                setTeamMembers(members);
              }
            }

            if (!localStorage.getItem(DATA_SOURCE_KEY)) {
              setDataSource("data.json");
              localStorage.setItem(DATA_SOURCE_KEY, "data.json");
            }
            setDataLoaded(true);
            return;
          }
        }
      } catch { /* data files don't exist */ }

      // Fallback: localStorage / defaults
      if (hasLocalSite || hasLocalTeam) {
        setDataSource("localStorage");
      } else {
        setDataSource("default");
      }
      setDataLoaded(true);
    }
    loadData();
  }, []);

  // Persist to localStorage
  useEffect(() => {
    if (!dataLoaded) return;
    localStorage.setItem(SITE_KEY, JSON.stringify(siteContent));
  }, [siteContent, dataLoaded]);

  useEffect(() => {
    if (!dataLoaded) return;
    localStorage.setItem(TEAM_KEY, JSON.stringify(teamMembers));
  }, [teamMembers, dataLoaded]);

  /* ─── Update functions ─── */

  const updateSiteContent = useCallback((content: Partial<SiteContent>) => {
    setSiteContent((prev) => ({ ...prev, ...content }));
    setDataSource("localStorage");
  }, []);

  const updateTeamMembers = useCallback((members: TeamMember[]) => {
    setTeamMembers(members);
    setDataSource("localStorage");
  }, []);

  const updateTeamMember = useCallback((id: string, updates: Partial<TeamMember>) => {
    setTeamMembers((prev) => prev.map((m) => (m.id === id ? { ...m, ...updates } : m)));
    setDataSource("localStorage");
  }, []);

  const resetToDefaults = useCallback(() => {
    setSiteContent(defaultSiteContent);
    setTeamMembers(defaultTeamMembers);
    localStorage.removeItem(SITE_KEY);
    localStorage.removeItem(TEAM_KEY);
    localStorage.removeItem(DATA_SOURCE_KEY);
    setDataSource("default");
  }, []);

  return (
    <DataContext.Provider
      value={{
        siteContent, teamMembers,
        updateSiteContent, updateTeamMembers, updateTeamMember, resetToDefaults,
        dataSource,
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
