import { useState, useEffect, useCallback, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, LogOut, Settings, Users, Image, Lock, Eye, EyeOff,
  Save, RotateCcw, Plus, Trash2, ChevronDown, ChevronRight,
  Check, AlertCircle, GripVertical, ExternalLink, Palette,
  Download, Upload, FolderTree, FileJson, HardDrive, Info,
} from "lucide-react";
import { useData, type SiteContent, getMemberFileName } from "@/context/DataContext";
import type { TeamMember, WorkItem } from "@/data/teamData";
import { BlockEditor } from "./BlockEditor";

/* ─── constants ─── */
const ADMIN_USER = "admin";
const ADMIN_PASS = "admin123";
const AUTH_KEY = "aurora_admin_auth";

/* ─── helpers ─── */
function generateId() { return Math.random().toString(36).substring(2, 9); }
function hexToRgb(hex: string): string | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : null;
}

function downloadJsonFile(data: unknown, filename: string) {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/* ─── Toast ─── */
function Toast({ message, type, onDone }: { message: string; type: "success" | "error"; onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 4000); return () => clearTimeout(t); }, [onDone]);
  return (
    <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className="fixed bottom-6 right-6 z-[200] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl max-w-sm"
      style={{ background: type === "success" ? "#10B981" : "#EF4444", color: "#fff" }}>
      {type === "success" ? <Check size={18} /> : <AlertCircle size={18} />}
      <span className="text-sm font-semibold">{message}</span>
    </motion.div>
  );
}

/* ─── Form elements ─── */
function FormGroup({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold uppercase tracking-[0.12em]" style={{ color: "var(--text-tertiary)" }}>{label}</label>
      {children}
      {hint && <p className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>{hint}</p>}
    </div>
  );
}

function Input({ value, onChange, placeholder, type = "text" }: { value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
      className="w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
      style={{ background: "var(--bg-secondary)", color: "var(--text-primary)", borderColor: "var(--divider)" }} />
  );
}

function TextArea({ value, onChange, placeholder, rows = 3 }: { value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
  return (
    <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={rows}
      className="w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 resize-none"
      style={{ background: "var(--bg-secondary)", color: "var(--text-primary)", borderColor: "var(--divider)" }} />
  );
}

function TagsInput({ tags, onChange, placeholder }: { tags: string[]; onChange: (tags: string[]) => void; placeholder?: string }) {
  const [input, setInput] = useState("");
  const addTag = () => { const val = input.trim(); if (val && !tags.includes(val)) { onChange([...tags, val]); setInput(""); } };
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5">
        {tags.map((tag, i) => (
          <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium" style={{ background: "var(--bg-tertiary)", color: "var(--text-primary)" }}>
            {tag}<button onClick={() => onChange(tags.filter((_, idx) => idx !== i))} className="ml-0.5 hover:opacity-60"><X size={10} /></button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
          placeholder={placeholder || "Add tag..."} className="flex-1 px-3.5 py-2 rounded-xl border text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
          style={{ background: "var(--bg-secondary)", color: "var(--text-primary)", borderColor: "var(--divider)" }} />
        <button onClick={addTag} className="px-3 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-500 hover:bg-indigo-600 transition-colors"><Plus size={14} /></button>
      </div>
    </div>
  );
}

/* ─── Save Button ─── */
function SaveButton({ onSave, hasChanges, label = "Save" }: { onSave: () => void; hasChanges: boolean; label?: string }) {
  if (!hasChanges) return null;
  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
      <button onClick={onSave}
        className="px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all duration-300 flex items-center gap-1.5 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
        style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
        <Save size={14} />{label}
      </button>
    </motion.div>
  );
}

function DiscardButton({ onDiscard, hasChanges }: { onDiscard: () => void; hasChanges: boolean }) {
  if (!hasChanges) return null;
  return (
    <button onClick={onDiscard} className="px-4 py-2 rounded-xl text-sm font-medium border transition-colors hover:bg-[var(--bg-tertiary)]"
      style={{ borderColor: "var(--divider)", color: "var(--text-secondary)" }}>Discard</button>
  );
}

/* ─── Login ─── */
function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [user, setUser] = useState(""); const [pass, setPass] = useState(""); const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState(""); const [loading, setLoading] = useState(false);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); setError(""); setLoading(true);
    setTimeout(() => {
      if (user === ADMIN_USER && pass === ADMIN_PASS) { localStorage.setItem(AUTH_KEY, "true"); onLogin(); }
      else { setError("Invalid username or password"); setLoading(false); }
    }, 600);
  };
  return (
    <div className="min-h-full flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0, y: 20, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.5 }} className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center" style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}><Lock size={28} className="text-white" /></div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>Admin Panel</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>Sign in to manage Aurora Studio</p>
        </div>
        <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 space-y-4">
          <FormGroup label="Username"><Input value={user} onChange={setUser} placeholder="Enter username" /></FormGroup>
          <FormGroup label="Password">
            <div className="relative">
              <input type={showPass ? "text" : "password"} value={pass} onChange={(e) => setPass(e.target.value)} placeholder="Enter password"
                className="w-full px-3.5 py-2.5 pr-10 rounded-xl border text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                style={{ background: "var(--bg-secondary)", color: "var(--text-primary)", borderColor: "var(--divider)" }} />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-tertiary)" }}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </FormGroup>
          <AnimatePresence>{error && (
            <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
              className="text-sm text-red-500 font-medium flex items-center gap-1.5"><AlertCircle size={14} /> {error}</motion.p>
          )}</AnimatePresence>
          <button type="submit" disabled={loading || !user || !pass}
            className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
            {loading ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}><Settings size={16} /></motion.div>
              : <><Lock size={14} /> Sign In</>}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

