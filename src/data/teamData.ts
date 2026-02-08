export type BlockType =
  | 'hero-image'
  | 'text'
  | 'image-full'
  | 'image-grid-2'
  | 'image-grid-3'
  | 'image-text'
  | 'spacer'
  | 'quote'
  | 'gallery';

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
      {
        id: "g1", title: "Neon Horizons", description: "Brand identity for a tech startup exploring the future of AR interfaces", tools: ["Illustrator", "Photoshop"],
        image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&h=400&fit=crop",
        contentBlocks: [
          { id: "g1b1", type: "hero-image", image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=1400&h=700&fit=crop", heading: "Neon Horizons", body: "Brand Identity · AR Tech Startup" },
          { id: "g1b2", type: "text", heading: "The Challenge", body: "Neon Horizons needed a brand identity that bridges the gap between cutting-edge AR technology and approachable, human-centered design. The goal was to create a visual system that feels futuristic yet warm — inviting users into a new dimension of digital interaction.", alignment: "center" },
          { id: "g1b3", type: "image-grid-2", images: [{ url: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop", caption: "Logo Exploration" }, { url: "https://images.unsplash.com/photo-1609921212029-bb5a28e60960?w=600&h=400&fit=crop", caption: "Brand Mockups" }] },
          { id: "g1b4", type: "text", heading: "Design System", body: "The visual language draws from prismatic light refractions — the way AR overlays digital information onto physical space. A custom color palette of electric indigos and warm ambers creates contrast and visual hierarchy across all touchpoints." },
          { id: "g1b5", type: "image-grid-3", images: [{ url: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=400&h=400&fit=crop", caption: "Business Cards" }, { url: "https://images.unsplash.com/photo-1634942536846-e9863ef87500?w=400&h=400&fit=crop", caption: "Packaging" }, { url: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=400&fit=crop", caption: "Typography System" }] },
          { id: "g1b6", type: "quote", quote: "The identity perfectly captures our vision for the future of AR — bold, inviting, and unmistakably forward-thinking.", author: "Alex Chen, CEO of Neon Horizons" },
        ],
      },
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
      {
        id: "s1", title: "Celestial Drift", description: "Animated short film exploring cosmic phenomena through abstract 3D forms", tools: ["Blender", "After Effects"],
        image: "https://images.unsplash.com/photo-1634017839464-5c339afa60f0?w=600&h=400&fit=crop",
        contentBlocks: [
          { id: "s1b1", type: "hero-image", image: "https://images.unsplash.com/photo-1634017839464-5c339afa60f0?w=1400&h=700&fit=crop", heading: "Celestial Drift", body: "Animated Short Film · 3D Abstract" },
          { id: "s1b2", type: "text", heading: "Concept & Vision", body: "Celestial Drift is an exploration of cosmic phenomena through the lens of abstract 3D art. Each sequence represents a different stage of stellar evolution — from nebula formation to supernova collapse — translated into mesmerizing visual poetry.", alignment: "center" },
          { id: "s1b3", type: "image-grid-2", images: [{ url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop", caption: "Storyboard: Nebula Sequence" }, { url: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=600&h=400&fit=crop", caption: "Storyboard: Stellar Birth" }] },
          { id: "s1b4", type: "image-full", image: "https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=1200&h=600&fit=crop", caption: "Final key frame render — The Convergence" },
          { id: "s1b5", type: "image-text", image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=400&fit=crop", heading: "Technical Approach", body: "Built entirely in Blender with custom shader nodes for the volumetric nebula effects. Post-processing in After Effects added the film grain and chromatic aberration that gives the piece its analog warmth.", textSide: "right" },
        ],
      },
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
      {
        id: "l1", title: "Golden Hour", description: "Documentary short capturing the magic of Manila's sunset communities", tools: ["Premiere Pro", "DaVinci"],
        image: "https://images.unsplash.com/photo-1536240478700-b869070f9279?w=600&h=400&fit=crop",
        contentBlocks: [
          { id: "l1b1", type: "hero-image", image: "https://images.unsplash.com/photo-1536240478700-b869070f9279?w=1400&h=700&fit=crop", heading: "Golden Hour", body: "Documentary Short · Manila Sunset Communities" },
          { id: "l1b2", type: "text", heading: "Synopsis", body: "Every evening, as the sun dips below Manila Bay, a transformation takes place. Street vendors, fishermen, and families gather along the waterfront in a ritual as old as the city itself. Golden Hour captures these fleeting moments of connection, warmth, and community that exist in the space between day and night.", alignment: "center" },
          { id: "l1b3", type: "image-grid-3", images: [{ url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop", caption: "The Waterfront" }, { url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop", caption: "Coastal Life" }, { url: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&h=300&fit=crop", caption: "Reflections" }] },
          { id: "l1b4", type: "image-text", image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=600&h=400&fit=crop", heading: "Behind the Camera", body: "Shot over 14 evenings across three months, the film uses only natural light to preserve the authentic warmth of golden hour. A handheld approach creates intimacy while wide establishing shots frame the community within its urban landscape.", textSide: "right" },
          { id: "l1b5", type: "quote", quote: "Golden hour is when the city finally breathes. You see people as they truly are — unhurried, connected, alive.", author: "Mang Tonyo, Manila Bay Fisherman" },
        ],
      },
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
      {
        id: "r1", title: "Ancient Ruins", description: "Detailed environment modelling of a lost civilization temple complex", tools: ["ZBrush", "Substance Painter"],
        image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&h=400&fit=crop",
        contentBlocks: [
          { id: "r1b1", type: "hero-image", image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1400&h=700&fit=crop", heading: "Ancient Ruins", body: "3D Environment Design · Lost Temple Complex" },
          { id: "r1b2", type: "text", heading: "World Building", body: "Inspired by the temple complexes of Angkor Wat and Borobudur, Ancient Ruins reimagines a lost civilization's sacred architecture. Every stone, vine, and weathering pattern tells a story of centuries passing — nature slowly reclaiming what was once a place of worship and wonder.", alignment: "center" },
          { id: "r1b3", type: "image-grid-2", images: [{ url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop", caption: "Wireframe Overview" }, { url: "https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=600&h=400&fit=crop", caption: "Textured Detail" }] },
          { id: "r1b4", type: "image-grid-3", images: [{ url: "https://images.unsplash.com/photo-1569701813229-33284b643e3c?w=400&h=400&fit=crop", caption: "Column Detail" }, { url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop", caption: "Material Study" }, { url: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=400&fit=crop", caption: "Entrance Gate" }] },
          { id: "r1b5", type: "image-full", image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1200&h=600&fit=crop", caption: "Final panoramic render — The Inner Sanctum at dawn" },
        ],
      },
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
      {
        id: "e1", title: "Urban Solitude", description: "Street photography series exploring isolation in crowded Asian cities", tools: ["Lightroom", "Photoshop"],
        image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=400&fit=crop",
        contentBlocks: [
          { id: "e1b1", type: "hero-image", image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1400&h=700&fit=crop", heading: "Urban Solitude", body: "Street Photography · Asian Cities" },
          { id: "e1b2", type: "text", heading: "Artist Statement", body: "Urban Solitude examines the paradox of loneliness in the world's most densely populated cities. Through careful framing and patient observation, each image isolates a single human moment within the chaos — a commuter lost in thought, a vendor waiting in stillness, a child playing alone in a crowd of thousands.", alignment: "center" },
          { id: "e1b3", type: "image-grid-3", images: [{ url: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=400&h=500&fit=crop", caption: "Crossing" }, { url: "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=400&h=500&fit=crop", caption: "Neon Dreams" }, { url: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&h=500&fit=crop", caption: "Overpass" }] },
          { id: "e1b4", type: "image-grid-2", images: [{ url: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&h=400&fit=crop", caption: "Reflection I" }, { url: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=600&h=400&fit=crop", caption: "Reflection II" }] },
          { id: "e1b5", type: "quote", quote: "In the crowd, we find our most private moments. Solitude isn't the absence of people — it's the presence of self.", author: "Erin Margarette Pasamba" },
        ],
      },
      { id: "e2", title: "Porcelain", description: "Fine art portrait series with minimalist styling and soft lighting", tools: ["Capture One", "Photoshop"], image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&h=400&fit=crop" },
      { id: "e3", title: "Made by Hand", description: "Documentary photography of traditional Filipino artisan craftspeople", tools: ["Lightroom", "Bridge"], image: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=600&h=400&fit=crop" },
      { id: "e4", title: "Brand Essentials", description: "Product flat-lay photography for lifestyle and beauty brands", tools: ["Capture One", "Photoshop"], image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=400&fit=crop" },
      { id: "e5", title: "After Dark", description: "Neon-lit night photography showcasing city nightlife culture", tools: ["Lightroom", "Photoshop"], image: "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=600&h=400&fit=crop" },
      { id: "e6", title: "Seasons Turn", description: "Landscape series documenting seasonal changes across Philippine provinces", tools: ["Lightroom", "Nik Collection"], image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop" },
    ],
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face",
  },
];
