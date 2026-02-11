import { useState, useRef, useEffect, useCallback } from "react";
import { Instagram, X, Github, Play, Pause, Facebook, MessageCircle } from "lucide-react";
import { BLOG_POSTS } from "@/data/blog-posts";
import { SPOTIFY_SONGS } from "@/data/spotify-songs";

// ═══════════════════════════════════════════
// ✏️  EDIT YOUR INFO HERE
// ═══════════════════════════════════════════

const PROFILE = {
  name: "Shuvo",
  bio: "loser · weirdo ",
};

const SOCIALS = [
  { icon: Instagram, url: "https://instagram.com/shuvoisalive", label: "Instagram" },
  { icon: Github, url: "https://github.com/shuvoooooooalive", label: "GitHub" },
  { icon: Facebook, url: "https://facebook.com/shuvoisalive", label: "Facebook" },
];

const SEGMENT = 360 / SPOTIFY_SONGS.length;
const WHEEL_SM = 96;  // half of w-48 (192px) — mobile
const WHEEL_LG = 112; // half of w-56 (224px) — desktop
const SM_BREAKPOINT = 640;

// Each song enters from a different direction
const ENTRY_ANIMATIONS = [
  'fade-in slide-in-from-bottom-4',
  'fade-in slide-in-from-left-4',
  'fade-in zoom-in-90',
  'fade-in slide-in-from-right-4',
  'fade-in slide-in-from-top-4',
  'fade-in slide-in-from-left-8',
  'fade-in zoom-in-75',
  'fade-in slide-in-from-right-8',
];

// ═══════════════════════════════════════════