/* ─── Site Settings Editor ─── */
function SiteSettingsEditor({ onToast }: { onToast: (msg: string, type: "success" | "error") => void }) {
  const { siteContent, updateSiteContent, resetToDefaults } = useData();
  const [draft, setDraft] = useState<SiteContent>(siteContent);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => { setDraft(siteContent); setHasChanges(false); }, [siteContent]);

  const update = (key: keyof SiteContent, value: string | string[]) => { setDraft((prev) => ({ ...prev, [key]: value })); setHasChanges(true); };

  const save = () => {
    const merged = { ...siteContent, ...draft };
    updateSiteContent(merged);
    setHasChanges(false);
    onToast("Site settings saved!", "success");
  };

  const discard = () => { setDraft(siteContent); setHasChanges(false); };
  const reset = () => { if (confirm("Reset all site content and team data to defaults?")) { resetToDefaults(); onToast("Reset to defaults!", "success"); } };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>Site Settings</h2>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-secondary)" }}>Configure global site content</p>
        </div>
        <div className="flex items-center gap-2">
          <DiscardButton onDiscard={discard} hasChanges={hasChanges} />
          <SaveButton onSave={save} hasChanges={hasChanges} />
        </div>
      </div>

      {/* Branding */}
      <div className="glass-card rounded-2xl p-6 space-y-5">
        <h3 className="text-sm font-bold uppercase tracking-[0.1em]" style={{ color: "var(--text-primary)" }}>Branding</h3>
        <div className="grid md:grid-cols-2 gap-5">
          <FormGroup label="Studio Name"><Input value={draft.studioName} onChange={(v) => update("studioName", v)} placeholder="Aurora" /></FormGroup>
          <FormGroup label="Studio Tagline"><Input value={draft.studioTagline} onChange={(v) => update("studioTagline", v)} /></FormGroup>
        </div>
      </div>

      {/* Hero */}
      <div className="glass-card rounded-2xl p-6 space-y-5">
        <h3 className="text-sm font-bold uppercase tracking-[0.1em]" style={{ color: "var(--text-primary)" }}>Hero Section</h3>
        <FormGroup label="Subtitle"><Input value={draft.heroSubtitle} onChange={(v) => update("heroSubtitle", v)} /></FormGroup>
        <FormGroup label="Description"><Input value={draft.heroDescription} onChange={(v) => update("heroDescription", v)} /></FormGroup>
        <FormGroup label="Discipline Tags"><TagsInput tags={draft.disciplines} onChange={(v) => update("disciplines", v)} placeholder="Add discipline..." /></FormGroup>
      </div>

      {/* Works */}
      <div className="glass-card rounded-2xl p-6 space-y-5">
        <h3 className="text-sm font-bold uppercase tracking-[0.1em]" style={{ color: "var(--text-primary)" }}>Selected Works Section</h3>
        <div className="grid md:grid-cols-2 gap-5">
          <FormGroup label="Section Subtitle"><Input value={draft.worksSectionSubtitle} onChange={(v) => update("worksSectionSubtitle", v)} /></FormGroup>
          <FormGroup label="Section Title"><Input value={draft.worksSectionTitle} onChange={(v) => update("worksSectionTitle", v)} /></FormGroup>
        </div>
      </div>

      {/* Team */}
      <div className="glass-card rounded-2xl p-6 space-y-5">
        <h3 className="text-sm font-bold uppercase tracking-[0.1em]" style={{ color: "var(--text-primary)" }}>Team Section</h3>
        <div className="grid md:grid-cols-2 gap-5">
          <FormGroup label="Section Subtitle"><Input value={draft.teamSectionSubtitle} onChange={(v) => update("teamSectionSubtitle", v)} /></FormGroup>
          <FormGroup label="Section Title"><Input value={draft.teamSectionTitle} onChange={(v) => update("teamSectionTitle", v)} /></FormGroup>
        </div>
        <FormGroup label="Section Description"><Input value={draft.teamSectionDescription} onChange={(v) => update("teamSectionDescription", v)} /></FormGroup>
      </div>

      {/* Contact */}
      <div className="glass-card rounded-2xl p-6 space-y-5">
        <h3 className="text-sm font-bold uppercase tracking-[0.1em]" style={{ color: "var(--text-primary)" }}>Contact Section</h3>
        <FormGroup label="Heading"><Input value={draft.contactHeading} onChange={(v) => update("contactHeading", v)} /></FormGroup>
        <FormGroup label="Description"><Input value={draft.contactDescription} onChange={(v) => update("contactDescription", v)} /></FormGroup>
        <FormGroup label="Contact Email"><Input value={draft.contactEmail} onChange={(v) => update("contactEmail", v)} type="email" /></FormGroup>
      </div>

      {/* Danger */}
      <div className="rounded-2xl p-6 space-y-4 border-2 border-red-500/20">
        <h3 className="text-sm font-bold uppercase tracking-[0.1em] text-red-500">Danger Zone</h3>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Reset all content to factory defaults.</p>
        <button onClick={reset} className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors flex items-center gap-2">
          <RotateCcw size={14} /> Reset to Defaults
        </button>
      </div>
    </div>
  );
}

