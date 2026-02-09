import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from "react";
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

export interface GitHubConfig {
  owner: string;
  repo: string;
  branch: string;
  token: string;
}

const DEFAULT_GITHUB_CONFIG: GitHubConfig = {
  owner: "",
  repo: "",
  branch: "main",
  token: "",
};

/* File-based mapping: each member id → filename (without .json) */
const MEMBER_FILE_MAP: Record<string, string> = {
  gian: "gian-carlo",
  sergs: "sergs",
  lorie: "lorie-jane",
  rica: "rica-mea",
  erin: "erin",
};

function getMemberFileName(memberId: string): string {
  return MEMBER_FILE_MAP[memberId] || memberId;
}

export type SyncStatus = "idle" | "saving" | "syncing" | "success" | "error";

interface FileChangeTracker {
  site: boolean;
  members: Set<string>; // member IDs that have changed
}

interface DataContextType {
  siteContent: SiteContent;
  teamMembers: TeamMember[];
  updateSiteContent: (content: Partial<SiteContent>) => void;
  updateTeamMembers: (members: TeamMember[]) => void;
  updateTeamMember: (id: string, member: Partial<TeamMember>) => void;
  resetToDefaults: () => void;
  // GitHub
  githubConfig: GitHubConfig;
  setGitHubConfig: (config: GitHubConfig) => void;
  isGitHubConfigured: boolean;
  // File-based GitHub ops
  saveToGitHub: () => Promise<{ success: boolean; message: string }>;
  pushToGitHub: (site?: SiteContent, team?: TeamMember[]) => Promise<{ success: boolean; message: string }>;
  pushSiteToGitHub: (site: SiteContent) => Promise<{ success: boolean; message: string }>;
  pushMemberToGitHub: (member: TeamMember) => Promise<{ success: boolean; message: string }>;
  loadFromGitHub: () => Promise<{ success: boolean; message: string }>;
  syncStatus: SyncStatus;
  syncMessage: string;
  isDeploying: boolean;
  lastDeployTime: string | null;
  dataSource: "default" | "localStorage" | "github" | "data.json";
  // File structure info
  fileStructure: { path: string; description: string }[];
  changedFiles: FileChangeTracker;
}

const DataContext = createContext<DataContextType | null>(null);

const SITE_KEY = "aurora_site_content";
const TEAM_KEY = "aurora_team_members";
const GITHUB_KEY = "aurora_github_config";
const DEPLOY_TIME_KEY = "aurora_last_deploy";
const DATA_SOURCE_KEY = "aurora_data_source";

/* ─── GitHub API helpers ─── */

