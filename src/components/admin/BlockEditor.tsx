import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Trash2, ChevronDown,
  ArrowUp, ArrowDown, Type, Image, Columns2, Columns3,
  Quote, Minus, LayoutTemplate, GalleryHorizontal, X,
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
  { type: "image-text", label: "Image + Text", icon: LayoutTemplate, description: "Image and text side by side" },
  { type: "quote", label: "Quote", icon: Quote, description: "Pull quote with author" },
  { type: "spacer", label: "Spacer", icon: Minus, description: "Visual spacer / divider" },
  { type: "gallery", label: "Photo Gallery", icon: GalleryHorizontal, description: "Masonry photo gallery" },
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
    case "image-text":
      return { ...base, image: "", heading: "", body: "", textSide: "right" };
    case "quote":
      return { ...base, quote: "", author: "" };
    case "spacer":
      return { ...base, size: "md" };
    case "gallery":
      return { ...base, images: [{ url: "", caption: "" }] };
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

/* ─── Image Entry Editor ─── */

function ImageEntry({ image, onChange, onDelete, showDelete }: {
  image: { url: string; caption?: string };
  onChange: (img: { url: string; caption?: string }) => void;
  onDelete?: () => void;
  showDelete?: boolean;
}) {
  return (
    <div className="rounded-lg border p-3 space-y-2" style={{ borderColor: "var(--divider)" }}>
      <div className="flex gap-2 items-start">
        <div className="flex-1 space-y-2">
          <MiniInput value={image.url} onChange={(v) => onChange({ ...image, url: v })} placeholder="Image URL..." label="URL" />
          <MiniInput value={image.caption || ""} onChange={(v) => onChange({ ...image, caption: v })} placeholder="Caption (optional)" label="Caption" />
        </div>
        <div className="flex flex-col gap-1 pt-4">
          {image.url && (
            <img src={image.url} alt="" className="w-14 h-10 rounded object-cover flex-shrink-0" />
          )}
          {showDelete && onDelete && (
            <button onClick={onDelete} className="p-1 text-red-500 hover:text-red-600 transition-colors">
              <X size={12} />
            </button>
          )}
        </div>
      </div>
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
        <label className="block text-[10px] font-bold uppercase tracking-[0.1em] mb-1.5" style={{ color: "var(--text-tertiary)" }}>
          Alignment
        </label>
        <div className="flex gap-1">
          {(["left", "center", "right"] as const).map((a) => (
            <button
              key={a}
              onClick={() => onChange({ ...block, alignment: a })}
              className="px-3 py-1.5 rounded-lg text-[10px] font-semibold uppercase tracking-wider transition-all"
              style={{
                background: block.alignment === a ? "var(--text-primary)" : "var(--bg-primary)",
                color: block.alignment === a ? "var(--bg-primary)" : "var(--text-secondary)",
                border: "1px solid var(--divider)",
              }}
            >
              {a}
            </button>
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

function ImageGridEditor({ block, onChange, count }: { block: ContentBlock; onChange: (b: ContentBlock) => void; count: number }) {
  const images = block.images || [];
  const updateImage = (index: number, img: { url: string; caption?: string }) => {
    const newImages = [...images];
    newImages[index] = img;
    onChange({ ...block, images: newImages });
  };

  // Ensure we have the right number of slots
  while (images.length < count) {
    images.push({ url: "", caption: "" });
  }

  return (
    <div className="space-y-2">
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
        <label className="block text-[10px] font-bold uppercase tracking-[0.1em] mb-1.5" style={{ color: "var(--text-tertiary)" }}>
          Text Position
        </label>
        <div className="flex gap-1">
          {(["left", "right"] as const).map((s) => (
            <button
              key={s}
              onClick={() => onChange({ ...block, textSide: s })}
              className="px-3 py-1.5 rounded-lg text-[10px] font-semibold uppercase tracking-wider transition-all"
              style={{
                background: block.textSide === s ? "var(--text-primary)" : "var(--bg-primary)",
                color: block.textSide === s ? "var(--bg-primary)" : "var(--text-secondary)",
                border: "1px solid var(--divider)",
              }}
            >
              Text {s}
            </button>
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
      <label className="block text-[10px] font-bold uppercase tracking-[0.1em] mb-1.5" style={{ color: "var(--text-tertiary)" }}>
        Spacer Size
      </label>
      <div className="flex gap-1">
        {(["sm", "md", "lg"] as const).map((s) => (
          <button
            key={s}
            onClick={() => onChange({ ...block, size: s })}
            className="px-3 py-1.5 rounded-lg text-[10px] font-semibold uppercase tracking-wider transition-all"
            style={{
              background: block.size === s ? "var(--text-primary)" : "var(--bg-primary)",
              color: block.size === s ? "var(--bg-primary)" : "var(--text-secondary)",
              border: "1px solid var(--divider)",
            }}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

function GalleryEditor({ block, onChange }: { block: ContentBlock; onChange: (b: ContentBlock) => void }) {
  const images = block.images || [];

  const updateImage = (index: number, img: { url: string; caption?: string }) => {
    const newImages = [...images];
    newImages[index] = img;
    onChange({ ...block, images: newImages });
  };

  const addImage = () => {
    onChange({ ...block, images: [...images, { url: "", caption: "" }] });
  };

  const removeImage = (index: number) => {
    onChange({ ...block, images: images.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-[10px] font-bold uppercase tracking-[0.1em]" style={{ color: "var(--text-tertiary)" }}>
          Gallery Images ({images.length})
        </label>
        <button
          onClick={addImage}
          className="text-[10px] font-semibold text-indigo-500 hover:text-indigo-600 flex items-center gap-0.5"
        >
          <Plus size={10} /> Add Image
        </button>
      </div>
      {images.map((img, i) => (
        <ImageEntry
          key={i}
          image={img}
          onChange={(v) => updateImage(i, v)}
          onDelete={() => removeImage(i)}
          showDelete={images.length > 1}
        />
      ))}
    </div>
  );
}

/* ─── Block Editor Item ─── */

function BlockEditorItem({ block, index, total, expanded, onToggle, onChange, onDelete, onMoveUp, onMoveDown, accentColor }: {
  block: ContentBlock;
  index: number;
  total: number;
  expanded: boolean;
  onToggle: () => void;
  onChange: (b: ContentBlock) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  accentColor: string;
}) {
  const Icon = getBlockIcon(block.type);

  const renderEditor = () => {
    switch (block.type) {
      case "hero-image": return <HeroImageEditor block={block} onChange={onChange} />;
      case "text": return <TextEditor block={block} onChange={onChange} />;
      case "image-full": return <ImageFullEditor block={block} onChange={onChange} />;
      case "image-grid-2": return <ImageGridEditor block={block} onChange={onChange} count={2} />;
      case "image-grid-3": return <ImageGridEditor block={block} onChange={onChange} count={3} />;
      case "image-text": return <ImageTextEditor block={block} onChange={onChange} />;
      case "quote": return <QuoteEditor block={block} onChange={onChange} />;
      case "spacer": return <SpacerEditor block={block} onChange={onChange} />;
      case "gallery": return <GalleryEditor block={block} onChange={onChange} />;
      default: return null;
    }
  };

  return (
    <div className="rounded-xl border overflow-hidden" style={{ borderColor: expanded ? accentColor + "40" : "var(--divider)" }}>
      {/* Header */}
      <div
        className="flex items-center gap-2 px-3 py-2.5 cursor-pointer hover:bg-[var(--bg-tertiary)] transition-colors"
        onClick={onToggle}
      >
        <div className="flex flex-col gap-0.5">
          <button
            onClick={(e) => { e.stopPropagation(); onMoveUp(); }}
            disabled={index === 0}
            className="p-0.5 rounded hover:bg-[var(--bg-tertiary)] disabled:opacity-20 transition-all"
            style={{ color: "var(--text-tertiary)" }}
          >
            <ArrowUp size={10} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onMoveDown(); }}
            disabled={index === total - 1}
            className="p-0.5 rounded hover:bg-[var(--bg-tertiary)] disabled:opacity-20 transition-all"
            style={{ color: "var(--text-tertiary)" }}
          >
            <ArrowDown size={10} />
          </button>
        </div>
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
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="p-1.5 rounded-lg text-red-400 hover:text-red-500 hover:bg-red-500/10 transition-all flex-shrink-0"
        >
          <Trash2 size={12} />
        </button>
        <ChevronDown
          size={12}
          style={{
            color: "var(--text-tertiary)",
            transform: expanded ? "rotate(180deg)" : "rotate(0)",
            transition: "transform 0.2s",
          }}
        />
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
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: accentColor + "15", color: accentColor }}
                  >
                    <BIcon size={13} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>
                      {bt.label}
                    </p>
                    <p className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>
                      {bt.description}
                    </p>
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

/* ─── Main BlockEditor Component ─── */

interface BlockEditorProps {
  blocks: ContentBlock[];
  onChange: (blocks: ContentBlock[]) => void;
  accentColor: string;
}

export function BlockEditor({ blocks, onChange, accentColor }: BlockEditorProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

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

  const moveBlock = (index: number, direction: "up" | "down") => {
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= blocks.length) return;
    const newBlocks = [...blocks];
    [newBlocks[index], newBlocks[swapIndex]] = [newBlocks[swapIndex], newBlocks[index]];
    onChange(newBlocks);
  };

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
      </div>

      {blocks.length === 0 && (
        <div className="text-center py-6 rounded-xl border border-dashed" style={{ borderColor: "var(--divider)" }}>
          <LayoutTemplate size={20} className="mx-auto mb-2 opacity-30" style={{ color: "var(--text-tertiary)" }} />
          <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
            No content blocks yet. Add blocks to create a Behance-style project page.
          </p>
        </div>
      )}

      {blocks.map((block, index) => (
        <BlockEditorItem
          key={block.id}
          block={block}
          index={index}
          total={blocks.length}
          expanded={expandedId === block.id}
          onToggle={() => setExpandedId(expandedId === block.id ? null : block.id)}
          onChange={(b) => updateBlock(block.id, b)}
          onDelete={() => removeBlock(block.id)}
          onMoveUp={() => moveBlock(index, "up")}
          onMoveDown={() => moveBlock(index, "down")}
          accentColor={accentColor}
        />
      ))}

      <AddBlockMenu onAdd={addBlock} accentColor={accentColor} />
    </div>
  );
}
