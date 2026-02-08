import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
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

export interface GitHubConfig {
  owner: string;
  repo: string;
  branch: string;
  token: string;
  filePath: string;
}

const DEFAULT_GITHUB_CONFIG: GitHubConfig = {
  owner: "",
  repo: "",
  branch: "main",
  token: "",
  filePath: "public/data.json",
};

interface DataContextType {
  siteContent: SiteContent;
  teamMembers: TeamMember[];
  updateSiteContent: (content: Partial<SiteContent>) => void;
  updateTeamMembers: (members: TeamMember[]) => void;
  updateTeamMember: (id: string, member: Partial<TeamMember>) => void;
  resetToDefaults: () => void;
  // GitHub integration
  githubConfig: GitHubConfig;
  setGitHubConfig: (config: GitHubConfig) => void;
  saveToGitHub: () => Promise<{ success: boolean; message: string }>;
  isDeploying: boolean;
  lastDeployTime: string | null;
}

const DataContext = createContext<DataContextType | null>(null);

const SITE_KEY = "aurora_site_content";
const TEAM_KEY = "aurora_team_members";
const GITHUB_KEY = "aurora_github_config";
const DEPLOY_TIME_KEY = "aurora_last_deploy";

/* ─── GitHub API helpers ─── */

async function getFileSha(config: GitHubConfig): Promise<string | null> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${config.filePath}?ref=${config.branch}`,
      {
        headers: {
          Authorization: `Bearer ${config.token}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );
    if (response.ok) {
      const data = await response.json();
      return data.sha;
    }
    return null;
  } catch {
    return null;
  }
}

async function commitFileToGitHub(
  config: GitHubConfig,
  content: string,
  sha: string | null
): Promise<{ success: boolean; message: string }> {
  try {
    const body: Record<string, string> = {
      message: `chore: update site data — ${new Date().toISOString()}`,
      content: btoa(unescape(encodeURIComponent(content))),
      branch: config.branch,
    };
    if (sha) {
      body.sha = sha;
    }

    const response = await fetch(
      `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${config.filePath}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${config.token}`,
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    if (response.ok) {
      return { success: true, message: "Changes committed to GitHub! Vercel will auto-deploy." };
    }

    const errorData = await response.json();
    return {
      success: false,
      message: `GitHub API error: ${errorData.message || response.statusText}`,
    };
  } catch (err) {
    return {
      success: false,
      message: `Network error: ${err instanceof Error ? err.message : "Unknown error"}`,
    };
  }
}

/* ─── Provider ─── */

export function DataProvider({ children }: { children: ReactNode }) {
  const [dataLoaded, setDataLoaded] = useState(false);

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

  const [githubConfig, setGitHubConfigState] = useState<GitHubConfig>(() => {
    try {
      const saved = localStorage.getItem(GITHUB_KEY);
      if (saved) return { ...DEFAULT_GITHUB_CONFIG, ...JSON.parse(saved) };
    } catch { /* ignore */ }
    return DEFAULT_GITHUB_CONFIG;
  });

  const [isDeploying, setIsDeploying] = useState(false);
  const [lastDeployTime, setLastDeployTime] = useState<string | null>(() => {
    return localStorage.getItem(DEPLOY_TIME_KEY);
  });

  // On mount, try to load data.json from public folder (deployed data)
  useEffect(() => {
    async function loadDeployedData() {
      try {
        const response = await fetch("/data.json");
        if (response.ok) {
          const contentType = response.headers.get("content-type") || "";
          if (contentType.includes("application/json")) {
            const data = await response.json();
            // Only use deployed data if there's no localStorage override
            const hasLocalSite = localStorage.getItem(SITE_KEY);
            const hasLocalTeam = localStorage.getItem(TEAM_KEY);

            if (!hasLocalSite && data.siteContent) {
              setSiteContent({ ...defaultSiteContent, ...data.siteContent });
            }
            if (!hasLocalTeam && data.teamMembers) {
              setTeamMembers(data.teamMembers);
            }
          }
        }
      } catch {
        // data.json doesn't exist yet, use defaults
      }
      setDataLoaded(true);
    }
    loadDeployedData();
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

  useEffect(() => {
    localStorage.setItem(GITHUB_KEY, JSON.stringify(githubConfig));
  }, [githubConfig]);

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

  const setGitHubConfig = (config: GitHubConfig) => {
    setGitHubConfigState(config);
  };

  const saveToGitHub = useCallback(async (): Promise<{ success: boolean; message: string }> => {
    if (!githubConfig.owner || !githubConfig.repo || !githubConfig.token) {
      return { success: false, message: "GitHub configuration incomplete. Please fill in owner, repo, and token." };
    }

    setIsDeploying(true);
    try {
      // Build the full data payload
      const dataPayload = JSON.stringify(
        { siteContent, teamMembers },
        null,
        2
      );

      // Get existing file SHA (needed for updates)
      const sha = await getFileSha(githubConfig);

      // Commit the file
      const result = await commitFileToGitHub(githubConfig, dataPayload, sha);

      if (result.success) {
        const now = new Date().toLocaleString();
        setLastDeployTime(now);
        localStorage.setItem(DEPLOY_TIME_KEY, now);
      }

      return result;
    } catch (err) {
      return {
        success: false,
        message: `Deploy failed: ${err instanceof Error ? err.message : "Unknown error"}`,
      };
    } finally {
      setIsDeploying(false);
    }
  }, [githubConfig, siteContent, teamMembers]);

  return (
    <DataContext.Provider
      value={{
        siteContent,
        teamMembers,
        updateSiteContent,
        updateTeamMembers,
        updateTeamMember,
        resetToDefaults,
        githubConfig,
        setGitHubConfig,
        saveToGitHub,
        isDeploying,
        lastDeployTime,
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
