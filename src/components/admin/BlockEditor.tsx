import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Trash2, ChevronDown,
  Type, Image, Columns2, Columns3,
  Quote, Minus, LayoutTemplate, GalleryHorizontal, X,
  Play, Grid2x2, GripVertical,
} from "lucide-react";
import type { ContentBlock, BlockType } from "@/data/teamData";

/* ─── Helpers ─── */
function generateId() {
  return "blk_" + Math.random().toString(36).substring(2, 9);
}

const BLOCK_TYPES: { type: BlockType; label: string; icon: typeof Type; description: string }[] = [
  { type: "hero-image", label: "Hero Image", icon: Image, description: "Full-width hero with title overlay" },
  { type: "text", label: "Text", icon: Type, description: "Heading and body text" },
  { type: "image-full", label: "Full Image", icon: Image, description: "Full-width single image" },
  { type: "image-grid-2", label: "2-Column Grid", icon: Columns2, description: "Two images side by side" },
  { type: "image-grid-3", label: "3-Column Grid", icon: Columns3, description: "Three images in a row" },
  { type: "image-grid-6", label: "6-Column Grid", icon: GalleryHorizontal, description: "Six images in a 3×2 grid" },
  { type: "image-text", label: "Image + Text", icon: LayoutTemplate, description: "Image and text side by side" },
  { type: "quote", label: "Quote", icon: Quote, description: "Pull quote with author" },
  { type: "spacer", label: "Spacer", icon: Minus, description: "Visual spacer / divider" },
  { type: "gallery", label: "Photo Gallery", icon: GalleryHorizontal, description: "Masonry photo gallery" },
  { type: "video", label: "Video", icon: Play, description: "YouTube, Vimeo, or direct video embed" },
  { type: "video-grid", label: "Video Grid", icon: Grid2x2, description: "Multiple videos in a grid layout" },
];

function createDefaultBlock(type: BlockType): ContentBlock {
  const base: ContentBlock = { id: generateId(), type };
  switch (type) {
    case "hero-image":
      return { ...base, image: "", heading: "", body: "" };
    case "text":
      return { ...base, heading: "", body: "", alignment: "center" };
    case "image-full":
      return { ...base, image: "", caption: "" };
    case "image-grid-2":
      return { ...base, images: [{ url: "", caption: "" }, { url: "", caption: "" }] };
    case "image-grid-3":
      return { ...base, images: [{ url: "", caption: "" }, { url: "", caption: "" }, { url: "", caption: "" }] };
    case "image-grid-6":
      return { ...base, images: [{ url: "", caption: "" }, { url: "", caption: "" }, { url: "", caption: "" }, { url: "", caption: "" }, { url: "", caption: "" }, { url: "", caption: "" }] };
    case "image-text":
      return { ...base, image: "", heading: "", body: "", textSide: "right" };
    case "quote":
      return { ...base, quote: "", author: "" };
    case "spacer":
      return { ...base, size: "md" };
    case "gallery":
      return { ...base, images: [{ url: "", caption: "" }] };
    case "video":
      return { ...base, videoUrl: "", heading: "", body: "", caption: "", autoplay: false, loop: false };
    case "video-grid":
      return { ...base, heading: "", videos: [{ url: "", caption: "" }, { url: "", caption: "" }] };
    default:
      return base;
  }
}

function getBlockIcon(type: BlockType) {
  const found = BLOCK_TYPES.find((b) => b.type === type);
  return found?.icon || Type;
}

function getBlockLabel(type: BlockType) {
  return BLOCK_TYPES.find((b) => b.type === type)?.label || type;
}

/* ─── Small Form Components ─── */

function MiniInput({ value, onChange, placeholder, label }: {
  value: string; onChange: (v: string) => void; placeholder?: string; label?: string;
}) {
  return (
    <div>
      {label && (
        <label className="block text-[10px] font-bold uppercase tracking-[0.1em] mb-1" style={{ color: "var(--text-tertiary)" }}>
          {label}
        </label>
      )}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 rounded-lg border text-xs transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
        style={{ background: "var(--bg-primary)", color: "var(--text-primary)", borderColor: "var(--divider)" }}
      />
    </div>
  );
}

