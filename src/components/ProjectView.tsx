import { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Wrench, X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import type { TeamMember, WorkItem, ContentBlock } from "@/data/teamData";

interface ProjectViewProps {
  work: WorkItem;
  member: TeamMember;
  onBack: () => void;
}

/* ─── Shared Image Lightbox Context ─── */

interface LightboxImage {
  url: string;
  caption?: string;
}

function useImageLightbox() {
  const [images, setImages] = useState<LightboxImage[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback((allImages: LightboxImage[], startIndex: number) => {
    setImages(allImages);
    setCurrentIndex(startIndex);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const next = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  return { images, currentIndex, isOpen, open, close, next, prev };
}

/* ─── Image Lightbox Overlay ─── */

function ImageLightbox({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNext,
  onPrev,
  accentColor,
}: {
  images: LightboxImage[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  accentColor: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const current = images[currentIndex];

  useEffect(() => {
    setLoaded(false);
  }, [currentIndex]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose, onNext, onPrev]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && current && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/95 backdrop-blur-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 z-10 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
          >
            <X size={20} />
          </button>

          {/* Navigation */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); onPrev(); }}
                className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onNext(); }}
                className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}

          {/* Image */}
          <motion.div
            key={currentIndex}
            className="relative z-10 flex flex-col items-center max-w-[94vw] max-h-[94vh]"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Spinner */}
            {!loaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
                  style={{ borderColor: `${accentColor}60`, borderTopColor: "transparent" }}
                />
              </div>
            )}
            <img
              src={current.url.replace(/w=\d+/, "w=1600").replace(/h=\d+/, "h=1200")}
              alt={current.caption || ""}
              className="max-w-full max-h-[82vh] object-contain rounded-xl shadow-2xl"
              style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.4s ease" }}
              onLoad={() => setLoaded(true)}
            />

            {/* Caption + Counter */}
            <motion.div
              className="mt-4 text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              {current.caption && (
                <p className="text-white/80 text-sm font-medium">{current.caption}</p>
              )}
              {images.length > 1 && (
                <p className="text-white/40 text-xs mt-1.5 font-mono">
                  {currentIndex + 1} / {images.length}
                </p>
              )}
            </motion.div>

            {/* Keyboard hints */}
            {images.length > 1 && (
              <motion.div
                className="mt-3 flex items-center gap-4 text-white/25 text-xs"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <span className="flex items-center gap-1.5">
                  <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white/40 font-mono text-[10px]">←</kbd>
                  <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white/40 font-mono text-[10px]">→</kbd>
                  Navigate
                </span>
                <span className="flex items-center gap-1.5">
                  <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white/40 font-mono text-[10px]">ESC</kbd>
                  Close
                </span>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── Clickable Image Wrapper ─── */

function ClickableImage({
  src,
  alt,
  caption,
  className,
  imgClassName,
  allImages,
  imageIndex,
  onOpenLightbox,
}: {
  src: string;
  alt?: string;
  caption?: string;
  className?: string;
  imgClassName?: string;
  allImages: LightboxImage[];
  imageIndex: number;
  onOpenLightbox: (images: LightboxImage[], index: number) => void;
}) {
  return (
    <div
      className={`relative group/img cursor-pointer ${className || ""}`}
      onClick={() => onOpenLightbox(allImages, imageIndex)}
    >
      <img
        src={src}
        alt={alt || caption || ""}
        className={`${imgClassName || "w-full h-full object-cover"} transition-transform duration-700 group-hover/img:scale-105`}
        loading="lazy"
      />
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/20 transition-all duration-300 flex items-center justify-center">
        <div className="opacity-0 group-hover/img:opacity-100 transition-all duration-300 transform scale-75 group-hover/img:scale-100">
          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-lg">
            <ZoomIn size={18} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Collect all images from blocks for lightbox ─── */

function collectAllImages(blocks: ContentBlock[], workImage: string): LightboxImage[] {
  const images: LightboxImage[] = [];

  blocks.forEach((block) => {
    if (block.type === "hero-image" && block.image) {
      images.push({ url: block.image, caption: block.heading || "Hero" });
    }
    if (block.type === "image-full" && block.image) {
      images.push({ url: block.image, caption: block.caption });
    }
    if (block.type === "image-text" && block.image) {
      images.push({ url: block.image, caption: block.heading });
    }
    if (
      (block.type === "image-grid-2" ||
        block.type === "image-grid-3" ||
        block.type === "image-grid-6" ||
        block.type === "gallery") &&
      block.images
    ) {
      block.images.forEach((img) => {
        if (img.url) images.push({ url: img.url, caption: img.caption });
      });
    }
  });

  // If no images collected from blocks, use work image
  if (images.length === 0 && workImage) {
    images.push({ url: workImage, caption: "Cover" });
  }

  return images;
}

function getImageIndex(allImages: LightboxImage[], url: string): number {
  const idx = allImages.findIndex((img) => img.url === url);
  return idx >= 0 ? idx : 0;
}

/* ─── Block Renderers ─── */

function HeroImageBlock({
  block,
  allImages,
  onOpenLightbox,
}: {
  block: ContentBlock;
  allImages: LightboxImage[];
  onOpenLightbox: (images: LightboxImage[], index: number) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative w-full aspect-[21/9] min-h-[280px] md:min-h-[400px] overflow-hidden rounded-2xl md:rounded-3xl"
    >
      {block.image && (
        <ClickableImage
          src={block.image}
          alt={block.heading || ""}
          className="absolute inset-0"
          imgClassName="w-full h-full object-cover"
          allImages={allImages}
          imageIndex={getImageIndex(allImages, block.image)}
          onOpenLightbox={onOpenLightbox}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />
      {(block.heading || block.body) && (
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10 lg:p-14 pointer-events-none">
          {block.heading && (
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight">
              {block.heading}
            </h2>
          )}
          {block.body && (
            <p className="text-base md:text-lg text-white/70 mt-2 font-light tracking-wide">
              {block.body}
            </p>
          )}
        </div>
      )}
    </motion.div>
  );
}

function TextBlock({ block, index }: { block: ContentBlock; index: number }) {
  const alignClass =
    block.alignment === "center"
      ? "text-center mx-auto"
      : block.alignment === "right"
        ? "text-right ml-auto"
        : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.05 }}
      className={`max-w-3xl ${alignClass} py-4 md:py-8`}
    >
      {block.heading && (
        <h3
          className="text-xl md:text-2xl lg:text-3xl font-bold mb-3 md:mb-4 tracking-tight"
          style={{ color: "var(--text-primary)" }}
        >
          {block.heading}
        </h3>
      )}
      {block.body && (
        <p
          className="text-sm md:text-base lg:text-lg leading-relaxed whitespace-pre-line"
          style={{ color: "var(--text-secondary)" }}
        >
          {block.body}
        </p>
      )}
    </motion.div>
  );
}

function ImageFullBlock({
  block,
  index,
  allImages,
  onOpenLightbox,
}: {
  block: ContentBlock;
  index: number;
  allImages: LightboxImage[];
  onOpenLightbox: (images: LightboxImage[], index: number) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: index * 0.05 }}
      className="w-full py-2"
    >
      {block.image && (
        <div className="rounded-2xl overflow-hidden">
          <ClickableImage
            src={block.image}
            alt={block.caption || ""}
            imgClassName="w-full h-auto object-cover"
            allImages={allImages}
            imageIndex={getImageIndex(allImages, block.image)}
            onOpenLightbox={onOpenLightbox}
          />
        </div>
      )}
      {block.caption && (
        <p
          className="text-xs md:text-sm mt-3 text-center font-medium"
          style={{ color: "var(--text-tertiary)" }}
        >
          {block.caption}
        </p>
      )}
    </motion.div>
  );
}

function ImageGrid2Block({
  block,
  index,
  allImages,
  onOpenLightbox,
}: {
  block: ContentBlock;
  index: number;
  allImages: LightboxImage[];
  onOpenLightbox: (images: LightboxImage[], index: number) => void;
}) {
  const images = block.images || [];
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: index * 0.05 }}
      className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-5 py-2"
    >
      {images.map((img, i) => (
        <div key={i} className="space-y-2">
          <div className="rounded-2xl overflow-hidden aspect-[4/3]">
            <ClickableImage
              src={img.url}
              alt={img.caption || ""}
              imgClassName="w-full h-full object-cover"
              allImages={allImages}
              imageIndex={getImageIndex(allImages, img.url)}
              onOpenLightbox={onOpenLightbox}
            />
          </div>
          {img.caption && (
            <p
              className="text-xs font-medium text-center"
              style={{ color: "var(--text-tertiary)" }}
            >
              {img.caption}
            </p>
          )}
        </div>
      ))}
    </motion.div>
  );
}

