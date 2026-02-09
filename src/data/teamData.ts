export type BlockType =
  | 'hero-image'
  | 'text'
  | 'image-full'
  | 'image-grid-2'
  | 'image-grid-3'
  | 'image-grid-6'
  | 'image-text'
  | 'spacer'
  | 'quote'
  | 'gallery'
  | 'video'
  | 'video-grid';

export interface ContentBlock {
  id: string;
  type: BlockType;
  image?: string;
  images?: { url: string; caption?: string }[];
  heading?: string;
  body?: string;
  caption?: string;
  alignment?: 'left' | 'center' | 'right';
  textSide?: 'left' | 'right';
  quote?: string;
  author?: string;
  size?: 'sm' | 'md' | 'lg';
  videoUrl?: string;
  videos?: { url: string; caption?: string }[];
  autoplay?: boolean;
  loop?: boolean;
}

export interface WorkItem {
  id: string;
  title: string;
  description: string;
  tools: string[];
  image: string;
  contentBlocks?: ContentBlock[];
}

export interface TeamMember {
  id: string;
  name: string;
  firstName: string;
  role: string;
  tagline: string;
  skills: string[];
  accentColor: string;
  accentColorRGB: string;
  email: string;
  socials: { platform: string; url: string }[];
  works: WorkItem[];
  avatar: string;
}

export const teamMembers: TeamMember[] = [
  {
    id: "gian",
    name: "Gian Carlo Sambayan",
    firstName: "Gian Carlo",
    role: "Graphic Design",
    tagline: "Visual storyteller crafting brands that resonate",
    skills: ["Brand Identity", "Typography", "Layout Design", "Visual Systems", "Print Design"],
    accentColor: "#6366F1",
    accentColorRGB: "99, 102, 241",
    email: "giancarlo@aurorastudio.com",
    socials: [
      { platform: "Behance", url: "" },
      { platform: "Instagram", url: "" },
    ],
    works: [],
    avatar: "",
  },
  {
    id: "sergs",
    name: "Sergs Dimaano",
    firstName: "Sergs",
    role: "3D Animation",
    tagline: "Bringing imagination to life in three dimensions",
    skills: ["3D Modeling", "Character Animation", "Motion Graphics", "Rendering", "Rigging"],
    accentColor: "#EC4899",
    accentColorRGB: "236, 72, 153",
    email: "sergs@aurorastudio.com",
    socials: [
      { platform: "Behance", url: "" },
      { platform: "Instagram", url: "" },
    ],
    works: [],
    avatar: "",
  },
  {
    id: "lorie",
    name: "Lorie Jane Levita",
    firstName: "Lorie",
    role: "Short/Long Form Videos",
    tagline: "Cinematic narratives that captivate audiences",
    skills: ["Video Editing", "Color Grading", "Storytelling", "Sound Design", "Cinematography"],
    accentColor: "#F59E0B",
    accentColorRGB: "245, 158, 11",
    email: "lorie@aurorastudio.com",
    socials: [
      { platform: "YouTube", url: "" },
      { platform: "Instagram", url: "" },
    ],
    works: [],
    avatar: "",
  },
  {
    id: "rica",
    name: "Rica Mea Hernandez",
    firstName: "Rica",
    role: "Modelling",
    tagline: "Expressing art through form and presence",
    skills: ["Fashion Modeling", "Commercial Modeling", "Posing", "Expression", "Brand Representation"],
    accentColor: "#10B981",
    accentColorRGB: "16, 185, 129",
    email: "rica@aurorastudio.com",
    socials: [
      { platform: "Instagram", url: "" },
      { platform: "TikTok", url: "" },
    ],
    works: [],
    avatar: "",
  },
  {
    id: "erin",
    name: "Erin Margarette Pasamba",
    firstName: "Erin",
    role: "Photography",
    tagline: "Capturing moments that tell timeless stories",
    skills: ["Portrait Photography", "Event Photography", "Photo Editing", "Composition", "Lighting"],
    accentColor: "#8B5CF6",
    accentColorRGB: "139, 92, 246",
    email: "erin@aurorastudio.com",
    socials: [
      { platform: "Instagram", url: "" },
      { platform: "Behance", url: "" },
    ],
    works: [],
    avatar: "",
  },
];
