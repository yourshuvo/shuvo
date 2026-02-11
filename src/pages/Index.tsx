import { useState } from "react";
import { Instagram, Twitter, Github, SkipBack, SkipForward, Music, Disc3 } from "lucide-react";
import { BLOG_POSTS } from "@/data/blog-posts";
import { SPOTIFY_SONGS } from "@/data/spotify-songs";

// ═══════════════════════════════════════════
// ✏️  EDIT YOUR INFO HERE
// ═══════════════════════════════════════════

const PROFILE = {
  name: "your.name",
  bio: "designer · developer · pixel enthusiast",
};

const SOCIALS = [
  { icon: Instagram, url: "https://instagram.com", label: "Instagram" },
  { icon: Twitter, url: "https://x.com", label: "Twitter / X" },
  { icon: Github, url: "https://github.com", label: "GitHub" },
];

// ═══════════════════════════════════════════

const Index = () => {
  const [currentSong, setCurrentSong] = useState(0);
  const [expandedPost, setExpandedPost] = useState<string | null>(null);

  const prevSong = () =>
    setCurrentSong((i) => (i === 0 ? SPOTIFY_SONGS.length - 1 : i - 1));
  const nextSong = () =>
    setCurrentSong((i) => (i === SPOTIFY_SONGS.length - 1 ? 0 : i + 1));

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-16">
      <div className="w-full max-w-md flex flex-col items-center gap-8">

        {/* Avatar */}
        <div
          className="animate-pixel-in w-24 h-24 bg-muted pixel-avatar flex items-center justify-center"
          style={{ animationDelay: "0s" }}
        >
          <span className="text-4xl select-none" style={{ fontFamily: "Silkscreen, monospace" }}>
            ▪
          </span>
        </div>

        {/* Name & Bio */}
        <div className="animate-pixel-in text-center" style={{ animationDelay: "0.1s" }}>
          <h1
            className="text-2xl font-bold tracking-tight text-foreground"
            style={{ fontFamily: "Silkscreen, monospace" }}
          >
            {PROFILE.name}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">{PROFILE.bio}</p>
        </div>

        {/* Social Icons */}
        <div
          className="animate-pixel-in flex items-center gap-6"
          style={{ animationDelay: "0.15s" }}
        >
          {SOCIALS.map((s) => {
            const Icon = s.icon;
            return (
              <a
                key={s.label}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="social-icon text-muted-foreground hover:text-foreground"
              >
                <Icon size={20} />
              </a>
            );
          })}
        </div>

        {/* Divider */}
        <div className="pixel-divider w-full animate-pixel-in" style={{ animationDelay: "0.2s" }} />

        {/* ── Spotify Songs ── */}
        <div className="w-full animate-pixel-in" style={{ animationDelay: "0.25s" }}>

          <div className="border-2 border-foreground bg-background overflow-hidden">
            {/* Now playing header bar */}
            <div className="bg-foreground text-background px-4 py-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Disc3
                  size={14}
                  className="animate-[spin_3s_linear_infinite]"
                />
                <span
                  className="text-[10px] font-bold uppercase tracking-[0.2em]"
                  style={{ fontFamily: "Silkscreen, monospace" }}
                >
                  now playing
                </span>
              </div>
              <span
                className="text-[10px] tracking-wider opacity-60"
                style={{ fontFamily: "Silkscreen, monospace" }}
              >
                {String(currentSong + 1).padStart(2, "0")}/{String(SPOTIFY_SONGS.length).padStart(2, "0")}
              </span>
            </div>

            {/* Song info + controls */}
            <div className="px-4 py-3">
              <div className="flex items-center gap-3">
                {/* Prev */}
                <button
                  onClick={prevSong}
                  className="text-muted-foreground hover:text-foreground transition-transform hover:scale-110 active:scale-95"
                  aria-label="Previous song"
                >
                  <SkipBack size={16} fill="currentColor" />
                </button>

                {/* Track info */}
                <div className="flex-1 min-w-0 text-center">
                  <p
                    className="text-sm font-bold text-foreground truncate"
                    style={{ fontFamily: "Silkscreen, monospace" }}
                  >
                    {SPOTIFY_SONGS[currentSong].title}
                  </p>
                  <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                    {SPOTIFY_SONGS[currentSong].artist}
                  </p>
                </div>

                {/* Next */}
                <button
                  onClick={nextSong}
                  className="text-muted-foreground hover:text-foreground transition-transform hover:scale-110 active:scale-95"
                  aria-label="Next song"
                >
                  <SkipForward size={16} fill="currentColor" />
                </button>
              </div>

              {/* Track selector bar */}
              <div className="flex items-center gap-1 mt-3">
                {SPOTIFY_SONGS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSong(i)}
                    className={`h-1 flex-1 transition-all duration-200 ${
                      i === currentSong
                        ? "bg-foreground"
                        : i < currentSong
                        ? "bg-muted-foreground/40"
                        : "bg-muted"
                    }`}
                    aria-label={`Song ${i + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Spotify embed */}
            <iframe
              key={SPOTIFY_SONGS[currentSong].trackId}
              src={`https://open.spotify.com/embed/track/${SPOTIFY_SONGS[currentSong].trackId}?utm_source=generator&theme=0`}
              width="100%"
              height="80"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              style={{ borderRadius: 0 }}
            />
          </div>
        </div>

        {/* Divider */}
        <div className="pixel-divider w-full animate-pixel-in" style={{ animationDelay: "0.35s" }} />

        {/* ── Blog Posts ── */}
        <div className="w-full animate-pixel-in" style={{ animationDelay: "0.4s" }}>
          <h2
            className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground mb-4"
            style={{ fontFamily: "Silkscreen, monospace" }}
          >
            ▸ blog
          </h2>

          <div className="flex flex-col gap-2">
            {BLOG_POSTS.map((post) => (
              <button
                key={post.slug}
                onClick={() =>
                  setExpandedPost(expandedPost === post.slug ? null : post.slug)
                }
                className="w-full text-left border-2 border-foreground bg-background px-4 py-3 pixel-link"
                style={{ fontFamily: "Silkscreen, monospace" }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest text-foreground">
                    {post.title}
                  </span>
                  <span className="text-[10px] text-muted-foreground">{post.date}</span>
                </div>

                {expandedPost === post.slug && (
                  <div
                    className="mt-3 pt-3 border-t border-border text-xs text-muted-foreground leading-relaxed whitespace-pre-line"
                    style={{ fontFamily: "'Space Mono', monospace" }}
                  >
                    {post.content}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p
          className="animate-pixel-in text-xs text-muted-foreground tracking-widest mt-4"
          style={{ animationDelay: "0.5s", fontFamily: "Silkscreen, monospace" }}
        >
          ░░░░░░░░░░
        </p>
      </div>
    </div>
  );
};

export default Index;
