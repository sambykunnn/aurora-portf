import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from "react";
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

export type SyncStatus = "idle" | "saving" | "syncing" | "success" | "error";

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
  isGitHubConfigured: boolean;
  // Unified save: localStorage + GitHub
  saveToGitHub: () => Promise<{ success: boolean; message: string }>;
  pushToGitHub: (site?: SiteContent, team?: TeamMember[]) => Promise<{ success: boolean; message: string }>;
  loadFromGitHub: () => Promise<{ success: boolean; message: string }>;
  syncStatus: SyncStatus;
  syncMessage: string;
  isDeploying: boolean;
  lastDeployTime: string | null;
  dataSource: "default" | "localStorage" | "github" | "data.json";
}

const DataContext = createContext<DataContextType | null>(null);

const SITE_KEY = "aurora_site_content";
const TEAM_KEY = "aurora_team_members";
const GITHUB_KEY = "aurora_github_config";
const DEPLOY_TIME_KEY = "aurora_last_deploy";
const DATA_SOURCE_KEY = "aurora_data_source";

/* ─── GitHub API helpers ─── */

async function githubApiRequest(
  url: string,
  token: string,
  options: RequestInit = {}
): Promise<Response> {
  return fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
}

async function getFileSha(config: GitHubConfig): Promise<string | null> {
  try {
    const response = await githubApiRequest(
      `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${config.filePath}?ref=${config.branch}`,
      config.token
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

async function getFileContent(config: GitHubConfig): Promise<{ content: string; sha: string } | null> {
  try {
    const response = await githubApiRequest(
      `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${config.filePath}?ref=${config.branch}`,
      config.token
    );
    if (response.ok) {
      const data = await response.json();
      // GitHub returns base64 encoded content
      const decoded = decodeURIComponent(escape(atob(data.content.replace(/\n/g, ""))));
      return { content: decoded, sha: data.sha };
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

    const response = await githubApiRequest(
      `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${config.filePath}`,
      config.token,
      {
        method: "PUT",
        body: JSON.stringify(body),
      }
    );

    if (response.ok) {
      return { success: true, message: "✓ Saved to GitHub — Vercel will auto-deploy." };
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
  const [dataSource, setDataSource] = useState<"default" | "localStorage" | "github" | "data.json">("default");

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
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("idle");
  const [syncMessage, setSyncMessage] = useState("");
  const [lastDeployTime, setLastDeployTime] = useState<string | null>(() => {
    return localStorage.getItem(DEPLOY_TIME_KEY);
  });

  const isGitHubConfigured = Boolean(githubConfig.owner && githubConfig.repo && githubConfig.token);

  // Track latest state for GitHub push (avoids stale closure issues)
  const siteContentRef = useRef(siteContent);
  const teamMembersRef = useRef(teamMembers);
  const githubConfigRef = useRef(githubConfig);

  useEffect(() => { siteContentRef.current = siteContent; }, [siteContent]);
  useEffect(() => { teamMembersRef.current = teamMembers; }, [teamMembers]);
  useEffect(() => { githubConfigRef.current = githubConfig; }, [githubConfig]);

  // ─── Load data on mount ───
  useEffect(() => {
    async function loadData() {
      const hasLocalSite = localStorage.getItem(SITE_KEY);
      const hasLocalTeam = localStorage.getItem(TEAM_KEY);
      const savedSource = localStorage.getItem(DATA_SOURCE_KEY);

      // If we have GitHub config, try loading from GitHub API first
      const ghConfig = githubConfigRef.current;
      if (ghConfig.owner && ghConfig.repo && ghConfig.token) {
        try {
          const fileData = await getFileContent(ghConfig);
          if (fileData) {
            const parsed = JSON.parse(fileData.content);
            if (parsed.siteContent) {
              setSiteContent({ ...defaultSiteContent, ...parsed.siteContent });
              localStorage.setItem(SITE_KEY, JSON.stringify(parsed.siteContent));
            }
            if (parsed.teamMembers) {
              setTeamMembers(parsed.teamMembers);
              localStorage.setItem(TEAM_KEY, JSON.stringify(parsed.teamMembers));
            }
            setDataSource("github");
            localStorage.setItem(DATA_SOURCE_KEY, "github");
            setDataLoaded(true);
            return;
          }
        } catch {
          // Fall through to other loading methods
        }
      }

      // Try /data.json (deployed file)
      try {
        const response = await fetch("/data.json");
        if (response.ok) {
          const contentType = response.headers.get("content-type") || "";
          if (contentType.includes("application/json")) {
            const data = await response.json();
            if (!hasLocalSite && data.siteContent) {
              setSiteContent({ ...defaultSiteContent, ...data.siteContent });
            }
            if (!hasLocalTeam && data.teamMembers) {
              setTeamMembers(data.teamMembers);
            }
            if (!savedSource) {
              setDataSource("data.json");
              localStorage.setItem(DATA_SOURCE_KEY, "data.json");
            }
            setDataLoaded(true);
            return;
          }
        }
      } catch {
        // data.json doesn't exist
      }

      // Use localStorage or defaults
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

  useEffect(() => {
    localStorage.setItem(GITHUB_KEY, JSON.stringify(githubConfig));
  }, [githubConfig]);

  const updateSiteContent = useCallback((content: Partial<SiteContent>) => {
    setSiteContent((prev) => ({ ...prev, ...content }));
    setDataSource("localStorage");
  }, []);

  const updateTeamMembers = useCallback((members: TeamMember[]) => {
    setTeamMembers(members);
    setDataSource("localStorage");
  }, []);

  const updateTeamMember = useCallback((id: string, updates: Partial<TeamMember>) => {
    setTeamMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updates } : m))
    );
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

  const setGitHubConfig = useCallback((config: GitHubConfig) => {
    setGitHubConfigState(config);
  }, []);

  // Push current data to GitHub
  const pushToGitHub = useCallback(async (
    site?: SiteContent,
    team?: TeamMember[]
  ): Promise<{ success: boolean; message: string }> => {
    const config = githubConfigRef.current;
    if (!config.owner || !config.repo || !config.token) {
      return { success: false, message: "GitHub not configured. Go to Deploy tab to set up." };
    }

    setSyncStatus("syncing");
    setSyncMessage("Pushing to GitHub...");

    try {
      const dataPayload = JSON.stringify(
        {
          siteContent: site || siteContentRef.current,
          teamMembers: team || teamMembersRef.current,
          _lastUpdated: new Date().toISOString(),
        },
        null,
        2
      );

      const sha = await getFileSha(config);
      const result = await commitFileToGitHub(config, dataPayload, sha);

      if (result.success) {
        const now = new Date().toLocaleString();
        setLastDeployTime(now);
        localStorage.setItem(DEPLOY_TIME_KEY, now);
        setDataSource("github");
        localStorage.setItem(DATA_SOURCE_KEY, "github");
        setSyncStatus("success");
        setSyncMessage(result.message);
        // Auto-clear success status after 5s
        setTimeout(() => {
          setSyncStatus("idle");
          setSyncMessage("");
        }, 5000);
      } else {
        setSyncStatus("error");
        setSyncMessage(result.message);
        setTimeout(() => {
          setSyncStatus("idle");
          setSyncMessage("");
        }, 8000);
      }

      return result;
    } catch (err) {
      const msg = `Push failed: ${err instanceof Error ? err.message : "Unknown error"}`;
      setSyncStatus("error");
      setSyncMessage(msg);
      setTimeout(() => { setSyncStatus("idle"); setSyncMessage(""); }, 8000);
      return { success: false, message: msg };
    }
  }, []);

  // Load data from GitHub API
  const loadFromGitHub = useCallback(async (): Promise<{ success: boolean; message: string }> => {
    const config = githubConfigRef.current;
    if (!config.owner || !config.repo || !config.token) {
      return { success: false, message: "GitHub not configured." };
    }

    setSyncStatus("syncing");
    setSyncMessage("Loading from GitHub...");

    try {
      const fileData = await getFileContent(config);
      if (!fileData) {
        setSyncStatus("error");
        setSyncMessage("data.json not found in repo. Save first to create it.");
        setTimeout(() => { setSyncStatus("idle"); setSyncMessage(""); }, 5000);
        return { success: false, message: "File not found in repo." };
      }

      const parsed = JSON.parse(fileData.content);
      if (parsed.siteContent) {
        setSiteContent({ ...defaultSiteContent, ...parsed.siteContent });
        localStorage.setItem(SITE_KEY, JSON.stringify(parsed.siteContent));
      }
      if (parsed.teamMembers) {
        setTeamMembers(parsed.teamMembers);
        localStorage.setItem(TEAM_KEY, JSON.stringify(parsed.teamMembers));
      }
      setDataSource("github");
      localStorage.setItem(DATA_SOURCE_KEY, "github");
      setSyncStatus("success");
      setSyncMessage("Data loaded from GitHub!");
      setTimeout(() => { setSyncStatus("idle"); setSyncMessage(""); }, 5000);
      return { success: true, message: "Data loaded from GitHub!" };
    } catch (err) {
      const msg = `Load failed: ${err instanceof Error ? err.message : "Unknown error"}`;
      setSyncStatus("error");
      setSyncMessage(msg);
      setTimeout(() => { setSyncStatus("idle"); setSyncMessage(""); }, 8000);
      return { success: false, message: msg };
    }
  }, []);

  // Legacy saveToGitHub (same as pushToGitHub)
  const saveToGitHub = useCallback(async (): Promise<{ success: boolean; message: string }> => {
    setIsDeploying(true);
    const result = await pushToGitHub();
    setIsDeploying(false);
    return result;
  }, [pushToGitHub]);

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
        isGitHubConfigured,
        saveToGitHub,
        pushToGitHub,
        loadFromGitHub,
        syncStatus,
        syncMessage,
        isDeploying,
        lastDeployTime,
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
