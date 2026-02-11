import { Instagram, Twitter, Github, Music, ExternalLink } from "lucide-react";

// ═══════════════════════════════════════════
// ✏️  EDIT YOUR INFO HERE
// ═══════════════════════════════════════════

const PROFILE = {
  name: "your.name",
  bio: "designer · developer · pixel enthusiast",
};

const LINKS = [
  { label: "my portfolio", url: "https://yoursite.com", icon: ExternalLink },
  { label: "blog", url: "https://yourblog.com", icon: ExternalLink },
  { label: "spotify playlist", url: "https://spotify.com", icon: Music },
  { label: "cool project", url: "https://github.com", icon: Github },
];

const SOCIALS = [
  { icon: Instagram, url: "https://instagram.com", label: "Instagram" },
  { icon: Twitter, url: "https://x.com", label: "Twitter / X" },
  { icon: Github, url: "https://github.com", label: "GitHub" },
];

// ═══════════════════════════════════════════

const Index = () => {
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

        {/* Divider */}
        <div className="pixel-divider w-full animate-pixel-in" style={{ animationDelay: "0.15s" }} />

        {/* Links */}
        <div className="w-full flex flex-col gap-3">
          {LINKS.map((link, i) => {
            const Icon = link.icon;
            return (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="animate-pixel-in pixel-link flex items-center gap-3 border-2 border-foreground bg-background px-5 py-4 text-foreground hover:bg-foreground hover:text-background"
                style={{
                  animationDelay: `${0.2 + i * 0.08}s`,
                  fontFamily: "Silkscreen, monospace",
                }}
              >
                <Icon size={18} strokeWidth={2.5} />
                <span className="text-sm font-bold uppercase tracking-widest">{link.label}</span>
              </a>
            );
          })}
        </div>

        {/* Divider */}
        <div className="pixel-divider w-full animate-pixel-in" style={{ animationDelay: "0.55s" }} />

        {/* Social Icons */}
        <div
          className="animate-pixel-in flex items-center gap-6"
          style={{ animationDelay: "0.6s" }}
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

        {/* Footer */}
        <p
          className="animate-pixel-in text-xs text-muted-foreground tracking-widest"
          style={{ animationDelay: "0.7s", fontFamily: "Silkscreen, monospace" }}
        >
          ░░░░░░░░░░
        </p>
      </div>
    </div>
  );
};

export default Index;