function ImageGrid3Block({
  block,
  index,
  allImages,
  onOpenLightbox,
}: {
  block: ContentBlock;
  index: number;
  allImages: LightboxImage[];
  onOpenLightbox: (images: LightboxImage[], index: number) => void;
}) {
  const images = block.images || [];
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: index * 0.05 }}
      className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-5 py-2"
    >
      {images.map((img, i) => (
        <div key={i} className="space-y-2">
          <div className="rounded-2xl overflow-hidden aspect-square">
            <ClickableImage
              src={img.url}
              alt={img.caption || ""}
              imgClassName="w-full h-full object-cover"
              allImages={allImages}
              imageIndex={getImageIndex(allImages, img.url)}
              onOpenLightbox={onOpenLightbox}
            />
          </div>
          {img.caption && (
            <p
              className="text-xs font-medium text-center"
              style={{ color: "var(--text-tertiary)" }}
            >
              {img.caption}
            </p>
          )}
        </div>
      ))}
    </motion.div>
  );
}

function ImageGrid6Block({
  block,
  index,
  allImages,
  onOpenLightbox,
}: {
  block: ContentBlock;
  index: number;
  allImages: LightboxImage[];
  onOpenLightbox: (images: LightboxImage[], index: number) => void;
}) {
  const images = block.images || [];
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: index * 0.05 }}
      className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4 py-2"
    >
      {images.map((img, i) => (
        <div key={i} className="space-y-2">
          <div className="rounded-xl md:rounded-2xl overflow-hidden aspect-square">
            <ClickableImage
              src={img.url}
              alt={img.caption || ""}
              imgClassName="w-full h-full object-cover"
              allImages={allImages}
              imageIndex={getImageIndex(allImages, img.url)}
              onOpenLightbox={onOpenLightbox}
            />
          </div>
          {img.caption && (
            <p
              className="text-[11px] font-medium text-center"
              style={{ color: "var(--text-tertiary)" }}
            >
              {img.caption}
            </p>
          )}
        </div>
      ))}
    </motion.div>
  );
}

