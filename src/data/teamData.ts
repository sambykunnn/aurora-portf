export interface WorkItem {
  id: string;
  title: string;
  description: string;
  tools: string[];
  image: string;
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
    tagline: "Turning ideas into visual stories",
    skills: ["Brand Identity", "Typography", "UI Design", "Illustration", "Print Design", "Layout Design"],
    accentColor: "#6366F1",
    accentColorRGB: "99, 102, 241",
    email: "gian@aurorastudio.com",
    socials: [
      { platform: "Behance", url: "#" },
      { platform: "Dribbble", url: "#" },
      { platform: "Instagram", url: "#" },
    ],
    works: [
      { id: "g1", title: "Neon Horizons", description: "Brand identity for a tech startup exploring the future of AR interfaces", tools: ["Illustrator", "Photoshop"], image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&h=400&fit=crop" },
      { id: "g2", title: "Botanical Series", description: "Minimalist poster collection inspired by Japanese botanical art", tools: ["Illustrator", "InDesign"], image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=400&fit=crop" },
      { id: "g3", title: "Metro Typeface", description: "Custom geometric sans-serif typeface designed for urban wayfinding", tools: ["Glyphs", "Illustrator"], image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&h=400&fit=crop" },
      { id: "g4", title: "Café Luna Branding", description: "Complete visual identity for an artisan coffee brand", tools: ["Photoshop", "Illustrator"], image: "https://images.unsplash.com/photo-1634942536846-e9863ef87500?w=600&h=400&fit=crop" },
      { id: "g5", title: "Data Viz Dashboard", description: "UI design for a financial analytics platform with real-time data", tools: ["Figma", "Illustrator"], image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop" },
      { id: "g6", title: "Annual Report 2024", description: "Editorial design for a sustainability-focused annual report", tools: ["InDesign", "Photoshop"], image: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=600&h=400&fit=crop" },
    ],
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
  },
  {
    id: "sergs",
    name: "Sergs Dimaano",
    firstName: "Sergs",
    role: "3D Animation",
    tagline: "Bringing dimensions to life",
    skills: ["3D Modeling", "Character Animation", "Motion Graphics", "VFX", "Rigging", "Texturing"],
    accentColor: "#EC4899",
    accentColorRGB: "236, 72, 153",
    email: "sergs@aurorastudio.com",
    socials: [
      { platform: "ArtStation", url: "#" },
      { platform: "Vimeo", url: "#" },
      { platform: "Instagram", url: "#" },
    ],
    works: [
      { id: "s1", title: "Celestial Drift", description: "Animated short film exploring cosmic phenomena through abstract 3D forms", tools: ["Blender", "After Effects"], image: "https://images.unsplash.com/photo-1634017839464-5c339afa60f0?w=600&h=400&fit=crop" },
      { id: "s2", title: "Mecha Genesis", description: "Character design and animation for a sci-fi game trailer", tools: ["Maya", "ZBrush"], image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=600&h=400&fit=crop" },
      { id: "s3", title: "Fluid Dynamics", description: "Real-time simulation of liquid physics for product visualization", tools: ["Houdini", "Redshift"], image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&h=400&fit=crop" },
      { id: "s4", title: "Architectural Walk", description: "Photorealistic walkthrough animation for a modern residential project", tools: ["3ds Max", "V-Ray"], image: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=600&h=400&fit=crop" },
      { id: "s5", title: "Loop Series", description: "Collection of satisfying infinite loop animations for social media", tools: ["Cinema 4D", "Octane"], image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=400&fit=crop" },
      { id: "s6", title: "Product Reveal", description: "Premium unboxing animation for a luxury tech product launch", tools: ["Blender", "Substance"], image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&h=400&fit=crop" },
    ],
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face",
  },
  {
    id: "lorie",
    name: "Lorie Jane Levita",
    firstName: "Lorie Jane",
    role: "Short/Long Form Videos",
    tagline: "Crafting narratives frame by frame",
    skills: ["Video Editing", "Color Grading", "Storytelling", "Sound Design", "Cinematography", "Motion Graphics"],
    accentColor: "#F59E0B",
    accentColorRGB: "245, 158, 11",
    email: "lorie@aurorastudio.com",
    socials: [
      { platform: "YouTube", url: "#" },
      { platform: "Vimeo", url: "#" },
      { platform: "Instagram", url: "#" },
    ],
    works: [
      { id: "l1", title: "Golden Hour", description: "Documentary short capturing the magic of Manila's sunset communities", tools: ["Premiere Pro", "DaVinci"], image: "https://images.unsplash.com/photo-1536240478700-b869070f9279?w=600&h=400&fit=crop" },
      { id: "l2", title: "Street Rhythms", description: "Music video featuring underground artists and urban choreography", tools: ["Final Cut", "After Effects"], image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=600&h=400&fit=crop" },
      { id: "l3", title: "Taste of Home", description: "Food documentary series exploring regional Filipino cuisine traditions", tools: ["Premiere Pro", "Audition"], image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop" },
      { id: "l4", title: "Tech Forward", description: "Corporate brand film for a leading Southeast Asian tech company", tools: ["DaVinci Resolve", "After Effects"], image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=600&h=400&fit=crop" },
      { id: "l5", title: "Waves", description: "Experimental short film blending underwater footage with digital art", tools: ["Premiere Pro", "Nuke"], image: "https://images.unsplash.com/photo-1551076805-e1869033e561?w=600&h=400&fit=crop" },
      { id: "l6", title: "Campus Stories", description: "Social media content series for university recruitment campaigns", tools: ["Final Cut", "Motion"], image: "https://images.unsplash.com/photo-1523050854058-8df90110c476?w=600&h=400&fit=crop" },
    ],
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
  },
  {
    id: "rica",
    name: "Rica Mea Hernandez",
    firstName: "Rica Mea",
    role: "Modelling",
    tagline: "Sculpting digital perfection",
    skills: ["3D Modelling", "Sculpting", "Texturing", "UV Mapping", "Hard Surface", "Organic Modelling"],
    accentColor: "#10B981",
    accentColorRGB: "16, 185, 129",
    email: "rica@aurorastudio.com",
    socials: [
      { platform: "ArtStation", url: "#" },
      { platform: "Behance", url: "#" },
      { platform: "Instagram", url: "#" },
    ],
    works: [
      { id: "r1", title: "Ancient Ruins", description: "Detailed environment modelling of a lost civilization temple complex", tools: ["ZBrush", "Substance Painter"], image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&h=400&fit=crop" },
      { id: "r2", title: "Cyber Samurai", description: "High-poly character model blending feudal armor with cyberpunk aesthetics", tools: ["ZBrush", "Maya"], image: "https://images.unsplash.com/photo-1569701813229-33284b643e3c?w=600&h=400&fit=crop" },
      { id: "r3", title: "Product Renders", description: "Photorealistic product visualization for consumer electronics brand", tools: ["Blender", "KeyShot"], image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=400&fit=crop" },
      { id: "r4", title: "Flora Collection", description: "Botanical 3D model library with procedural materials and variations", tools: ["Houdini", "Substance"], image: "https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=600&h=400&fit=crop" },
      { id: "r5", title: "Vehicle Concepts", description: "Futuristic vehicle hard-surface models for an animated series pitch", tools: ["Fusion 360", "Blender"], image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&h=400&fit=crop" },
      { id: "r6", title: "Miniature World", description: "Diorama-style environment models for a mobile puzzle game", tools: ["Maya", "Substance Painter"], image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=400&fit=crop" },
    ],
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
  },
  {
    id: "erin",
    name: "Erin Margarette Pasamba",
    firstName: "Erin",
    role: "Photography",
    tagline: "Capturing moments, creating memories",
    skills: ["Portrait", "Landscape", "Product Photography", "Photo Editing", "Lighting", "Composition"],
    accentColor: "#8B5CF6",
    accentColorRGB: "139, 92, 246",
    email: "erin@aurorastudio.com",
    socials: [
      { platform: "Instagram", url: "#" },
      { platform: "500px", url: "#" },
      { platform: "Behance", url: "#" },
    ],
    works: [
      { id: "e1", title: "Urban Solitude", description: "Street photography series exploring isolation in crowded Asian cities", tools: ["Lightroom", "Photoshop"], image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=400&fit=crop" },
      { id: "e2", title: "Porcelain", description: "Fine art portrait series with minimalist styling and soft lighting", tools: ["Capture One", "Photoshop"], image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&h=400&fit=crop" },
      { id: "e3", title: "Made by Hand", description: "Documentary photography of traditional Filipino artisan craftspeople", tools: ["Lightroom", "Bridge"], image: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=600&h=400&fit=crop" },
      { id: "e4", title: "Brand Essentials", description: "Product flat-lay photography for lifestyle and beauty brands", tools: ["Capture One", "Photoshop"], image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=400&fit=crop" },
      { id: "e5", title: "After Dark", description: "Neon-lit night photography showcasing city nightlife culture", tools: ["Lightroom", "Photoshop"], image: "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=600&h=400&fit=crop" },
      { id: "e6", title: "Seasons Turn", description: "Landscape series documenting seasonal changes across Philippine provinces", tools: ["Lightroom", "Nik Collection"], image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop" },
    ],
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face",
  },
];