/* ─── Work Editor ─── */
function WorkEditor({ work, accentColor, onChange, onDelete }: { work: WorkItem; accentColor: string; onChange: (w: WorkItem) => void; onDelete: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--divider)" }}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[var(--bg-tertiary)] transition-colors">
        <GripVertical size={14} style={{ color: "var(--text-tertiary)" }} />
        {work.image && <img src={work.image} alt="" className="w-10 h-7 rounded object-cover flex-shrink-0" />}
        <div className="flex-1 min-w-0"><p className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>{work.title || "Untitled Work"}</p></div>
        <ChevronDown size={14} style={{ color: "var(--text-tertiary)", transform: open ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }} />
      </button>
      <AnimatePresence>{open && (
        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
          <div className="px-4 pb-4 pt-2 space-y-4 border-t" style={{ borderColor: "var(--divider)" }}>
            <div className="grid md:grid-cols-2 gap-4">
              <FormGroup label="Title"><Input value={work.title} onChange={(v) => onChange({ ...work, title: v })} placeholder="Work title" /></FormGroup>
              <FormGroup label="Image URL"><Input value={work.image} onChange={(v) => onChange({ ...work, image: v })} placeholder="https://..." /></FormGroup>
            </div>
            <FormGroup label="Description"><TextArea value={work.description} onChange={(v) => onChange({ ...work, description: v })} rows={2} /></FormGroup>
            <FormGroup label="Tools"><TagsInput tags={work.tools} onChange={(v) => onChange({ ...work, tools: v })} placeholder="Add tool..." /></FormGroup>
            {work.image && (<div className="rounded-xl overflow-hidden border" style={{ borderColor: "var(--divider)" }}><img src={work.image} alt="" className="w-full h-32 object-cover" /></div>)}
            <div className="border-t pt-4 mt-2" style={{ borderColor: "var(--divider)" }}>
              <BlockEditor blocks={work.contentBlocks || []} onChange={(blocks) => onChange({ ...work, contentBlocks: blocks })} accentColor={accentColor} />
            </div>
            <button onClick={onDelete} className="flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:text-red-600 transition-colors"><Trash2 size={12} /> Remove Work</button>
          </div>
        </motion.div>
      )}</AnimatePresence>
    </div>
  );
}

