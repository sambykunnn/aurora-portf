import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Wrench } from "lucide-react";
import type { TeamMember, WorkItem, ContentBlock } from "@/data/teamData";

interface ProjectViewProps {
  work: WorkItem;
  member: TeamMember;
  onBack: () => void;
}

/* ─── Video URL Parser ─── */

function parseVideoUrl(url: string): { type: "youtube" | "vimeo" | "direct"; embedUrl: string } | null {
  if (!url) return null;
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  if (ytMatch) {
    return { type: "youtube", embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}?rel=0` };
  }
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) {
    return { type: "vimeo", embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}` };
  }
  const driveMatch = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (driveMatch) {
    return { type: "direct", embedUrl: `https://drive.google.com/file/d/${driveMatch[1]}/preview` };
  }
  if (/\.(mp4|webm|mov|ogg)(\?|$)/i.test(url)) {
    return { type: "direct", embedUrl: url };
  }
  return { type: "direct", embedUrl: url };
}

function VideoEmbed({ url, caption, autoplay, loop }: { url: string; caption?: string; autoplay?: boolean; loop?: boolean }) {
  const parsed = parseVideoUrl(url);
  if (!parsed) return null;

  if (parsed.type === "youtube" || parsed.type === "vimeo") {
    let embedSrc = parsed.embedUrl;
    if (parsed.type === "youtube") {
      const params = new URLSearchParams();
      params.set("rel", "0");
      if (autoplay) params.set("autoplay", "1");
      if (loop) params.set("loop", "1");
      embedSrc = `https://www.youtube.com/embed/${url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)![1]}?${params.toString()}`;
    }
    if (parsed.type === "vimeo") {
      const params = new URLSearchParams();
      if (autoplay) params.set("autoplay", "1");
      if (loop) params.set("loop", "1");
      embedSrc = `${parsed.embedUrl}?${params.toString()}`;
    }
    return (
      <div>
        <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
          <iframe
            src={embedSrc}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={caption || "Video"}
          />
        </div>
        {caption && (
          <p className="text-xs md:text-sm mt-3 text-center font-medium" style={{ color: "var(--text-tertiary)" }}>
            {caption}
          </p>
        )}
      </div>
    );
  }

  if (url.includes("drive.google.com")) {
    return (
      <div>
        <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
          <iframe
            src={parsed.embedUrl}
            className="absolute inset-0 w-full h-full"
            allow="autoplay; encrypted-media"
            allowFullScreen
            title={caption || "Video"}
          />
        </div>
        {caption && (
          <p className="text-xs md:text-sm mt-3 text-center font-medium" style={{ color: "var(--text-tertiary)" }}>
            {caption}
          </p>
        )}
      </div>
    );
  }

  return (
    <div>
      <video
        src={parsed.embedUrl}
        controls
        autoPlay={autoplay}
        loop={loop}
        muted={autoplay}
        playsInline
        className="w-full h-auto"
        preload="metadata"
      >
        Your browser does not support the video tag.
      </video>
      {caption && (
        <p className="text-xs md:text-sm mt-3 text-center font-medium" style={{ color: "var(--text-tertiary)" }}>
          {caption}
        </p>
      )}
    </div>
  );
}

/* ─── Block Renderers ─── */
/* ALL image blocks: NO rounded corners, NO object-cover, NO aspect-ratio constraints */
/* Images display at full natural size */