function MiniTextArea({ value, onChange, placeholder, label, rows = 3 }: {
  value: string; onChange: (v: string) => void; placeholder?: string; label?: string; rows?: number;
}) {
  return (
    <div>
      {label && (
        <label className="block text-[10px] font-bold uppercase tracking-[0.1em] mb-1" style={{ color: "var(--text-tertiary)" }}>
          {label}
        </label>
      )}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-3 py-2 rounded-lg border text-xs transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 resize-none"
        style={{ background: "var(--bg-primary)", color: "var(--text-primary)", borderColor: "var(--divider)" }}
      />
    </div>
  );
}

/* ─── Image Entry Editor with Zoom/Position ─── */

type ImageData = { url: string; caption?: string; zoom?: number; objectX?: number; objectY?: number };

function ImageEntry({ image, onChange, onDelete, showDelete }: {
  image: ImageData;
  onChange: (img: ImageData) => void;
  onDelete?: () => void;
  showDelete?: boolean;
}) {
  const [showZoom, setShowZoom] = useState(false);
  const zoom = image.zoom ?? 100;
  const objectX = image.objectX ?? 50;
  const objectY = image.objectY ?? 50;
  const hasCustomZoom = zoom !== 100 || objectX !== 50 || objectY !== 50;

  return (
    <div className="rounded-lg border p-3 space-y-2" style={{ borderColor: "var(--divider)" }}>
      <div className="flex gap-2 items-start">
        <div className="flex-1 space-y-2">
          <MiniInput value={image.url} onChange={(v) => onChange({ ...image, url: v })} placeholder="Image URL..." label="URL" />
          <MiniInput value={image.caption || ""} onChange={(v) => onChange({ ...image, caption: v })} placeholder="Caption (optional)" label="Caption" />
        </div>
        <div className="flex flex-col gap-1 pt-4">
          {image.url && (
            <div className="w-14 h-10 rounded overflow-hidden flex-shrink-0">
              <img
                src={image.url}
                alt=""
                className="w-full h-full object-cover"
                style={{
                  transform: `scale(${zoom / 100})`,
                  transformOrigin: `${objectX}% ${objectY}%`,
                  objectPosition: `${objectX}% ${objectY}%`,
                }}
              />
            </div>
          )}
          {showDelete && onDelete && (
            <button onClick={onDelete} className="p-1 text-red-500 hover:text-red-600 transition-colors">
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Zoom & Position Toggle */}
      <button
        onClick={() => setShowZoom(!showZoom)}
        className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider transition-colors"
        style={{ color: hasCustomZoom ? "#6366f1" : "var(--text-tertiary)" }}
      >
        <ChevronDown size={10} style={{ transform: showZoom ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }} />
        Zoom & Position {hasCustomZoom && "●"}
      </button>

      <AnimatePresence>
        {showZoom && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="rounded-lg p-3 space-y-3" style={{ background: "var(--bg-tertiary)" }}>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>Zoom</label>
                  <span className="text-[10px] font-mono font-bold" style={{ color: "var(--text-secondary)" }}>{zoom}%</span>
                </div>
                <input type="range" min="100" max="200" value={zoom} onChange={(e) => onChange({ ...image, zoom: parseInt(e.target.value) })}
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-indigo-500" style={{ background: "var(--divider)" }} />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>X Position</label>
                  <span className="text-[10px] font-mono font-bold" style={{ color: "var(--text-secondary)" }}>{objectX}%</span>
                </div>
                <input type="range" min="0" max="100" value={objectX} onChange={(e) => onChange({ ...image, objectX: parseInt(e.target.value) })}
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-indigo-500" style={{ background: "var(--divider)" }} />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>Y Position</label>
                  <span className="text-[10px] font-mono font-bold" style={{ color: "var(--text-secondary)" }}>{objectY}%</span>
                </div>
                <input type="range" min="0" max="100" value={objectY} onChange={(e) => onChange({ ...image, objectY: parseInt(e.target.value) })}
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-indigo-500" style={{ background: "var(--divider)" }} />
              </div>
              <button onClick={() => onChange({ ...image, zoom: 100, objectX: 50, objectY: 50 })}
                className="text-[10px] font-semibold text-red-400 hover:text-red-500 transition-colors">
                Reset to Default
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Block Type Editors ─── */

function HeroImageEditor({ block, onChange }: { block: ContentBlock; onChange: (b: ContentBlock) => void }) {
  return (
    <div className="space-y-3">
      <MiniInput value={block.image || ""} onChange={(v) => onChange({ ...block, image: v })} placeholder="Hero image URL..." label="Image URL" />
      {block.image && <img src={block.image} alt="" className="w-full h-24 rounded-lg object-cover" />}
      <MiniInput value={block.heading || ""} onChange={(v) => onChange({ ...block, heading: v })} placeholder="Title overlay..." label="Title" />
      <MiniInput value={block.body || ""} onChange={(v) => onChange({ ...block, body: v })} placeholder="Subtitle..." label="Subtitle" />
    </div>
  );
}

function TextEditor({ block, onChange }: { block: ContentBlock; onChange: (b: ContentBlock) => void }) {
  return (
    <div className="space-y-3">
      <MiniInput value={block.heading || ""} onChange={(v) => onChange({ ...block, heading: v })} placeholder="Section heading..." label="Heading" />
      <MiniTextArea value={block.body || ""} onChange={(v) => onChange({ ...block, body: v })} placeholder="Body text..." label="Body" rows={4} />
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-[0.1em] mb-1.5" style={{ color: "var(--text-tertiary)" }}>Alignment</label>
        <div className="flex gap-1">
          {(["left", "center", "right"] as const).map((a) => (
            <button key={a} onClick={() => onChange({ ...block, alignment: a })}
              className="px-3 py-1.5 rounded-lg text-[10px] font-semibold uppercase tracking-wider transition-all"
              style={{
                background: block.alignment === a ? "var(--text-primary)" : "var(--bg-primary)",
                color: block.alignment === a ? "var(--bg-primary)" : "var(--text-secondary)",
                border: "1px solid var(--divider)",
              }}>{a}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ImageFullEditor({ block, onChange }: { block: ContentBlock; onChange: (b: ContentBlock) => void }) {
  return (
    <div className="space-y-3">
      <MiniInput value={block.image || ""} onChange={(v) => onChange({ ...block, image: v })} placeholder="Image URL..." label="Image URL" />
      {block.image && <img src={block.image} alt="" className="w-full h-20 rounded-lg object-cover" />}
      <MiniInput value={block.caption || ""} onChange={(v) => onChange({ ...block, caption: v })} placeholder="Caption (optional)..." label="Caption" />
    </div>
  );
}

function GapSlider({ gap, onChange }: { gap: number; onChange: (v: number) => void }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>Grid Gap</label>
        <span className="text-[10px] font-mono font-bold" style={{ color: "var(--text-secondary)" }}>{gap}px</span>
      </div>
      <input type="range" min="0" max="48" value={gap} onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-indigo-500" style={{ background: "var(--divider)" }} />
    </div>
  );
}

function ImageGridEditor({ block, onChange, count }: { block: ContentBlock; onChange: (b: ContentBlock) => void; count: number }) {
  const images = block.images || [];
  const updateImage = (index: number, img: ImageData) => {
    const newImages = [...images]; newImages[index] = img; onChange({ ...block, images: newImages });
  };
  while (images.length < count) images.push({ url: "", caption: "" });

  return (
    <div className="space-y-3">
      <GapSlider gap={block.gap ?? 4} onChange={(v) => onChange({ ...block, gap: v })} />
      <label className="block text-[10px] font-bold uppercase tracking-[0.1em]" style={{ color: "var(--text-tertiary)" }}>
        Images ({count} slots)
      </label>
      {images.slice(0, count).map((img, i) => (
        <ImageEntry key={i} image={img} onChange={(v) => updateImage(i, v)} />
      ))}
    </div>
  );
}

function ImageTextEditor({ block, onChange }: { block: ContentBlock; onChange: (b: ContentBlock) => void }) {
  return (
    <div className="space-y-3">
      <MiniInput value={block.image || ""} onChange={(v) => onChange({ ...block, image: v })} placeholder="Image URL..." label="Image URL" />
      {block.image && <img src={block.image} alt="" className="w-full h-20 rounded-lg object-cover" />}
      <MiniInput value={block.heading || ""} onChange={(v) => onChange({ ...block, heading: v })} placeholder="Heading..." label="Heading" />
      <MiniTextArea value={block.body || ""} onChange={(v) => onChange({ ...block, body: v })} placeholder="Text content..." label="Text" rows={3} />
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-[0.1em] mb-1.5" style={{ color: "var(--text-tertiary)" }}>Text Position</label>
        <div className="flex gap-1">
          {(["left", "right"] as const).map((s) => (
            <button key={s} onClick={() => onChange({ ...block, textSide: s })}
              className="px-3 py-1.5 rounded-lg text-[10px] font-semibold uppercase tracking-wider transition-all"
              style={{
                background: block.textSide === s ? "var(--text-primary)" : "var(--bg-primary)",
                color: block.textSide === s ? "var(--bg-primary)" : "var(--text-secondary)",
                border: "1px solid var(--divider)",
              }}>Text {s}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

function QuoteEditor({ block, onChange }: { block: ContentBlock; onChange: (b: ContentBlock) => void }) {
  return (
    <div className="space-y-3">
      <MiniTextArea value={block.quote || ""} onChange={(v) => onChange({ ...block, quote: v })} placeholder="Quote text..." label="Quote" rows={3} />
      <MiniInput value={block.author || ""} onChange={(v) => onChange({ ...block, author: v })} placeholder="Author name..." label="Author" />
    </div>
  );
}

function SpacerEditor({ block, onChange }: { block: ContentBlock; onChange: (b: ContentBlock) => void }) {
  return (
    <div>
      <label className="block text-[10px] font-bold uppercase tracking-[0.1em] mb-1.5" style={{ color: "var(--text-tertiary)" }}>Spacer Size</label>
      <div className="flex gap-1">
        {(["sm", "md", "lg"] as const).map((s) => (
          <button key={s} onClick={() => onChange({ ...block, size: s })}
            className="px-3 py-1.5 rounded-lg text-[10px] font-semibold uppercase tracking-wider transition-all"
            style={{
              background: block.size === s ? "var(--text-primary)" : "var(--bg-primary)",
              color: block.size === s ? "var(--bg-primary)" : "var(--text-secondary)",
              border: "1px solid var(--divider)",
            }}>{s}</button>
        ))}
      </div>
    </div>
  );
}

function GalleryEditor({ block, onChange }: { block: ContentBlock; onChange: (b: ContentBlock) => void }) {
  const images = block.images || [];
  const updateImage = (index: number, img: ImageData) => {
    const newImages = [...images]; newImages[index] = img; onChange({ ...block, images: newImages });
  };
  const addImage = () => onChange({ ...block, images: [...images, { url: "", caption: "" }] });
  const removeImage = (index: number) => onChange({ ...block, images: images.filter((_, i) => i !== index) });

  return (
    <div className="space-y-3">
      <GapSlider gap={block.gap ?? 4} onChange={(v) => onChange({ ...block, gap: v })} />
      <div className="flex items-center justify-between">
        <label className="block text-[10px] font-bold uppercase tracking-[0.1em]" style={{ color: "var(--text-tertiary)" }}>
          Gallery Images ({images.length})
        </label>
        <button onClick={addImage} className="text-[10px] font-semibold text-indigo-500 hover:text-indigo-600 flex items-center gap-0.5">
          <Plus size={10} /> Add Image
        </button>
      </div>
      {images.map((img, i) => (
        <ImageEntry key={i} image={img} onChange={(v) => updateImage(i, v)} onDelete={() => removeImage(i)} showDelete={images.length > 1} />
      ))}
    </div>
  );
}

/* ─── Video Editors ─── */

function VideoEditor({ block, onChange }: { block: ContentBlock; onChange: (b: ContentBlock) => void }) {
  return (
    <div className="space-y-3">
      <MiniInput value={block.videoUrl || ""} onChange={(v) => onChange({ ...block, videoUrl: v })} placeholder="YouTube, Vimeo, or direct video URL..." label="Video URL" />
      <div className="rounded-lg p-2.5 text-[10px] space-y-1" style={{ background: "var(--bg-tertiary)", color: "var(--text-tertiary)" }}>
        <p className="font-bold uppercase tracking-wider">Supported formats:</p>
        <p>• YouTube: youtube.com/watch?v=... or youtu.be/...</p>
        <p>• Vimeo: vimeo.com/123456789</p>
        <p>• Google Drive: drive.google.com/file/d/.../view</p>
        <p>• Direct: .mp4, .webm, .mov files</p>
      </div>
      <MiniInput value={block.heading || ""} onChange={(v) => onChange({ ...block, heading: v })} placeholder="Video title (optional)..." label="Title" />
      <MiniTextArea value={block.body || ""} onChange={(v) => onChange({ ...block, body: v })} placeholder="Description (optional)..." label="Description" rows={2} />
      <MiniInput value={block.caption || ""} onChange={(v) => onChange({ ...block, caption: v })} placeholder="Caption below video..." label="Caption" />
      <div className="flex gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={block.autoplay || false} onChange={(e) => onChange({ ...block, autoplay: e.target.checked })}
            className="w-3.5 h-3.5 rounded accent-indigo-500" />
          <span className="text-[10px] font-bold uppercase tracking-[0.1em]" style={{ color: "var(--text-tertiary)" }}>Autoplay</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={block.loop || false} onChange={(e) => onChange({ ...block, loop: e.target.checked })}
            className="w-3.5 h-3.5 rounded accent-indigo-500" />
          <span className="text-[10px] font-bold uppercase tracking-[0.1em]" style={{ color: "var(--text-tertiary)" }}>Loop</span>
        </label>
      </div>
    </div>
  );
}

function VideoGridEditor({ block, onChange }: { block: ContentBlock; onChange: (b: ContentBlock) => void }) {
  const videos = block.videos || [];
  const updateVideo = (index: number, vid: { url: string; caption?: string }) => {
    const newVids = [...videos]; newVids[index] = vid; onChange({ ...block, videos: newVids });
  };
  const addVideo = () => onChange({ ...block, videos: [...videos, { url: "", caption: "" }] });
  const removeVideo = (index: number) => onChange({ ...block, videos: videos.filter((_, i) => i !== index) });

  return (
    <div className="space-y-3">
      <GapSlider gap={block.gap ?? 8} onChange={(v) => onChange({ ...block, gap: v })} />
      <MiniInput value={block.heading || ""} onChange={(v) => onChange({ ...block, heading: v })} placeholder="Grid title (optional)..." label="Title" />
      <div className="flex items-center justify-between">
        <label className="block text-[10px] font-bold uppercase tracking-[0.1em]" style={{ color: "var(--text-tertiary)" }}>Videos ({videos.length})</label>
        <button onClick={addVideo} className="text-[10px] font-semibold text-indigo-500 hover:text-indigo-600 flex items-center gap-0.5">
          <Plus size={10} /> Add Video
        </button>
      </div>
      {videos.map((vid, i) => (
        <div key={i} className="rounded-lg border p-3 space-y-2" style={{ borderColor: "var(--divider)" }}>
          <div className="flex gap-2 items-start">
            <div className="flex-1 space-y-2">
              <MiniInput value={vid.url} onChange={(v) => updateVideo(i, { ...vid, url: v })} placeholder="YouTube, Vimeo, or direct URL..." label={`Video ${i + 1} URL`} />
              <MiniInput value={vid.caption || ""} onChange={(v) => updateVideo(i, { ...vid, caption: v })} placeholder="Caption (optional)" label="Caption" />
            </div>
            {videos.length > 1 && (
              <button onClick={() => removeVideo(i)} className="p-1 mt-4 text-red-500 hover:text-red-600 transition-colors"><X size={12} /></button>
            )}
          </div>
        </div>
      ))}
      <div className="rounded-lg p-2.5 text-[10px]" style={{ background: "var(--bg-tertiary)", color: "var(--text-tertiary)" }}>
        <p><strong>Tip:</strong> 2 videos = 2-column, 3+ videos = responsive 2–3 column grid.</p>
      </div>
    </div>
  );
}

/* ─── Block Editor Item (Draggable) ─── */

function BlockEditorItem({ block, index, expanded, onToggle, onChange, onDelete, accentColor, isDragging, isDropTarget, dropPosition, onDragStart, onDragEnd, onDragOver, onDragLeave, onDrop }: {
  block: ContentBlock;
  index: number;
  expanded: boolean;
  onToggle: () => void;
  onChange: (b: ContentBlock) => void;
  onDelete: () => void;
  accentColor: string;
  isDragging: boolean;
  isDropTarget: boolean;
  dropPosition: "above" | "below" | null;
  onDragStart: (e: React.DragEvent) => void;
  onDragEnd: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
}) {
  const Icon = getBlockIcon(block.type);

  const renderEditor = () => {
    switch (block.type) {
      case "hero-image": return <HeroImageEditor block={block} onChange={onChange} />;
      case "text": return <TextEditor block={block} onChange={onChange} />;
      case "image-full": return <ImageFullEditor block={block} onChange={onChange} />;
      case "image-grid-2": return <ImageGridEditor block={block} onChange={onChange} count={2} />;
      case "image-grid-3": return <ImageGridEditor block={block} onChange={onChange} count={3} />;
      case "image-grid-6": return <ImageGridEditor block={block} onChange={onChange} count={6} />;
      case "image-text": return <ImageTextEditor block={block} onChange={onChange} />;
      case "quote": return <QuoteEditor block={block} onChange={onChange} />;
      case "spacer": return <SpacerEditor block={block} onChange={onChange} />;
      case "gallery": return <GalleryEditor block={block} onChange={onChange} />;
      case "video": return <VideoEditor block={block} onChange={onChange} />;
      case "video-grid": return <VideoGridEditor block={block} onChange={onChange} />;
      default: return null;
    }
  };

  return (
    <div
      className="relative"
      data-block-index={index}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      {/* Drop indicator - above */}
      {isDropTarget && dropPosition === "above" && (
        <div className="absolute -top-[3px] left-0 right-0 z-20 flex items-center pointer-events-none">
          <div className="w-3 h-3 rounded-full border-2 flex-shrink-0" style={{ borderColor: accentColor, background: accentColor }} />
          <div className="flex-1 h-[3px] rounded-full" style={{ background: accentColor }} />
          <div className="w-3 h-3 rounded-full border-2 flex-shrink-0" style={{ borderColor: accentColor, background: accentColor }} />
        </div>
      )}

      <div
        draggable
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        className="rounded-xl border overflow-hidden transition-all duration-200"
        style={{
          borderColor: expanded ? accentColor + "40" : isDragging ? accentColor : "var(--divider)",
          opacity: isDragging ? 0.4 : 1,
          transform: isDragging ? "scale(0.98)" : "scale(1)",
          boxShadow: isDragging ? `0 4px 20px rgba(0,0,0,0.15)` : "none",
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-2 px-3 py-2.5 hover:bg-[var(--bg-tertiary)] transition-colors">
          {/* Drag Handle */}
          <div
            className="cursor-grab active:cursor-grabbing p-1 rounded-md hover:bg-[var(--bg-tertiary)] transition-colors touch-none"
            style={{ color: "var(--text-tertiary)" }}
            title="Drag to reorder"
          >
            <GripVertical size={14} />
          </div>

          {/* Block info - clickable to expand */}
          <div className="flex items-center gap-2 flex-1 min-w-0 cursor-pointer" onClick={onToggle}>
            <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: accentColor + "15", color: accentColor }}>
              <Icon size={13} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate" style={{ color: "var(--text-primary)" }}>
                {getBlockLabel(block.type)}
              </p>
              <p className="text-[10px] truncate" style={{ color: "var(--text-tertiary)" }}>
                {block.heading || block.quote || block.caption || (block.image ? "Has image" : block.images?.length ? `${block.images.length} images` : block.size ? `Size: ${block.size}` : "Empty")}
              </p>
            </div>
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="p-1.5 rounded-lg text-red-400 hover:text-red-500 hover:bg-red-500/10 transition-all flex-shrink-0"
          >
            <Trash2 size={12} />
          </button>
          <div className="cursor-pointer" onClick={onToggle}>
            <ChevronDown
              size={12}
              style={{
                color: "var(--text-tertiary)",
                transform: expanded ? "rotate(180deg)" : "rotate(0)",
                transition: "transform 0.2s",
              }}
            />
          </div>
        </div>

        {/* Expanded editor */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="px-3 pb-3 pt-1 border-t" style={{ borderColor: "var(--divider)" }}>
                {renderEditor()}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Drop indicator - below */}
      {isDropTarget && dropPosition === "below" && (
        <div className="absolute -bottom-[3px] left-0 right-0 z-20 flex items-center pointer-events-none">
          <div className="w-3 h-3 rounded-full border-2 flex-shrink-0" style={{ borderColor: accentColor, background: accentColor }} />
          <div className="flex-1 h-[3px] rounded-full" style={{ background: accentColor }} />
          <div className="w-3 h-3 rounded-full border-2 flex-shrink-0" style={{ borderColor: accentColor, background: accentColor }} />
        </div>
      )}
    </div>
  );
}

/* ─── Add Block Menu ─── */

function AddBlockMenu({ onAdd, accentColor }: { onAdd: (type: BlockType) => void; accentColor: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed text-xs font-semibold uppercase tracking-[0.1em] transition-all duration-300 hover:border-solid"
        style={{
          borderColor: open ? accentColor : "var(--divider)",
          color: open ? accentColor : "var(--text-tertiary)",
          background: open ? accentColor + "08" : "transparent",
        }}
      >
        <Plus size={14} />
        Add Content Block
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="mt-2 rounded-xl border overflow-hidden shadow-lg"
            style={{ background: "var(--bg-primary)", borderColor: "var(--divider)" }}
          >
            {BLOCK_TYPES.map((bt) => {
              const BIcon = bt.icon;
              return (
                <button
                  key={bt.type}
                  onClick={() => { onAdd(bt.type); setOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-[var(--bg-tertiary)] transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: accentColor + "15", color: accentColor }}>
                    <BIcon size={13} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>{bt.label}</p>
                    <p className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>{bt.description}</p>
                  </div>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Main BlockEditor Component with Drag & Drop ─── */

interface BlockEditorProps {
  blocks: ContentBlock[];
  onChange: (blocks: ContentBlock[]) => void;
  accentColor: string;
}

export function BlockEditor({ blocks, onChange, accentColor }: BlockEditorProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dropTargetIndex, setDropTargetIndex] = useState<number | null>(null);
  const [dropPosition, setDropPosition] = useState<"above" | "below" | null>(null);
  const blockRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  const addBlock = (type: BlockType) => {
    const newBlock = createDefaultBlock(type);
    onChange([...blocks, newBlock]);
    setExpandedId(newBlock.id);
  };

  const updateBlock = (id: string, updated: ContentBlock) => {
    onChange(blocks.map((b) => (b.id === id ? updated : b)));
  };

  const removeBlock = (id: string) => {
    onChange(blocks.filter((b) => b.id !== id));
    if (expandedId === id) setExpandedId(null);
  };

  /* ─── Drag & Drop Handlers ─── */

  const handleDragStart = useCallback((e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(index));

    // Create a custom drag image
    const el = e.currentTarget as HTMLElement;
    const rect = el.getBoundingClientRect();
    const ghost = el.cloneNode(true) as HTMLElement;
    ghost.style.width = `${rect.width}px`;
    ghost.style.opacity = "0.85";
    ghost.style.transform = "rotate(1deg)";
    ghost.style.boxShadow = `0 8px 30px rgba(0,0,0,0.2)`;
    ghost.style.borderRadius = "12px";
    ghost.style.position = "absolute";
    ghost.style.top = "-9999px";
    ghost.style.left = "-9999px";
    document.body.appendChild(ghost);
    e.dataTransfer.setDragImage(ghost, rect.width / 2, 20);
    requestAnimationFrame(() => document.body.removeChild(ghost));
  }, []);

  const handleDragEnd = useCallback((_e: React.DragEvent) => {
    setDraggedIndex(null);
    setDropTargetIndex(null);
    setDropPosition(null);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";

    if (draggedIndex === null || draggedIndex === index) {
      // Still show indicator if hovering over adjacent items
      if (draggedIndex === index) {
        setDropTargetIndex(null);
        setDropPosition(null);
        return;
      }
    }

    // Determine whether to drop above or below based on mouse position within the element
    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const mouseY = e.clientY;
    const midY = rect.top + rect.height / 2;

    const pos = mouseY < midY ? "above" : "below";

    // Don't show indicator in positions that would result in no movement
    const effectiveInsertIndex = pos === "above" ? index : index + 1;
    if (draggedIndex !== null && (effectiveInsertIndex === draggedIndex || effectiveInsertIndex === draggedIndex + 1)) {
      setDropTargetIndex(null);
      setDropPosition(null);
      return;
    }

    setDropTargetIndex(index);
    setDropPosition(pos);
  }, [draggedIndex]);

  const handleDragLeave = useCallback((_e: React.DragEvent) => {
    // Only clear if leaving the entire block area
    setDropTargetIndex(null);
    setDropPosition(null);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();

    if (draggedIndex === null) return;

    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const mouseY = e.clientY;
    const midY = rect.top + rect.height / 2;
    const pos = mouseY < midY ? "above" : "below";

    let insertIndex = pos === "above" ? targetIndex : targetIndex + 1;

    // Don't do anything if it would result in no change
    if (insertIndex === draggedIndex || insertIndex === draggedIndex + 1) {
      setDraggedIndex(null);
      setDropTargetIndex(null);
      setDropPosition(null);
      return;
    }

    // Perform the reorder
    const fromIndex = draggedIndex;
    const newBlocks = [...blocks];
    const [dragged] = newBlocks.splice(fromIndex, 1);

    // Adjust insert index after removal
    if (fromIndex < insertIndex) insertIndex--;

    newBlocks.splice(insertIndex, 0, dragged);
    onChange(newBlocks);

    setDraggedIndex(null);
    setDropTargetIndex(null);
    setDropPosition(null);
  }, [draggedIndex, blocks, onChange]);

  // Store refs for touch drag (future enhancement)
  const setBlockRef = useCallback((index: number, el: HTMLDivElement | null) => {
    if (el) blockRefs.current.set(index, el);
    else blockRefs.current.delete(index);
  }, []);

  // Prevent unused warning
  void setBlockRef;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-2">
        <h4
          className="text-[10px] font-bold uppercase tracking-[0.12em] flex items-center gap-1.5"
          style={{ color: "var(--text-tertiary)" }}
        >
          <LayoutTemplate size={12} />
          Content Blocks ({blocks.length})
        </h4>
        {blocks.length > 1 && (
          <span className="text-[10px] flex items-center gap-1" style={{ color: "var(--text-tertiary)" }}>
            <GripVertical size={10} /> Drag to reorder
          </span>
        )}
      </div>

      {blocks.length === 0 && (
        <div className="text-center py-6 rounded-xl border border-dashed" style={{ borderColor: "var(--divider)" }}>
          <LayoutTemplate size={20} className="mx-auto mb-2 opacity-30" style={{ color: "var(--text-tertiary)" }} />
          <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
            No content blocks yet. Add blocks to create a Behance-style project page.
          </p>
        </div>
      )}

      <div className="space-y-1.5">
        {blocks.map((block, index) => (
          <BlockEditorItem
            key={block.id}
            block={block}
            index={index}
            expanded={expandedId === block.id}
            onToggle={() => setExpandedId(expandedId === block.id ? null : block.id)}
            onChange={(b) => updateBlock(block.id, b)}
            onDelete={() => removeBlock(block.id)}
            accentColor={accentColor}
            isDragging={draggedIndex === index}
            isDropTarget={dropTargetIndex === index}
            dropPosition={dropTargetIndex === index ? dropPosition : null}
            onDragStart={(e) => handleDragStart(e, index)}
            onDragEnd={handleDragEnd}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, index)}
          />
        ))}
      </div>

      <AddBlockMenu onAdd={addBlock} accentColor={accentColor} />
    </div>
  );
}
