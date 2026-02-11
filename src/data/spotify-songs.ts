export interface SpotifySong {
  title: string;
  artist: string;
  // Spotify embed track ID (from the share > embed URL)
  trackId: string;
}

// Add your favorite songs here
// To get a track ID: open Spotify > right-click song > Share > Copy Song Link
// The ID is the string after /track/
export const SPOTIFY_SONGS: SpotifySong[] = [
  {
    title: "Redbone",
    artist: "Childish Gambino",
    trackId: "0wXuerDYiBnERgIpbb3JBR",
  },
  {
    title: "Nights",
    artist: "Frank Ocean",
    trackId: "7eqoqGkKe8ELRiEFOBwpA0",
  },
  {
    title: "Let It Happen",
    artist: "Tame Impala",
    trackId: "2X485T9Z5Ly0xyaghN73ed",
  },
  {
    title: "Pink + White",
    artist: "Frank Ocean",
    trackId: "3xKsf9qdS1CyvXSMEid6g8",
  },
];