const Index = () => {
  const [currentSong, setCurrentSong] = useState(0);
  const [expandedPost, setExpandedPost] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [bgImages, setBgImages] = useState({ current: SPOTIFY_SONGS[0].image, prev: '' });
  const [bgReady, setBgReady] = useState(false);
  const [voidText, setVoidText] = useState('');
  const [voidFading, setVoidFading] = useState(false);
  const [voidGone, setVoidGone] = useState(false);
  const voidTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [wheelRadius, setWheelRadius] = useState(
    typeof window !== 'undefined' && window.innerWidth >= SM_BREAKPOINT ? WHEEL_LG : WHEEL_SM
  );

  // Keep wheel radius in sync with viewport
  useEffect(() => {
    const onResize = () => {
      setWheelRadius(window.innerWidth >= SM_BREAKPOINT ? WHEEL_LG : WHEEL_SM);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const startAngleRef = useRef(0);
  const startRotationRef = useRef(0);
  const wheelRef = useRef<HTMLDivElement>(null);
  const lastFeedbackIndex = useRef(-1);
  const embedRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<any>(null);
  const currentSongRef = useRef(currentSong);
  const isPlayingRef = useRef(isPlaying);
  const rotationRef = useRef(rotation);
  const pendingAutoPlayRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toggleBusyRef = useRef(false);

  // Keep refs in sync
  currentSongRef.current = currentSong;
  isPlayingRef.current = isPlaying;
  rotationRef.current = rotation;

  // ── Spotify IFrame API ──
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://open.spotify.com/embed/iframe-api/v1';
    script.async = true;
    document.body.appendChild(script);

    (window as any).onSpotifyIframeApiReady = (IFrameAPI: any) => {
      if (!embedRef.current) return;
      IFrameAPI.createController(embedRef.current, {
        uri: `spotify:track:${SPOTIFY_SONGS[0].trackId}`,
        width: '100%',
        height: 80,
      }, (controller: any) => {
        controllerRef.current = controller;
        controller.addListener('playback_update', (e: any) => {
          setIsPlaying(!e.data.isPaused);
        });
      });
    };

    return () => {
      try { document.body.removeChild(script); } catch {}
      delete (window as any).onSpotifyIframeApiReady;
    };
  }, []);

  // ── Song change → update embed ──
  const prevSongRef = useRef(currentSong);
  useEffect(() => {
    if (!controllerRef.current || prevSongRef.current === currentSong) return;
    const wasPlaying = isPlayingRef.current;
    prevSongRef.current = currentSong;

    // Cancel any pending auto-play from a previous song change
    if (pendingAutoPlayRef.current) {
      clearTimeout(pendingAutoPlayRef.current);
      pendingAutoPlayRef.current = null;
    }
    // Always reset busy flag when loading a new song — prevents it getting stuck
    toggleBusyRef.current = false;

    controllerRef.current.loadUri(`spotify:track:${SPOTIFY_SONGS[currentSong].trackId}`);
    if (wasPlaying) {
      // Mark busy so manual togglePlay waits, use longer delay for embed to load
      toggleBusyRef.current = true;
      pendingAutoPlayRef.current = setTimeout(() => {
        controllerRef.current?.togglePlay();
        pendingAutoPlayRef.current = null;
        toggleBusyRef.current = false;
      }, 600);
    }
  }, [currentSong]);

  const togglePlay = useCallback(() => {
    if (!controllerRef.current || toggleBusyRef.current) return;
    // Debounce: prevent double-click from toggling twice
    toggleBusyRef.current = true;
    // If there's a pending auto-play (from song change), cancel it — user is taking over
    if (pendingAutoPlayRef.current) {
      clearTimeout(pendingAutoPlayRef.current);
      pendingAutoPlayRef.current = null;
    }
    controllerRef.current.togglePlay();
    setTimeout(() => { toggleBusyRef.current = false; }, 300);
  }, []);

  // ── Haptic tick sound ──
  const triggerFeedback = useCallback(() => {
    if (navigator.vibrate) navigator.vibrate(18);
    try {
      const AC = window.AudioContext || (window as any).webkitAudioContext;
      if (!AC) return;
      const ctx = new AC();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.04);
      osc.type = "sine";
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch {}
  }, []);

  // ── Drag handlers (using refs to avoid stale closures) ──
  const getAngleFromEvent = useCallback((e: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent) => {
    const rect = wheelRef.current?.getBoundingClientRect();
    if (!rect) return 0;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const clientX = 'touches' in e ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX;
    const clientY = 'touches' in e ? (e as TouchEvent).touches[0].clientY : (e as MouseEvent).clientY;
    return Math.atan2(clientY - cy, clientX - cx) * (180 / Math.PI);
  }, []);

  const handlePointerDown = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    startAngleRef.current = getAngleFromEvent(e);
    startRotationRef.current = rotationRef.current;
  }, [getAngleFromEvent]);

  const snapToNearest = useCallback(() => {
    const rot = rotationRef.current;
    const rawIdx = -rot / SEGMENT;
    const snapped = Math.round(rawIdx);
    let idx = snapped % SPOTIFY_SONGS.length;
    if (idx < 0) idx += SPOTIFY_SONGS.length;
    setCurrentSong(idx);
    setRotation(-snapped * SEGMENT);
    lastFeedbackIndex.current = -1;
  }, []);

  useEffect(() => {
    if (!isDragging) return;

    const onMove = (e: MouseEvent | TouchEvent) => {
      const angle = getAngleFromEvent(e);
      const diff = angle - startAngleRef.current;
      const newRot = startRotationRef.current + diff;
      setRotation(newRot);
      rotationRef.current = newRot;

      const rawIdx = -newRot / SEGMENT;
      let idx = Math.round(rawIdx) % SPOTIFY_SONGS.length;
      if (idx < 0) idx += SPOTIFY_SONGS.length;

      if (idx !== currentSongRef.current) setCurrentSong(idx);
      if (idx !== lastFeedbackIndex.current) {
        triggerFeedback();
        lastFeedbackIndex.current = idx;
      }
    };

    const onUp = () => {
      setIsDragging(false);
      snapToNearest();
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onUp);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
    };
  }, [isDragging, getAngleFromEvent, snapToNearest, triggerFeedback]);

  const currentImage = SPOTIFY_SONGS[currentSong].image;

  // Crossfade: when song changes, push old image to prev and fade in the new one
  useEffect(() => {
    if (currentImage === bgImages.current) return;
    setBgReady(false);
    setBgImages(prev => ({ current: currentImage, prev: prev.current }));
    // Small delay so the new image element mounts at opacity-0 first
    const t = setTimeout(() => setBgReady(true), 50);
    return () => clearTimeout(t);
  }, [currentImage]);

  return (
    <div className="relative flex min-h-svh items-center justify-center bg-background px-3 sm:px-4 py-10 sm:py-16 overflow-hidden">

      {/* Ambient album-art background — crossfade layers */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{ opacity: isPlaying ? 0.45 : 0.12, transition: 'opacity 1.5s ease-in-out' }}
      >
        {/* Previous image — fades out */}
        {bgImages.prev && (
          <img
            key={bgImages.prev}
            src={bgImages.prev}
            alt=""
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover blur-[100px] scale-150 saturate-[1.8] transition-opacity duration-[1.2s] ease-in-out"
            style={{ opacity: bgReady ? 0 : 1 }}
          />
        )}
        {/* Current image — fades in */}
        <img
          key={bgImages.current}
          src={bgImages.current}
          alt=""
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover blur-[100px] scale-150 saturate-[1.8] transition-opacity duration-[1.2s] ease-in-out"
          style={{ opacity: bgReady ? 1 : 0 }}
        />
      </div>

      {/* Scrim so text stays readable */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-background/50" />

      <div className="relative z-10 w-full max-w-md flex flex-col items-center gap-5 sm:gap-8">

        {/* Avatar */}
        <div
          className="animate-pixel-in w-20 h-20 sm:w-24 sm:h-24 bg-muted pixel-avatar overflow-hidden"
          style={{ animationDelay: "0s" }}
        >
          <img
            src="https://res.cloudinary.com/dfb3ym0jr/image/upload/v1770807047/IMG_20260201_005454_356_dzn9eq.webp"
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Name & Bio */}
        <div className="animate-pixel-in text-center" style={{ animationDelay: "0.1s" }}>
          <p className="text-[10px] text-muted-foreground/40 tracking-[0.2em] uppercase mb-1.5 font-mono">
            {(() => {
              const h = new Date().getHours();
              if (h >= 0 && h < 5) return "it's late. go to sleep.";
              if (h < 9) return "good morning, early bird";
              if (h < 12) return "good morning";
              if (h < 17) return "good afternoon";
              if (h < 21) return "good evening";
              return "still up?";
            })()}
          </p>
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
        <div className="w-full animate-pixel-in flex flex-col items-center gap-4 sm:gap-6 py-2 sm:py-4" style={{ animationDelay: "0.25s" }}>

          {/* NOW PLAYING CARD */}
          <div
            key={currentSong}
            className={`w-full max-w-[17rem] bg-gradient-to-r from-muted/20 to-transparent border border-foreground/8 rounded-xl p-3.5 flex items-center gap-3.5 animate-in ${ENTRY_ANIMATIONS[currentSong % ENTRY_ANIMATIONS.length]} duration-500`}
          >
            <div className="w-11 h-11 rounded-lg overflow-hidden shrink-0 border border-foreground/10 shadow-sm ring-1 ring-foreground/5">
              <img src={SPOTIFY_SONGS[currentSong].image} alt="Album Art" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[8px] font-bold uppercase tracking-[0.25em] text-muted-foreground/50 mb-0.5">Now Playing</p>
              <h3 className="text-xs font-bold truncate leading-tight" style={{ fontFamily: "Silkscreen, monospace" }}>
                {SPOTIFY_SONGS[currentSong].title}
              </h3>
              <p className="text-[10px] text-muted-foreground/70 truncate">{SPOTIFY_SONGS[currentSong].artist}</p>
            </div>
            {isPlaying && (
              <div className="flex items-end gap-[2.5px] h-4 pr-0.5 shrink-0">
                {[0, 0.15, 0.3].map((d) => (
                  <span key={d} className="w-[2.5px] rounded-full bg-foreground/40 animate-bounce" style={{ height: '60%', animationDelay: `${d}s`, animationDuration: '0.6s' }} />
                ))}
              </div>
            )}
          </div>

          {/* DIALER CONTAINER — 224px = w-56 */}
          <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center select-none touch-none">

            {/* Outer ambient glow (picks up album color via mix-blend) */}
            <div className="absolute -inset-6 rounded-full pointer-events-none opacity-20 blur-2xl" style={{ background: `url(${SPOTIFY_SONGS[currentSong].image}) center/cover`, transition: 'opacity 0.8s' }} />

            {/* Frosted glass outer ring */}
            <div className="absolute -inset-3 rounded-full border border-foreground/[0.06] bg-foreground/[0.015] backdrop-blur-sm pointer-events-none" />

            {/* Static marker / needle */}
            <div className="absolute -top-3.5 z-30 flex flex-col items-center pointer-events-none">
              <div className="w-2 h-5 rounded-full bg-foreground/90 shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
            </div>

            {/* THE ROTATING WHEEL */}
            <div
              ref={wheelRef}
              onMouseDown={handlePointerDown}
              onTouchStart={handlePointerDown}
              className="w-full h-full rounded-full relative cursor-grab active:cursor-grabbing wheel-groove"
              style={{
                transform: `rotate(${rotation}deg)`,
                transition: isDragging ? 'none' : 'transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)',
              }}
            >
              {/* Outer border ring — double ring */}
              <div className="absolute inset-0 rounded-full border-[2px] border-foreground/15 pointer-events-none" />
              <div className="absolute inset-[3px] rounded-full border border-foreground/8 pointer-events-none" />

              {/* Fine tick marks — 4 per song segment */}
              {Array.from({ length: SPOTIFY_SONGS.length * 4 }).map((_, i) => {
                const tickAngle = (360 / (SPOTIFY_SONGS.length * 4)) * i;
                const isMajor = i % 4 === 0;
                return (
                  <div
                    key={i}
                    className={`absolute top-0 left-1/2 pointer-events-none ${
                      isMajor
                        ? '-ml-[1px] w-[2px] h-3.5 rounded-full bg-foreground/30'
                        : '-ml-px w-px h-2 bg-muted-foreground/15'
                    }`}
                    style={{
                      transformOrigin: `50% ${wheelRadius}px`,
                      transform: `rotate(${tickAngle}deg)`,
                    }}
                  />
                );
              })}

              {/* Wheel pointer (rotates with wheel) */}
              <div className="absolute top-[4px] left-1/2 -ml-[3px] w-1.5 h-3.5 rounded-b-sm bg-foreground/50 pointer-events-none" />

              {/* Song markers on rim */}
              {SPOTIFY_SONGS.map((song, i) => {
                const angle = i * SEGMENT;
                const isActive = currentSong === i;
                return (
                  <div
                    key={song.trackId}
                    className={`absolute top-[8px] left-1/2 flex items-center justify-center pointer-events-none
                      w-7 h-7 -ml-3.5 sm:w-9 sm:h-9 sm:-ml-[18px]`}
                    style={{
                      transformOrigin: `50% ${wheelRadius - 8}px`,
                      transform: `rotate(${angle}deg)`,
                    }}
                  >
                    <div
                      className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-300 overflow-hidden ${
                        isActive
                          ? 'ring-2 ring-foreground shadow-[0_0_12px_rgba(255,255,255,0.2)] scale-110'
                          : 'ring-1 ring-foreground/10 opacity-35 scale-90'
                      }`}
                      style={{ transform: `rotate(${-angle - rotation}deg)` }}
                    >
                      <img src={song.image} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                    </div>
                  </div>
                );
              })}

              {/* Vinyl-like inner grooves */}
              <div className="absolute inset-8 rounded-full border border-foreground/[0.04] pointer-events-none" />
              <div className="absolute inset-10 rounded-full border border-foreground/[0.06] pointer-events-none" />
              <div className="absolute inset-12 rounded-full border border-foreground/[0.04] pointer-events-none" />
            </div>

            {/* STATIC CENTER HUB — Play / Pause */}
            <button
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              onClick={togglePlay}
              className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-background/80 backdrop-blur-md border-2 border-foreground/60 z-20 flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.4)] overflow-hidden cursor-pointer hover:scale-105 active:scale-95 transition-all duration-200 group"
            >
              {/* Blurred album cover BG */}
              <img
                key={SPOTIFY_SONGS[currentSong].trackId}
                src={SPOTIFY_SONGS[currentSong].image}
                alt=""
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover opacity-30 blur-[4px] scale-150 pointer-events-none transition-opacity duration-700"
              />
              <div className="absolute inset-0 bg-background/40 group-hover:bg-background/25 transition-colors pointer-events-none" />

              {/* Icon */}
              <div className="relative z-10 flex items-center justify-center pointer-events-none">
                {isPlaying ? (
                  <Pause size={20} className="text-foreground" fill="currentColor" />
                ) : (
                  <Play size={20} className="text-foreground ml-0.5" fill="currentColor" />
                )}
              </div>

              {/* Active pulse */}
              {isPlaying && (
                <span className="absolute inset-0 rounded-full border border-foreground/15 animate-ping pointer-events-none" style={{ animationDuration: '2.5s' }} />
              )}
            </button>
          </div>

          {/* Hidden Spotify Embed */}
          <div className="w-0 h-0 overflow-hidden absolute" aria-hidden="true">
            <div ref={embedRef} />
          </div>

          {/* Hint */}
          <p className="text-[8px] text-muted-foreground/25 font-mono tracking-[0.2em] uppercase select-none">
            ⟲ drag to spin · tap center to play
          </p>

          {/* Lyrics snippet — fades in when playing */}
          <div
            key={`lyric-${currentSong}`}
            className={`w-full max-w-[17rem] text-center transition-all duration-700 ${
              isPlaying
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-2 pointer-events-none'
            }`}
          >
            <p
              className={`text-[10px] italic text-muted-foreground/50 leading-relaxed tracking-wide animate-in ${ENTRY_ANIMATIONS[currentSong % ENTRY_ANIMATIONS.length]} duration-700`}
              style={{ fontFamily: "'Space Mono', monospace" }}
            >
              "{SPOTIFY_SONGS[currentSong].lyric}"
            </p>
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
                className="w-full text-left border-2 border-foreground bg-background px-3 sm:px-4 py-3 pixel-link"
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

        {/* Divider */}
        <div className="pixel-divider w-full animate-pixel-in" style={{ animationDelay: "0.45s" }} />

        {/* ── The Void ── */}
        <div className="w-full animate-pixel-in" style={{ animationDelay: "0.5s" }}>
          <h2
            className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground mb-4"
            style={{ fontFamily: "Silkscreen, monospace" }}
          >
            ▸ the void
          </h2>

          <div className="relative w-full min-h-[120px] sm:min-h-[140px] bg-black/40 border border-foreground/[0.06] rounded-lg overflow-hidden">
            {/* Subtle inner vignette */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.6)_100%)]" />

            {!voidGone ? (
              <div className="relative p-4 sm:p-5 flex flex-col h-full">
                <textarea
                  value={voidText}
                  onChange={(e) => {
                    setVoidText(e.target.value);
                    setVoidFading(false);
                    // Reset fade timer on each keystroke
                    if (voidTimerRef.current) clearTimeout(voidTimerRef.current);
                    if (e.target.value.trim()) {
                      voidTimerRef.current = setTimeout(() => {
                        setVoidFading(true);
                        setTimeout(() => {
                          setVoidText('');
                          setVoidFading(false);
                          setVoidGone(true);
                          setTimeout(() => setVoidGone(false), 3000);
                        }, 2000);
                      }, 3000);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey && voidText.trim()) {
                      e.preventDefault();
                      if (voidTimerRef.current) clearTimeout(voidTimerRef.current);
                      setVoidFading(true);
                      setTimeout(() => {
                        setVoidText('');
                        setVoidFading(false);
                        setVoidGone(true);
                        setTimeout(() => setVoidGone(false), 3000);
                      }, 2000);
                    }
                  }}
                  placeholder="scream into the void..."
                  rows={3}
                  className={`w-full bg-transparent text-sm sm:text-base text-foreground/80 placeholder:text-muted-foreground/20 resize-none outline-none font-mono leading-relaxed transition-all duration-[2s] ${
                    voidFading ? 'opacity-0 blur-sm translate-y-2' : 'opacity-100'
                  }`}
                  style={{ caretColor: 'hsl(var(--foreground) / 0.4)' }}
                />
                <p className="mt-auto text-[8px] text-muted-foreground/15 tracking-[0.15em] font-mono select-none">
                  nothing here is saved. it just disappears.
                </p>
              </div>
            ) : (
              <div className="flex items-center justify-center h-[120px] sm:h-[140px] animate-in fade-in duration-1000">
                <p className="text-xs text-muted-foreground/20 font-mono tracking-wide italic">
                  gone. like everything else.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          className="animate-pixel-in flex flex-col items-center gap-2 mt-6 mb-2"
          style={{ animationDelay: "0.5s" }}
        >
          <div className="pixel-divider w-16 opacity-20" />
          <p className="text-[10px] text-muted-foreground/30 tracking-wide font-mono text-center leading-relaxed">
            made at 3am · probably needs sleep
          </p>
          <p className="text-[9px] text-muted-foreground/20 tracking-widest font-mono">
            © {new Date().getFullYear()} shuvo · nothing is permanent
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