/* ─── Member Editor ─── */
function MemberEditor({ member, onBack, onToast }: { member: TeamMember; onBack: () => void; onToast: (msg: string, type: "success" | "error") => void }) {
  const { updateTeamMember } = useData();
  const [draft, setDraft] = useState<TeamMember>(member);
  const [hasChanges, setHasChanges] = useState(false);

  const update = <K extends keyof TeamMember>(key: K, value: TeamMember[K]) => { setDraft((prev) => ({ ...prev, [key]: value })); setHasChanges(true); };

  const save = () => {
    updateTeamMember(draft.id, draft);
    setHasChanges(false);
    onToast(`${draft.firstName}'s profile saved!`, "success");
  };

  const updateSocial = (index: number, field: "platform" | "url", value: string) => {
    const s = [...draft.socials]; s[index] = { ...s[index], [field]: value }; update("socials", s);
  };
  const addSocial = () => update("socials", [...draft.socials, { platform: "", url: "#" }]);
  const removeSocial = (i: number) => update("socials", draft.socials.filter((_, idx) => idx !== i));

  const updateWork = (i: number, w: WorkItem) => { const ws = [...draft.works]; ws[i] = w; update("works", ws); };
  const addWork = () => {
    update("works", [...draft.works, {
      id: generateId(), title: "New Work", description: "", tools: [],
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&h=400&fit=crop",
    }]);
  };
  const removeWork = (i: number) => { if (confirm("Remove this work?")) update("works", draft.works.filter((_, idx) => idx !== i)); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 rounded-xl hover:bg-[var(--bg-tertiary)] transition-colors" style={{ color: "var(--text-secondary)" }}>
            <ChevronRight size={18} className="rotate-180" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl overflow-hidden" style={{ boxShadow: `0 0 0 2px ${draft.accentColor}` }}>
              <img src={draft.avatar} alt="" className="w-full h-full object-cover" />
            </div>
            <div>
              <h2 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>{draft.name}</h2>
              <p className="text-sm" style={{ color: draft.accentColor }}>{draft.role}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <DiscardButton onDiscard={() => { setDraft(member); setHasChanges(false); }} hasChanges={hasChanges} />
          <SaveButton onSave={save} hasChanges={hasChanges} />
        </div>
      </div>

      {/* Basic Info */}
      <div className="glass-card rounded-2xl p-6 space-y-5">
        <h3 className="text-sm font-bold uppercase tracking-[0.1em]" style={{ color: "var(--text-primary)" }}>Basic Information</h3>
        <div className="grid md:grid-cols-2 gap-5">
          <FormGroup label="Full Name"><Input value={draft.name} onChange={(v) => update("name", v)} /></FormGroup>
          <FormGroup label="First Name (Display)"><Input value={draft.firstName} onChange={(v) => update("firstName", v)} /></FormGroup>
          <FormGroup label="Role"><Input value={draft.role} onChange={(v) => update("role", v)} /></FormGroup>
          <FormGroup label="Email"><Input value={draft.email} onChange={(v) => update("email", v)} type="email" /></FormGroup>
        </div>
        <FormGroup label="Tagline"><Input value={draft.tagline} onChange={(v) => update("tagline", v)} /></FormGroup>
        <FormGroup label="Avatar URL" hint="Square image works best (200x200)">
          <div className="flex gap-3 items-start">
            <div className="flex-1"><Input value={draft.avatar} onChange={(v) => update("avatar", v)} placeholder="https://..." /></div>
            {draft.avatar && <img src={draft.avatar} alt="" className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />}
          </div>
        </FormGroup>
      </div>

      {/* Color */}
      <div className="glass-card rounded-2xl p-6 space-y-5">
        <h3 className="text-sm font-bold uppercase tracking-[0.1em] flex items-center gap-2" style={{ color: "var(--text-primary)" }}><Palette size={14} /> Accent Color</h3>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex gap-2">
            {["#6366F1", "#EC4899", "#F59E0B", "#10B981", "#8B5CF6", "#EF4444", "#06B6D4", "#F97316"].map((c) => (
              <button key={c} onClick={() => { const rgb = hexToRgb(c); update("accentColor", c); if (rgb) update("accentColorRGB", rgb); }}
                className="w-8 h-8 rounded-full transition-all duration-200 hover:scale-110"
                style={{ background: c, boxShadow: draft.accentColor === c ? `0 0 0 3px var(--bg-primary), 0 0 0 5px ${c}` : "none" }} />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input type="color" value={draft.accentColor} onChange={(e) => { const c = e.target.value; const rgb = hexToRgb(c); update("accentColor", c); if (rgb) update("accentColorRGB", rgb); }}
              className="w-8 h-8 rounded-lg border-0 cursor-pointer" />
            <span className="text-xs font-mono" style={{ color: "var(--text-tertiary)" }}>{draft.accentColor}</span>
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="glass-card rounded-2xl p-6 space-y-5">
        <h3 className="text-sm font-bold uppercase tracking-[0.1em]" style={{ color: "var(--text-primary)" }}>Skills</h3>
        <TagsInput tags={draft.skills} onChange={(v) => update("skills", v)} placeholder="Add skill..." />
      </div>

      {/* Socials */}
      <div className="glass-card rounded-2xl p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-[0.1em] flex items-center gap-2" style={{ color: "var(--text-primary)" }}><ExternalLink size={14} /> Socials</h3>
          <button onClick={addSocial} className="text-xs font-semibold text-indigo-500 hover:text-indigo-600 flex items-center gap-1"><Plus size={12} /> Add</button>
        </div>
        <div className="space-y-3">
          {draft.socials.map((social, i) => (
            <div key={i} className="flex gap-3 items-center">
              <div className="flex-1 grid grid-cols-2 gap-3">
                <Input value={social.platform} onChange={(v) => updateSocial(i, "platform", v)} placeholder="Platform" />
                <Input value={social.url} onChange={(v) => updateSocial(i, "url", v)} placeholder="URL" />
              </div>
              <button onClick={() => removeSocial(i)} className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors"><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
      </div>

      {/* Works */}
      <div className="glass-card rounded-2xl p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-[0.1em] flex items-center gap-2" style={{ color: "var(--text-primary)" }}><Image size={14} /> Portfolio Works ({draft.works.length})</h3>
          <button onClick={addWork} className="text-xs font-semibold text-indigo-500 hover:text-indigo-600 flex items-center gap-1"><Plus size={12} /> Add Work</button>
        </div>
        <div className="space-y-2">
          {draft.works.map((w, i) => (
            <WorkEditor key={w.id} work={w} accentColor={draft.accentColor} onChange={(wk) => updateWork(i, wk)} onDelete={() => removeWork(i)} />
          ))}
          {draft.works.length === 0 && <p className="text-sm text-center py-6" style={{ color: "var(--text-tertiary)" }}>No works yet.</p>}
        </div>
      </div>
    </div>
  );
}

/* ─── Team List ─── */
function TeamMembersEditor({ onToast }: { onToast: (msg: string, type: "success" | "error") => void }) {
  const { teamMembers } = useData();
  const [editingId, setEditingId] = useState<string | null>(null);
  const editing = teamMembers.find((m) => m.id === editingId);
  if (editing) return <MemberEditor member={editing} onBack={() => setEditingId(null)} onToast={onToast} />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>Team Members</h2>
        <p className="text-sm mt-0.5" style={{ color: "var(--text-secondary)" }}>Click a member to edit their profile and portfolio.</p>
      </div>
      <div className="space-y-3">
        {teamMembers.map((member, i) => (
          <motion.button key={member.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            onClick={() => setEditingId(member.id)}
            className="w-full glass-card rounded-2xl p-5 flex items-center gap-4 transition-all duration-300 hover:-translate-y-0.5 text-left group">
            <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0" style={{ boxShadow: `0 0 0 2px ${member.accentColor}` }}>
              <img src={member.avatar} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{member.name}</h3>
              <p className="text-xs mt-0.5" style={{ color: member.accentColor }}>{member.role}</p>
              <div className="flex items-center gap-3 mt-1.5">
                <span className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>{member.works.length} works</span>
                <span className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>{member.skills.length} skills</span>
              </div>
            </div>
            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: member.accentColor }} />
            <ChevronRight size={16} className="flex-shrink-0 opacity-40 group-hover:opacity-100 transition-opacity" style={{ color: "var(--text-tertiary)" }} />
          </motion.button>
        ))}
      </div>
    </div>
  );
}

/* ─── Export / Import Tab ─── */
function ExportImportEditor({ onToast }: { onToast: (msg: string, type: "success" | "error") => void }) {
  const { siteContent, teamMembers, updateSiteContent, updateTeamMembers, dataSource } = useData();

  const dataSourceLabel: Record<string, string> = {
    default: "📦 Factory defaults",
    localStorage: "💾 Browser localStorage",
    "data.json": "📄 Deployed data/ folder (GitHub)",
  };

  /* ── File structure ── */
  const fileStructure = [
    { path: "public/data/site.json", description: "Studio settings, hero text, section titles, contact info" },
    { path: "public/data/team/index.json", description: "Team member manifest (list of filenames)" },
    ...teamMembers.map((m) => ({
      path: `public/data/team/${getMemberFileName(m.id)}.json`,
      description: `${m.name} — ${m.role}`,
    })),
  ];

  /* ── Export: single file per piece ── */
  const handleExportSiteJson = () => {
    downloadJsonFile(siteContent, "site.json");
    onToast("Downloaded site.json", "success");
  };

  const handleExportIndexJson = () => {
    downloadJsonFile({ members: teamMembers.map((m) => getMemberFileName(m.id)) }, "index.json");
    onToast("Downloaded index.json", "success");
  };

  const handleExportMember = (member: TeamMember) => {
    downloadJsonFile(member, `${getMemberFileName(member.id)}.json`);
    onToast(`Downloaded ${getMemberFileName(member.id)}.json`, "success");
  };

  const handleExportAllIndividual = () => {
    downloadJsonFile(siteContent, "site.json");
    downloadJsonFile({ members: teamMembers.map((m) => getMemberFileName(m.id)) }, "index.json");
    teamMembers.forEach((m) => {
      downloadJsonFile(m, `${getMemberFileName(m.id)}.json`);
    });
    onToast(`Downloaded ${2 + teamMembers.length} files`, "success");
  };

  /* ── Export: GitHub-ready bundle ── */
  const handleExportBundle = () => {
    const bundle: Record<string, unknown> = {};
    bundle["public/data/site.json"] = siteContent;
    bundle["public/data/team/index.json"] = { members: teamMembers.map((m) => getMemberFileName(m.id)) };
    teamMembers.forEach((m) => {
      bundle[`public/data/team/${getMemberFileName(m.id)}.json`] = m;
    });
    downloadJsonFile(bundle, `aurora-bundle-${new Date().toISOString().split("T")[0]}.json`);
    onToast("Exported GitHub bundle", "success");
  };

  /* ── Export: backup ── */
  const handleExportBackup = () => {
    downloadJsonFile({ siteContent, teamMembers }, `aurora-backup-${new Date().toISOString().split("T")[0]}.json`);
    onToast("Backup exported!", "success");
  };

  /* ── Import ── */
  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file"; input.accept = ".json";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      try {
        const text = await file.text();
        const data = JSON.parse(text);

        // Format 1: Backup (siteContent + teamMembers)
        if (data.siteContent && data.teamMembers) {
          updateSiteContent(data.siteContent);
          updateTeamMembers(data.teamMembers);
          onToast("Imported from backup!", "success");
          return;
        }

        // Format 2: GitHub bundle (keys = file paths)
        if (data["public/data/site.json"]) {
          const site = data["public/data/site.json"];
          if (site) updateSiteContent(site);

          const indexFile = data["public/data/team/index.json"];
          if (indexFile && indexFile.members) {
            const members: TeamMember[] = [];
            for (const memberFileName of indexFile.members) {
              const memberData = data[`public/data/team/${memberFileName}.json`];
              if (memberData) {
                if (!memberData.firstName && memberData.shortName) memberData.firstName = memberData.shortName;
                members.push(memberData as TeamMember);
              }
            }
            if (members.length > 0) updateTeamMembers(members);
          }
          onToast("Imported from GitHub bundle!", "success");
          return;
        }

        // Format 3: Single member file
        if (data.id && data.name && Array.isArray(data.works)) {
          const existing = teamMembers.find((m) => m.id === data.id);
          if (existing) {
            const updated = teamMembers.map((m) => m.id === data.id ? { ...m, ...data } : m);
            updateTeamMembers(updated);
            onToast(`Imported ${data.firstName || data.name}'s profile!`, "success");
          } else {
            onToast("Member ID not found. Import skipped.", "error");
          }
          return;
        }

        // Format 4: Site settings file
        if (data.studioName) {
          updateSiteContent(data);
          onToast("Site settings imported!", "success");
          return;
        }

        onToast("Unrecognized JSON format", "error");
      } catch { onToast("Failed to parse JSON file", "error"); }
    };
    input.click();
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>Export & Import</h2>
        <p className="text-sm mt-0.5" style={{ color: "var(--text-secondary)" }}>
          Download JSON files, put them in your GitHub repo, and Vercel auto-deploys.
        </p>
      </div>

      {/* Current Data Source */}
      <div className="glass-card rounded-2xl p-5 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
          <HardDrive size={18} className="text-white" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Current Data Source</p>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>{dataSourceLabel[dataSource] || dataSource}</p>
        </div>
      </div>

      {/* How it Works */}
      <div className="glass-card rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-[0.1em] flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
          <Info size={14} /> How to Update Your Site
        </h3>
        <div className="space-y-3">
          {[
            { step: "1", text: "Edit content in the admin panel (Site & Team tabs) → changes save to your browser automatically." },
            { step: "2", text: "Click \"Export All Files\" below to download all JSON files." },
            { step: "3", text: "Put the files in your GitHub repo under public/data/ (see file structure below)." },
            { step: "4", text: "Commit and push → Vercel detects the change and auto-deploys in ~30 seconds." },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                style={{ background: "var(--bg-tertiary)", color: "var(--text-secondary)" }}>{item.step}</span>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{item.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Export Section ── */}
      <div className="glass-card rounded-2xl p-6 space-y-5">
        <h3 className="text-sm font-bold uppercase tracking-[0.1em] flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
          <Download size={14} /> Export Content
        </h3>

        <div className="space-y-3">
          {/* Export all individual files */}
          <button onClick={handleExportAllIndividual}
            className="w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 hover:bg-[var(--bg-tertiary)] text-left group"
            style={{ borderColor: "var(--divider)" }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #10B981, #059669)" }}>
              <FolderTree size={18} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Export All Files</p>
              <p className="text-[11px] mt-0.5" style={{ color: "var(--text-tertiary)" }}>
                Downloads {2 + teamMembers.length} individual .json files — place directly in your GitHub repo
              </p>
            </div>
            <Download size={16} className="flex-shrink-0 opacity-40 group-hover:opacity-100 transition-opacity" style={{ color: "var(--text-tertiary)" }} />
          </button>

          {/* GitHub bundle */}
          <button onClick={handleExportBundle}
            className="w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 hover:bg-[var(--bg-tertiary)] text-left group"
            style={{ borderColor: "var(--divider)" }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
              <FileJson size={18} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Export as Bundle</p>
              <p className="text-[11px] mt-0.5" style={{ color: "var(--text-tertiary)" }}>
                Single JSON with all files keyed by path — useful for backup & re-importing
              </p>
            </div>
            <Download size={16} className="flex-shrink-0 opacity-40 group-hover:opacity-100 transition-opacity" style={{ color: "var(--text-tertiary)" }} />
          </button>

          {/* Backup */}
          <button onClick={handleExportBackup}
            className="w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 hover:bg-[var(--bg-tertiary)] text-left group"
            style={{ borderColor: "var(--divider)" }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #F59E0B, #D97706)" }}>
              <Save size={18} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Export Backup</p>
              <p className="text-[11px] mt-0.5" style={{ color: "var(--text-tertiary)" }}>
                Flat JSON backup — easy to restore later via import
              </p>
            </div>
            <Download size={16} className="flex-shrink-0 opacity-40 group-hover:opacity-100 transition-opacity" style={{ color: "var(--text-tertiary)" }} />
          </button>
        </div>
      </div>

      {/* ── Import Section ── */}
      <div className="glass-card rounded-2xl p-6 space-y-5">
        <h3 className="text-sm font-bold uppercase tracking-[0.1em] flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
          <Upload size={14} /> Import Content
        </h3>
        <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
          Upload a JSON file to load content. Auto-detects format: bundle, backup, site settings, or individual member file.
        </p>

        <button onClick={handleImport}
          className="w-full py-3.5 rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2.5 border hover:bg-[var(--bg-tertiary)] hover:shadow-lg hover:scale-[1.01] active:scale-[0.99]"
          style={{ borderColor: "var(--divider)", color: "var(--text-primary)" }}>
          <Upload size={16} /> Choose JSON File to Import
        </button>
      </div>

      {/* ── File Structure with per-file download ── */}
      <div className="glass-card rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-[0.1em] flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
          <FolderTree size={14} /> GitHub File Structure
        </h3>
        <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
          Place these files in your GitHub repo. Click ⬇ to download any individual file.
        </p>
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--divider)" }}>
          {fileStructure.map((file, i) => {
            const fileName = file.path.split("/").pop() || "";
            const isIndex = file.path.includes("index.json");
            return (
              <div key={i} className="flex items-center gap-3 px-4 py-3 border-b last:border-b-0 transition-colors hover:bg-[var(--bg-tertiary)]"
                style={{ borderColor: "var(--divider)" }}>
                <FileJson size={14} style={{ color: "var(--text-tertiary)" }} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-mono font-medium truncate" style={{ color: "var(--text-primary)" }}>{file.path}</p>
                  <p className="text-[10px] truncate" style={{ color: "var(--text-tertiary)" }}>{file.description}</p>
                </div>
                <button
                  onClick={() => {
                    if (file.path === "public/data/site.json") handleExportSiteJson();
                    else if (isIndex) handleExportIndexJson();
                    else {
                      const member = teamMembers.find((m) => file.path.includes(getMemberFileName(m.id)));
                      if (member) handleExportMember(member);
                    }
                  }}
                  className="p-1.5 rounded-lg transition-all duration-200 hover:bg-[var(--bg-tertiary)]"
                  style={{ color: "var(--text-tertiary)" }}
                  title={`Download ${fileName}`}
                >
                  <Download size={13} />
                </button>
              </div>
            );
          })}
        </div>

        <div className="rounded-xl p-4 border border-blue-500/20" style={{ background: "rgba(99,102,241,0.05)" }}>
          <p className="text-xs font-medium text-blue-600 flex items-start gap-2">
            <FolderTree size={14} className="flex-shrink-0 mt-0.5" />
            <span>
              <strong>Workflow:</strong> Edit content here → Export files → Drop them into <code className="bg-blue-500/10 px-1 rounded text-[11px]">public/data/</code> in your GitHub repo → Commit & push → Vercel auto-deploys.
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Admin Panel ─── */
type Tab = "site" | "team" | "export";

interface AdminPanelProps { isOpen: boolean; onClose: () => void; }

export function AdminPanel({ isOpen, onClose }: AdminPanelProps) {
  const [authed, setAuthed] = useState(() => localStorage.getItem(AUTH_KEY) === "true");
  const [activeTab, setActiveTab] = useState<Tab>("site");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = useCallback((message: string, type: "success" | "error") => { setToast({ message, type }); }, []);

  const logout = () => { localStorage.removeItem(AUTH_KEY); setAuthed(false); };

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const tabs: { id: Tab; label: string; icon: ReactNode }[] = [
    { id: "site", label: "Site", icon: <Settings size={16} /> },
    { id: "team", label: "Team", icon: <Users size={16} /> },
    { id: "export", label: "Export", icon: <Download size={16} /> },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[80]" style={{ background: "var(--overlay-bg)" }} onClick={onClose} />
          <motion.div initial={{ opacity: 0, x: "100%" }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed inset-0 md:inset-y-0 md:left-auto md:w-[680px] lg:w-[780px] z-[90] flex flex-col"
            style={{ background: "var(--bg-primary)" }}>

            {/* Top bar */}
            <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "var(--divider)" }}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
                  <Settings size={14} className="text-white" />
                </div>
                <div>
                  <h1 className="text-base font-bold" style={{ color: "var(--text-primary)" }}>Admin Panel</h1>
                  <p className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>Aurora Studio</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {authed && (
                  <button onClick={logout} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors hover:bg-[var(--bg-tertiary)]"
                    style={{ color: "var(--text-secondary)" }}><LogOut size={13} /> Logout</button>
                )}
                <button onClick={onClose} className="p-2 rounded-xl transition-colors hover:bg-[var(--bg-tertiary)]" style={{ color: "var(--text-secondary)" }}><X size={18} /></button>
              </div>
            </div>

            {!authed ? <AdminLogin onLogin={() => setAuthed(true)} /> : (
              <>
                <div className="flex-shrink-0 flex border-b px-6 gap-1" style={{ borderColor: "var(--divider)" }}>
                  {tabs.map((tab) => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                      className="flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all duration-200 border-b-2 -mb-px"
                      style={{ borderColor: activeTab === tab.id ? "#6366f1" : "transparent", color: activeTab === tab.id ? "var(--text-primary)" : "var(--text-tertiary)" }}>
                      {tab.icon} {tab.label}
                    </button>
                  ))}
                </div>
                <div className="flex-1 overflow-y-auto p-6">
                  <AnimatePresence mode="wait">
                    <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                      {activeTab === "site" && <SiteSettingsEditor onToast={showToast} />}
                      {activeTab === "team" && <TeamMembersEditor onToast={showToast} />}
                      {activeTab === "export" && <ExportImportEditor onToast={showToast} />}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </>
            )}
          </motion.div>
          <AnimatePresence>{toast && <Toast message={toast.message} type={toast.type} onDone={() => setToast(null)} />}</AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
}