function HeroImageBlock({ block }: { block: ContentBlock }) {
  return (
    <div className="relative w-full">
      {block.image && (
        <img
          src={block.image}
          alt={block.heading || ""}
          className="w-full h-auto block"
          loading="lazy"
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
    </div>
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
      className={`max-w-3xl ${alignClass} py-6 md:py-10 px-4 md:px-0`}
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

function ImageFullBlock({ block, index }: { block: ContentBlock; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: index * 0.05 }}
      className="w-full"
    >
      {block.image && (
        <img
          src={block.image}
          alt={block.caption || ""}
          className="w-full h-auto block"
          loading="lazy"
        />
      )}
      {block.caption && (
        <p
          className="text-xs md:text-sm mt-3 text-center font-medium px-4"
          style={{ color: "var(--text-tertiary)" }}
        >
          {block.caption}
        </p>
      )}
    </motion.div>
  );
}

function ImageGrid2Block({ block, index }: { block: ContentBlock; index: number }) {
  const images = block.images || [];
  const gapPx = block.gap ?? 4;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: index * 0.05 }}
      className="w-full"
    >
      <div
        className="grid grid-cols-2 items-start"
        style={{ gap: `${gapPx}px` }}
      >
        {images.map((img, i) => (
          <div key={i}>
            {img.url && (
              <img
                src={img.url}
                alt={img.caption || ""}
                className="w-full h-auto block"
                loading="lazy"
              />
            )}
            {img.caption && (
              <p className="text-xs font-medium text-center mt-1" style={{ color: "var(--text-tertiary)" }}>
                {img.caption}
              </p>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function ImageGrid3Block({ block, index }: { block: ContentBlock; index: number }) {
  const images = block.images || [];
  const gapPx = block.gap ?? 4;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: index * 0.05 }}
      className="w-full"
    >
      <div
        className="grid grid-cols-3 items-start"
        style={{ gap: `${gapPx}px` }}
      >
        {images.map((img, i) => (
          <div key={i}>
            {img.url && (
              <img
                src={img.url}
                alt={img.caption || ""}
                className="w-full h-auto block"
                loading="lazy"
              />
            )}
            {img.caption && (
              <p className="text-xs font-medium text-center mt-1" style={{ color: "var(--text-tertiary)" }}>
                {img.caption}
              </p>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function ImageGrid6Block({ block, index }: { block: ContentBlock; index: number }) {
  const images = block.images || [];
  const gapPx = block.gap ?? 4;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: index * 0.05 }}
      className="w-full"
    >
      <div
        className="grid grid-cols-2 sm:grid-cols-3 items-start"
        style={{ gap: `${gapPx}px` }}
      >
        {images.map((img, i) => (
          <div key={i}>
            {img.url && (
              <img
                src={img.url}
                alt={img.caption || ""}
                className="w-full h-auto block"
                loading="lazy"
              />
            )}
            {img.caption && (
              <p className="text-[11px] font-medium text-center mt-1" style={{ color: "var(--text-tertiary)" }}>
                {img.caption}
              </p>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function ImageTextBlock({
  block,
  index,
  accentColor,
}: {
  block: ContentBlock;
  index: number;
  accentColor: string;
}) {
  const isRight = block.textSide === "right";
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: index * 0.05 }}
      className={`grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 py-4 items-start ${isRight ? "" : "md:[direction:rtl]"}`}
    >
      <div className={isRight ? "" : "md:[direction:ltr]"}>
        {block.image && (
          <img
            src={block.image}
            alt={block.heading || ""}
            className="w-full h-auto block"
            loading="lazy"
          />
        )}
      </div>
      <div className={`space-y-3 px-4 md:px-0 ${isRight ? "" : "md:[direction:ltr]"}`}>
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
        <div className="w-12 h-0.5" style={{ background: accentColor }} />
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
      <div className="w-16 h-px" style={{ background: "var(--divider)" }} />
    </div>
  );
}

function GalleryBlock({ block, index }: { block: ContentBlock; index: number }) {
  const images = block.images || [];
  const gapPx = block.gap ?? 4;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: index * 0.05 }}
      className="w-full"
    >
      <div
        className="columns-2 md:columns-3"
        style={{ gap: `${gapPx}px` }}
      >
        {images.map((img, i) => (
          <div key={i} className="break-inside-avoid" style={{ marginBottom: `${gapPx}px` }}>
            {img.url && (
              <img
                src={img.url}
                alt={img.caption || ""}
                className="w-full h-auto block"
                loading="lazy"
              />
            )}
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

/* ─── Video Blocks ─── */

function VideoBlock({ block, index }: { block: ContentBlock; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: index * 0.05 }}
      className="w-full"
    >
      {block.heading && (
        <h3
          className="text-lg md:text-xl font-bold mb-4 px-4 md:px-0"
          style={{ color: "var(--text-primary)" }}
        >
          {block.heading}
        </h3>
      )}
      {block.videoUrl && (
        <VideoEmbed
          url={block.videoUrl}
          caption={block.caption}
          autoplay={block.autoplay}
          loop={block.loop}
        />
      )}
      {block.body && (
        <p
          className="text-sm md:text-base mt-4 max-w-3xl mx-auto leading-relaxed px-4 md:px-0"
          style={{ color: "var(--text-secondary)" }}
        >
          {block.body}
        </p>
      )}
    </motion.div>
  );
}

function VideoGridBlock({ block, index }: { block: ContentBlock; index: number }) {
  const videos = block.videos || [];
  const cols = videos.length <= 2 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3";
  const gapPx = block.gap ?? 8;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: index * 0.05 }}
      className="w-full"
    >
      {block.heading && (
        <h3
          className="text-lg md:text-xl font-bold mb-4 px-4 md:px-0"
          style={{ color: "var(--text-primary)" }}
        >
          {block.heading}
        </h3>
      )}
      <div className={`grid grid-cols-1 ${cols}`} style={{ gap: `${gapPx}px` }}>
        {videos.map((vid, i) => (
          <div key={i}>
            <VideoEmbed url={vid.url} caption={vid.caption} />
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ─── Block Renderer Switch ─── */

/* Check if a block is a pure image block (no text, no spacing needed) */
function isImageBlock(type: string): boolean {
  return [
    "hero-image",
    "image-full",
    "image-grid-2",
    "image-grid-3",
    "image-grid-6",
  ].includes(type);
}

function BlockRenderer({
  block,
  index,
  accentColor,
  prevBlockType,
  nextBlockType,
}: {
  block: ContentBlock;
  index: number;
  accentColor: string;
  prevBlockType?: string;
  nextBlockType?: string;
}) {
  /* Calculate vertical spacing:
     - Image block next to image block = use the block's gap value (or 0)
     - Image block next to non-image = small spacing
     - Non-image blocks handle their own padding internally */
  
  let marginTop = 0;
  const currentIsImage = isImageBlock(block.type);
  const prevIsImage = prevBlockType ? isImageBlock(prevBlockType) : false;

  if (index > 0 && currentIsImage && prevIsImage) {
    // Two image blocks stacked: use the current block's gap for consistency
    marginTop = block.gap ?? 4;
  } else if (index > 0 && currentIsImage && !prevIsImage) {
    marginTop = 0; // Text/quote blocks already have bottom padding
  } else if (index > 0 && !currentIsImage && prevIsImage) {
    marginTop = 0; // Non-image blocks have their own top padding
  }

  // For gallery block, it uses its own gap so no extra margin needed
  if (block.type === "gallery") marginTop = 0;

  void nextBlockType; // may be used in future

  const inner = (() => {
    switch (block.type) {
      case "hero-image":
        return <HeroImageBlock block={block} />;
      case "text":
        return <TextBlock block={block} index={index} />;
      case "image-full":
        return <ImageFullBlock block={block} index={index} />;
      case "image-grid-2":
        return <ImageGrid2Block block={block} index={index} />;
      case "image-grid-3":
        return <ImageGrid3Block block={block} index={index} />;
      case "image-grid-6":
        return <ImageGrid6Block block={block} index={index} />;
      case "image-text":
        return <ImageTextBlock block={block} index={index} accentColor={accentColor} />;
      case "quote":
        return <QuoteBlock block={block} index={index} accentColor={accentColor} />;
      case "spacer":
        return <SpacerBlock block={block} />;
      case "gallery":
        return <GalleryBlock block={block} index={index} />;
      case "video":
        return <VideoBlock block={block} index={index} />;
      case "video-grid":
        return <VideoGridBlock block={block} index={index} />;
      default:
        return null;
    }
  })();

  return (
    <div style={{ marginTop: `${marginTop}px` }}>
      {inner}
    </div>
  );
}

/* ─── Auto Layout ─── */

function AutoLayout({
  work,
  accentColor,
}: {
  work: WorkItem;
  accentColor: string;
}) {
  return (
    <div>
      <div className="relative w-full">
        <img
          src={work.image}
          alt={work.title}
          className="w-full h-auto block"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10 pointer-events-none">
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
            {work.title}
          </h2>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="max-w-3xl mx-auto text-center py-8 px-4"
      >
        <p
          className="text-base md:text-lg lg:text-xl leading-relaxed"
          style={{ color: "var(--text-secondary)" }}
        >
          {work.description}
        </p>
        <div
          className="w-12 h-0.5 mx-auto mt-6"
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
              className="w-6 h-6 overflow-hidden"
              style={{ boxShadow: `0 0 0 1.5px ${member.accentColor}` }}
            >
              {member.avatar ? (
                <img
                  src={member.avatar}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center text-white text-xs font-bold"
                  style={{ background: member.accentColor }}
                >
                  {member.firstName.charAt(0)}
                </div>
              )}
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
      <div className="max-w-5xl mx-auto">
        {hasBlocks && blocks[0]?.type !== "hero-image" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-8 px-4"
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

        {/* Blocks rendered with smart spacing */}
        <div>
          {hasBlocks ? (
            blocks.map((block, i) => (
              <BlockRenderer
                key={block.id}
                block={block}
                index={i}
                accentColor={member.accentColor}
                prevBlockType={i > 0 ? blocks[i - 1].type : undefined}
                nextBlockType={i < blocks.length - 1 ? blocks[i + 1].type : undefined}
              />
            ))
          ) : (
            <AutoLayout work={work} accentColor={member.accentColor} />
          )}
        </div>

        {/* Divider */}
        <div className="py-8 flex items-center justify-center">
          <div
            className="w-24 h-px"
            style={{ background: "var(--divider)" }}
          />
        </div>

        {/* Tools & Meta */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-2xl mx-auto text-center pb-12 px-4"
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
                className="text-xs font-semibold uppercase tracking-wider px-3 py-1.5"
                style={{
                  background: `${member.accentColor}15`,
                  color: member.accentColor,
                }}
              >
                {tool}
              </span>
            ))}
          </div>

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
    </div>
  );
}