async function ghApi(url: string, token: string, options: RequestInit = {}): Promise<Response> {
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

async function getFileSha(config: GitHubConfig, filePath: string): Promise<string | null> {
  try {
    const r = await ghApi(
      `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${filePath}?ref=${config.branch}`,
      config.token
    );
    if (r.ok) {
      const d = await r.json();
      return d.sha;
    }
    return null;
  } catch {
    return null;
  }
}

async function getFileContent(config: GitHubConfig, filePath: string): Promise<{ content: string; sha: string } | null> {
  try {
    const r = await ghApi(
      `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${filePath}?ref=${config.branch}`,
      config.token
    );
    if (r.ok) {
      const d = await r.json();
      const decoded = decodeURIComponent(escape(atob(d.content.replace(/\n/g, ""))));
      return { content: decoded, sha: d.sha };
    }
    return null;
  } catch {
    return null;
  }
}

async function commitFile(
  config: GitHubConfig,
  filePath: string,
  content: string,
  message: string
): Promise<{ success: boolean; message: string }> {
  try {
    const sha = await getFileSha(config, filePath);
    const body: Record<string, string> = {
      message,
      content: btoa(unescape(encodeURIComponent(content))),
      branch: config.branch,
    };
    if (sha) body.sha = sha;

    const r = await ghApi(
      `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${filePath}`,
      config.token,
      { method: "PUT", body: JSON.stringify(body) }
    );

    if (r.ok) {
      return { success: true, message: `✓ Updated ${filePath}` };
    }
    const err = await r.json();
    return { success: false, message: `GitHub error on ${filePath}: ${err.message || r.statusText}` };
  } catch (err) {
    return { success: false, message: `Network error: ${err instanceof Error ? err.message : "Unknown"}` };
  }
}

/* ─── Provider ─── */

export function DataProvider({ children }: { children: ReactNode }) {
  const [dataLoaded, setDataLoaded] = useState(false);
  const [dataSource, setDataSource] = useState<"default" | "localStorage" | "github" | "data.json">("default");

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
  const [lastDeployTime, setLastDeployTime] = useState<string | null>(() => localStorage.getItem(DEPLOY_TIME_KEY));
  const [changedFiles, setChangedFiles] = useState<FileChangeTracker>({ site: false, members: new Set() });

  const isGitHubConfigured = Boolean(githubConfig.owner && githubConfig.repo && githubConfig.token);

  // Refs for latest state
  const siteRef = useRef(siteContent);
  const teamRef = useRef(teamMembers);
  const ghRef = useRef(githubConfig);

  useEffect(() => { siteRef.current = siteContent; }, [siteContent]);
  useEffect(() => { teamRef.current = teamMembers; }, [teamMembers]);
  useEffect(() => { ghRef.current = githubConfig; }, [githubConfig]);

  /* ─── File structure info ─── */
  const fileStructure = [
    { path: "public/data/site.json", description: "Site settings (studio name, hero text, section titles, contact info)" },
    { path: "public/data/team/index.json", description: "Team member file manifest (list of member filenames)" },
    ...teamMembers.map((m) => ({
      path: `public/data/team/${getMemberFileName(m.id)}.json`,
      description: `${m.name} — ${m.role} (profile, skills, works, content blocks)`,
    })),
  ];

  /* ─── Load data on mount ─── */
  useEffect(() => {
    async function loadData() {
      const hasLocalSite = localStorage.getItem(SITE_KEY);
      const hasLocalTeam = localStorage.getItem(TEAM_KEY);
      const config = ghRef.current;

      // Priority 1: GitHub API (if configured)
      if (config.owner && config.repo && config.token) {
        try {
          // Load site.json
          const siteFile = await getFileContent(config, "public/data/site.json");
          if (siteFile) {
            const site = JSON.parse(siteFile.content);
            setSiteContent({ ...defaultSiteContent, ...site });
            localStorage.setItem(SITE_KEY, JSON.stringify(site));
          }

          // Load team index
          const indexFile = await getFileContent(config, "public/data/team/index.json");
          if (indexFile) {
            const index = JSON.parse(indexFile.content);
            const memberFileNames: string[] = index.members || [];

            // Load each member file
            const memberPromises = memberFileNames.map(async (fileName: string) => {
              const file = await getFileContent(config, `public/data/team/${fileName}.json`);
              if (file) {
                return JSON.parse(file.content) as TeamMember;
              }
              return null;
            });

            const members = (await Promise.all(memberPromises)).filter(Boolean) as TeamMember[];
            if (members.length > 0) {
              setTeamMembers(members);
              localStorage.setItem(TEAM_KEY, JSON.stringify(members));
            }
          }

          setDataSource("github");
          localStorage.setItem(DATA_SOURCE_KEY, "github");
          setDataLoaded(true);
          return;
        } catch {
          // Fall through
        }
      }

      // Priority 2: Fetch from /data/ folder (deployed files)
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
                  if (resp.ok) return (await resp.json()) as TeamMember;
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

      // Priority 3: localStorage / defaults
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

  /* ─── Update functions ─── */

  const updateSiteContent = useCallback((content: Partial<SiteContent>) => {
    setSiteContent((prev) => ({ ...prev, ...content }));
    setChangedFiles((prev) => ({ ...prev, site: true }));
    setDataSource("localStorage");
  }, []);

  const updateTeamMembers = useCallback((members: TeamMember[]) => {
    setTeamMembers(members);
    // Mark all members as changed
    setChangedFiles((prev) => ({
      ...prev,
      members: new Set(members.map((m) => m.id)),
    }));
    setDataSource("localStorage");
  }, []);

  const updateTeamMember = useCallback((id: string, updates: Partial<TeamMember>) => {
    setTeamMembers((prev) => prev.map((m) => (m.id === id ? { ...m, ...updates } : m)));
    setChangedFiles((prev) => {
      const newMembers = new Set(prev.members);
      newMembers.add(id);
      return { ...prev, members: newMembers };
    });
    setDataSource("localStorage");
  }, []);

  const resetToDefaults = useCallback(() => {
    setSiteContent(defaultSiteContent);
    setTeamMembers(defaultTeamMembers);
    localStorage.removeItem(SITE_KEY);
    localStorage.removeItem(TEAM_KEY);
    localStorage.removeItem(DATA_SOURCE_KEY);
    setDataSource("default");
    setChangedFiles({ site: false, members: new Set() });
  }, []);

  const setGitHubConfig = useCallback((config: GitHubConfig) => {
    setGitHubConfigState(config);
  }, []);

  /* ─── GitHub Push: individual files ─── */

  // Push site.json only
  const pushSiteToGitHub = useCallback(async (site: SiteContent): Promise<{ success: boolean; message: string }> => {
    const config = ghRef.current;
    if (!config.owner || !config.repo || !config.token) {
      return { success: false, message: "GitHub not configured." };
    }

    setSyncStatus("syncing");
    setSyncMessage("Pushing site.json...");

    const content = JSON.stringify(site, null, 2);
    const result = await commitFile(config, "public/data/site.json", content, `update: site settings — ${new Date().toISOString()}`);

    if (result.success) {
      setSyncStatus("success");
      setSyncMessage("✓ site.json updated");
      setChangedFiles((prev) => ({ ...prev, site: false }));
      const now = new Date().toLocaleString();
      setLastDeployTime(now);
      localStorage.setItem(DEPLOY_TIME_KEY, now);
      setTimeout(() => { setSyncStatus("idle"); setSyncMessage(""); }, 5000);
    } else {
      setSyncStatus("error");
      setSyncMessage(result.message);
      setTimeout(() => { setSyncStatus("idle"); setSyncMessage(""); }, 8000);
    }
    return result;
  }, []);

  // Push a single member file
  const pushMemberToGitHub = useCallback(async (member: TeamMember): Promise<{ success: boolean; message: string }> => {
    const config = ghRef.current;
    if (!config.owner || !config.repo || !config.token) {
      return { success: false, message: "GitHub not configured." };
    }

    const fileName = getMemberFileName(member.id);
    setSyncStatus("syncing");
    setSyncMessage(`Pushing ${fileName}.json...`);

    const content = JSON.stringify(member, null, 2);
    const result = await commitFile(
      config,
      `public/data/team/${fileName}.json`,
      content,
      `update: ${member.firstName} profile — ${new Date().toISOString()}`
    );

    if (result.success) {
      setSyncStatus("success");
      setSyncMessage(`✓ ${fileName}.json updated`);
      setChangedFiles((prev) => {
        const newMembers = new Set(prev.members);
        newMembers.delete(member.id);
        return { ...prev, members: newMembers };
      });
      const now = new Date().toLocaleString();
      setLastDeployTime(now);
      localStorage.setItem(DEPLOY_TIME_KEY, now);
      setTimeout(() => { setSyncStatus("idle"); setSyncMessage(""); }, 5000);
    } else {
      setSyncStatus("error");
      setSyncMessage(result.message);
      setTimeout(() => { setSyncStatus("idle"); setSyncMessage(""); }, 8000);
    }
    return result;
  }, []);

  // Push ALL files (site.json + team index + all member files)
  const pushToGitHub = useCallback(async (
    site?: SiteContent,
    team?: TeamMember[]
  ): Promise<{ success: boolean; message: string }> => {
    const config = ghRef.current;
    if (!config.owner || !config.repo || !config.token) {
      return { success: false, message: "GitHub not configured." };
    }

    const siteData = site || siteRef.current;
    const teamData = team || teamRef.current;

    setSyncStatus("syncing");
    setSyncMessage("Pushing all files to GitHub...");

    const errors: string[] = [];
    let successCount = 0;

    // 1. Push site.json
    setSyncMessage("Pushing site.json...");
    const siteResult = await commitFile(
      config, "public/data/site.json",
      JSON.stringify(siteData, null, 2),
      `update: site settings — ${new Date().toISOString()}`
    );
    if (siteResult.success) successCount++;
    else errors.push(siteResult.message);

    // 2. Push team/index.json
    const memberFileNames = teamData.map((m) => getMemberFileName(m.id));
    setSyncMessage("Pushing team/index.json...");
    const indexResult = await commitFile(
      config, "public/data/team/index.json",
      JSON.stringify({ members: memberFileNames }, null, 2),
      `update: team index — ${new Date().toISOString()}`
    );
    if (indexResult.success) successCount++;
    else errors.push(indexResult.message);

    // 3. Push each member file
    for (const member of teamData) {
      const fileName = getMemberFileName(member.id);
      setSyncMessage(`Pushing team/${fileName}.json...`);
      const memberResult = await commitFile(
        config, `public/data/team/${fileName}.json`,
        JSON.stringify(member, null, 2),
        `update: ${member.firstName} — ${new Date().toISOString()}`
      );
      if (memberResult.success) successCount++;
      else errors.push(memberResult.message);
    }

    const totalFiles = 2 + teamData.length;
    const now = new Date().toLocaleString();
    setLastDeployTime(now);
    localStorage.setItem(DEPLOY_TIME_KEY, now);
    setDataSource("github");
    localStorage.setItem(DATA_SOURCE_KEY, "github");
    setChangedFiles({ site: false, members: new Set() });

    if (errors.length === 0) {
      setSyncStatus("success");
      setSyncMessage(`✓ All ${totalFiles} files pushed successfully`);
      setTimeout(() => { setSyncStatus("idle"); setSyncMessage(""); }, 5000);
      return { success: true, message: `✓ All ${totalFiles} files pushed to GitHub — Vercel will auto-deploy.` };
    } else {
      setSyncStatus("error");
      const msg = `${successCount}/${totalFiles} files pushed. Errors: ${errors.join("; ")}`;
      setSyncMessage(msg);
      setTimeout(() => { setSyncStatus("idle"); setSyncMessage(""); }, 10000);
      return { success: false, message: msg };
    }
  }, []);

  // Load from GitHub (individual files)
  const loadFromGitHub = useCallback(async (): Promise<{ success: boolean; message: string }> => {
    const config = ghRef.current;
    if (!config.owner || !config.repo || !config.token) {
      return { success: false, message: "GitHub not configured." };
    }

    setSyncStatus("syncing");
    setSyncMessage("Loading files from GitHub...");

    try {
      // Load site.json
      setSyncMessage("Loading site.json...");
      const siteFile = await getFileContent(config, "public/data/site.json");
      if (siteFile) {
        const site = JSON.parse(siteFile.content);
        setSiteContent({ ...defaultSiteContent, ...site });
        localStorage.setItem(SITE_KEY, JSON.stringify(site));
      }

      // Load team index
      setSyncMessage("Loading team/index.json...");
      const indexFile = await getFileContent(config, "public/data/team/index.json");
      if (indexFile) {
        const index = JSON.parse(indexFile.content);
        const memberFileNames: string[] = index.members || [];

        const members: TeamMember[] = [];
        for (const fileName of memberFileNames) {
          setSyncMessage(`Loading team/${fileName}.json...`);
          const file = await getFileContent(config, `public/data/team/${fileName}.json`);
          if (file) {
            members.push(JSON.parse(file.content));
          }
        }

        if (members.length > 0) {
          setTeamMembers(members);
          localStorage.setItem(TEAM_KEY, JSON.stringify(members));
        }
      }

      setDataSource("github");
      localStorage.setItem(DATA_SOURCE_KEY, "github");
      setChangedFiles({ site: false, members: new Set() });
      setSyncStatus("success");
      setSyncMessage("✓ All files loaded from GitHub!");
      setTimeout(() => { setSyncStatus("idle"); setSyncMessage(""); }, 5000);
      return { success: true, message: "All files loaded from GitHub!" };
    } catch (err) {
      const msg = `Load failed: ${err instanceof Error ? err.message : "Unknown"}`;
      setSyncStatus("error");
      setSyncMessage(msg);
      setTimeout(() => { setSyncStatus("idle"); setSyncMessage(""); }, 8000);
      return { success: false, message: msg };
    }
  }, []);

  // Legacy saveToGitHub (pushes all)
  const saveToGitHub = useCallback(async (): Promise<{ success: boolean; message: string }> => {
    setIsDeploying(true);
    const result = await pushToGitHub();
    setIsDeploying(false);
    return result;
  }, [pushToGitHub]);

  return (
    <DataContext.Provider
      value={{
        siteContent, teamMembers,
        updateSiteContent, updateTeamMembers, updateTeamMember, resetToDefaults,
        githubConfig, setGitHubConfig, isGitHubConfigured,
        saveToGitHub, pushToGitHub, pushSiteToGitHub, pushMemberToGitHub, loadFromGitHub,
        syncStatus, syncMessage, isDeploying, lastDeployTime, dataSource,
        fileStructure, changedFiles,
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