function ImageTextBlock({
  block,
  index,
  accentColor,
  allImages,
  onOpenLightbox,
}: {
  block: ContentBlock;
  index: number;
  accentColor: string;
  allImages: LightboxImage[];
  onOpenLightbox: (images: LightboxImage[], index: number) => void;
}) {
  const isRight = block.textSide === "right";
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: index * 0.05 }}
      className={`grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 py-4 items-center ${isRight ? "" : "md:[direction:rtl]"}`}
    >
      <div className={`rounded-2xl overflow-hidden aspect-[4/3] ${isRight ? "" : "md:[direction:ltr]"}`}>
        {block.image && (
          <ClickableImage
            src={block.image}
            alt={block.heading || ""}
            imgClassName="w-full h-full object-cover"
            allImages={allImages}
            imageIndex={getImageIndex(allImages, block.image)}
            onOpenLightbox={onOpenLightbox}
          />
        )}
      </div>
      <div className={`space-y-3 ${isRight ? "" : "md:[direction:ltr]"}`}>
        {block.heading && (
          <h3
            className="text-xl md:text-2xl font-bold tracking-tight"
            style={{ color: "var(--text-primary)" }}
          >
            {block.heading}
          </h3>
        )}
        {block.body && (
          <p
            className="text-sm md:text-base leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            {block.body}
          </p>
        )}
        <div className="w-12 h-0.5 rounded-full" style={{ background: accentColor }} />
      </div>
    </motion.div>
  );
}

function QuoteBlock({
  block,
  index,
  accentColor,
}: {
  block: ContentBlock;
  index: number;
  accentColor: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: index * 0.05 }}
      className="py-6 md:py-10 max-w-3xl mx-auto text-center"
    >
      <div className="relative px-6 md:px-12">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 text-6xl md:text-8xl font-serif leading-none opacity-15"
          style={{ color: accentColor }}
        >
          &ldquo;
        </div>
        {block.quote && (
          <blockquote
            className="text-lg md:text-xl lg:text-2xl font-light italic leading-relaxed relative z-10 pt-6"
            style={{ color: "var(--text-primary)" }}
          >
            {block.quote}
          </blockquote>
        )}
        {block.author && (
          <p
            className="mt-4 text-sm font-semibold uppercase tracking-[0.15em]"
            style={{ color: accentColor }}
          >
            — {block.author}
          </p>
        )}
      </div>
    </motion.div>
  );
}

