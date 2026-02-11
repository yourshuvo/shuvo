import { useState } from "react";
import { Instagram, Twitter, Github, ChevronLeft, ChevronRight, Music } from "lucide-react";
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
          <h2
            className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground mb-4 flex items-center gap-2"
            style={{ fontFamily: "Silkscreen, monospace" }}
          >
            <Music size={14} /> now spinning
          </h2>

          <div className="border-2 border-foreground bg-background p-3">
            {/* Song switcher controls */}
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={prevSong}
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Previous song"
              >
                <ChevronLeft size={18} />
              </button>
              <div className="text-center">
                <p
                  className="text-xs font-bold text-foreground uppercase tracking-widest"
                  style={{ fontFamily: "Silkscreen, monospace" }}
                >
                  {SPOTIFY_SONGS[currentSong].title}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {SPOTIFY_SONGS[currentSong].artist}
                </p>
              </div>
              <button
                onClick={nextSong}
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Next song"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            {/* Song progress dots */}
            <div className="flex items-center justify-center gap-1.5 mb-3">
              {SPOTIFY_SONGS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSong(i)}
                  className={`w-2 h-2 transition-colors ${
                    i === currentSong ? "bg-foreground" : "bg-muted"
                  }`}
                  aria-label={`Song ${i + 1}`}
                />
              ))}
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
              className="rounded-none"
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