function SpacerBlock({ block }: { block: ContentBlock }) {
  const sizeMap = { sm: "py-4", md: "py-8", lg: "py-14" };
  const s = block.size || "md";
  return (
    <div className={`${sizeMap[s]} flex items-center justify-center`}>
      <div className="w-16 h-px rounded-full" style={{ background: "var(--divider)" }} />
    </div>
  );
}

function GalleryBlock({
  block,
  index,
  allImages,
  onOpenLightbox,
}: {
  block: ContentBlock;
  index: number;
  allImages: LightboxImage[];
  onOpenLightbox: (images: LightboxImage[], index: number) => void;
}) {
  const images = block.images || [];
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: index * 0.05 }}
      className="py-2"
    >
      <div className="columns-2 md:columns-3 gap-3 md:gap-4 space-y-3 md:space-y-4">
        {images.map((img, i) => (
          <div key={i} className="break-inside-avoid">
            <div className="rounded-xl overflow-hidden">
              <ClickableImage
                src={img.url}
                alt={img.caption || ""}
                imgClassName="w-full h-auto object-cover"
                allImages={allImages}
                imageIndex={getImageIndex(allImages, img.url)}
                onOpenLightbox={onOpenLightbox}
              />
            </div>
            {img.caption && (
              <p
                className="text-xs mt-1.5 font-medium"
                style={{ color: "var(--text-tertiary)" }}
              >
                {img.caption}
              </p>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ─── Block Renderer Switch ─── */

function BlockRenderer({
  block,
  index,
  accentColor,
  allImages,
  onOpenLightbox,
}: {
  block: ContentBlock;
  index: number;
  accentColor: string;
  allImages: LightboxImage[];
  onOpenLightbox: (images: LightboxImage[], index: number) => void;
}) {
  switch (block.type) {
    case "hero-image":
      return <HeroImageBlock block={block} allImages={allImages} onOpenLightbox={onOpenLightbox} />;
    case "text":
      return <TextBlock block={block} index={index} />;
    case "image-full":
      return <ImageFullBlock block={block} index={index} allImages={allImages} onOpenLightbox={onOpenLightbox} />;
    case "image-grid-2":
      return <ImageGrid2Block block={block} index={index} allImages={allImages} onOpenLightbox={onOpenLightbox} />;
    case "image-grid-3":
      return <ImageGrid3Block block={block} index={index} allImages={allImages} onOpenLightbox={onOpenLightbox} />;
    case "image-grid-6":
      return <ImageGrid6Block block={block} index={index} allImages={allImages} onOpenLightbox={onOpenLightbox} />;
    case "image-text":
      return <ImageTextBlock block={block} index={index} accentColor={accentColor} allImages={allImages} onOpenLightbox={onOpenLightbox} />;
    case "quote":
      return <QuoteBlock block={block} index={index} accentColor={accentColor} />;
    case "spacer":
      return <SpacerBlock block={block} />;
    case "gallery":
      return <GalleryBlock block={block} index={index} allImages={allImages} onOpenLightbox={onOpenLightbox} />;
    default:
      return null;
  }
}

/* ─── Auto Layout (for works without content blocks) ─── */

function AutoLayout({
  work,
  accentColor,
  allImages,
  onOpenLightbox,
}: {
  work: WorkItem;
  accentColor: string;
  allImages: LightboxImage[];
  onOpenLightbox: (images: LightboxImage[], index: number) => void;
}) {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative w-full aspect-[16/9] overflow-hidden rounded-2xl md:rounded-3xl"
      >
        <ClickableImage
          src={work.image}
          alt={work.title}
          className="absolute inset-0"
          imgClassName="w-full h-full object-cover"
          allImages={allImages}
          imageIndex={0}
          onOpenLightbox={onOpenLightbox}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10 pointer-events-none">
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
            {work.title}
          </h2>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="max-w-3xl mx-auto text-center py-4"
      >
        <p
          className="text-base md:text-lg lg:text-xl leading-relaxed"
          style={{ color: "var(--text-secondary)" }}
        >
          {work.description}
        </p>
        <div
          className="w-12 h-0.5 rounded-full mx-auto mt-6"
          style={{ background: accentColor }}
        />
      </motion.div>
    </div>
  );
}

/* ─── Main Project View ─── */

export function ProjectView({ work, member, onBack }: ProjectViewProps) {
  const blocks = work.contentBlocks || [];
  const hasBlocks = blocks.length > 0;
  const scrollRef = useRef<HTMLDivElement>(null);
  const lightbox = useImageLightbox();

  const allImages = collectAllImages(blocks, work.image);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [work.id]);

  return (
    <div ref={scrollRef} className="h-full overflow-y-auto hide-scrollbar">
      {/* Back navigation */}
      <div className="sticky top-0 z-20 glass px-4 md:px-6 py-3">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm font-medium transition-all duration-300 hover:opacity-70 group"
            style={{ color: "var(--text-primary)" }}
          >
            <ArrowLeft
              size={16}
              className="transition-transform duration-300 group-hover:-translate-x-1"
            />
            <span className="hidden sm:inline">Back to {member.firstName}&apos;s Portfolio</span>
            <span className="sm:hidden">Back</span>
          </button>
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-lg overflow-hidden"
              style={{ boxShadow: `0 0 0 1.5px ${member.accentColor}` }}
            >
              <img
                src={member.avatar}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
            <span
              className="text-xs font-semibold hidden sm:inline"
              style={{ color: "var(--text-secondary)" }}
            >
              {member.firstName} · {member.role}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-10 space-y-6 md:space-y-10">
        {/* Project title (only shown if no hero block) */}
        {hasBlocks && blocks[0]?.type !== "hero-image" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-4"
          >
            <h1
              className="text-3xl md:text-5xl font-bold tracking-tight"
              style={{ color: "var(--text-primary)" }}
            >
              {work.title}
            </h1>
            <p
              className="text-base md:text-lg mt-3"
              style={{ color: "var(--text-secondary)" }}
            >
              {work.description}
            </p>
          </motion.div>
        )}

        {/* Render blocks or auto layout */}
        {hasBlocks ? (
          blocks.map((block, i) => (
            <BlockRenderer
              key={block.id}
              block={block}
              index={i}
              accentColor={member.accentColor}
              allImages={allImages}
              onOpenLightbox={lightbox.open}
            />
          ))
        ) : (
          <AutoLayout
            work={work}
            accentColor={member.accentColor}
            allImages={allImages}
            onOpenLightbox={lightbox.open}
          />
        )}

        {/* Divider */}
        <div className="py-4 flex items-center justify-center">
          <div
            className="w-24 h-px rounded-full"
            style={{ background: "var(--divider)" }}
          />
        </div>

        {/* Tools & Meta */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-2xl mx-auto text-center pb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Wrench size={14} style={{ color: "var(--text-tertiary)" }} />
            <span
              className="text-xs font-semibold uppercase tracking-[0.15em]"
              style={{ color: "var(--text-tertiary)" }}
            >
              Tools Used
            </span>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {work.tools.map((tool) => (
              <span
                key={tool}
                className="text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full"
                style={{
                  background: `${member.accentColor}15`,
                  color: member.accentColor,
                }}
              >
                {tool}
              </span>
            ))}
          </div>

          {/* Project info */}
          <div className="mt-8 pt-6 border-t" style={{ borderColor: "var(--divider)" }}>
            <p
              className="text-sm font-medium"
              style={{ color: "var(--text-secondary)" }}
            >
              {work.title} — by{" "}
              <span style={{ color: member.accentColor }}>{member.name}</span>
            </p>
            <p
              className="text-xs mt-1"
              style={{ color: "var(--text-tertiary)" }}
            >
              {member.role}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Image Lightbox */}
      <ImageLightbox
        images={lightbox.images}
        currentIndex={lightbox.currentIndex}
        isOpen={lightbox.isOpen}
        onClose={lightbox.close}
        onNext={lightbox.next}
        onPrev={lightbox.prev}
        accentColor={member.accentColor}
      />
    </div>
  );
}
