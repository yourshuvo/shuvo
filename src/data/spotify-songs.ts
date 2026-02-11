export interface SpotifySong {
  title: string;
  artist: string;
  /** Spotify embed track ID (from share → embed URL) */
  trackId: string;
  /** Album art — use the Spotify CDN format: https://i.scdn.co/image/<hash> */
  image: string;
  /** A memorable lyric snippet shown while playing */
  lyric: string;
}

// To get a track ID: Spotify → right-click song → Share → Copy Song Link
// The ID is the string after /track/
// For images, use: https://i.scdn.co/image/ab67616d00001e02<hash> (300×300 size)
export const SPOTIFY_SONGS: SpotifySong[] = [
  {
    title: "Creep",
    artist: "Radiohead",
    trackId: "6b2oQwSGFkzsMtQruIWm2p",
    image: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e022f85b65d3ac4d3d7f806ca11",
    lyric: "I'm a creep, I'm a weirdo... what the hell am I doing here?",
  },
  {
    title: "Exit Music (For A Film)",
    artist: "Radiohead",
    trackId: "0z1o5L7HJx562xZSATcIpY",
    image: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02c8b444df094279e70d0ed856",
    lyric: "We hope that you choke, that you choke... breathe, keep breathing",
  },
  {
    title: "How to Disappear",
    artist: "Radiohead",
    trackId: "2rtGaCAeYtmcIvuZsvgTf6",
    image: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e026c7112082b63beefffe40151",
    lyric: "That there, that's not me... I go where I please",
  },
  {
    title: "The Night We Met",
    artist: "Lord Huron",
    trackId: "0QZ5yyl6B6utIWkxeBDxQN",
    image: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e029d2efe43d5b7ebc7cb60ca81",
    lyric: "I had all and then most of you, some and now none of you",
  },
  {
    title: "Let It Happen",
    artist: "Tame Impala",
    trackId: "2X485T9Z5Ly0xyaghN73ed",
    image: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e029e1cfc756886ac782e363d79",
    lyric: "All this running around, I can't fight it much longer... let it happen",
  },
  {
    title: "Fake Plastic Trees",
    artist: "Radiohead",
    trackId: "73CKjW3vsUXRpy3NnX4H7F",
    image: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e029293c743fa542094336c5e12",
    lyric: "Her green plastic watering can... for her fake Chinese rubber plant",
  },
  {
    title: "True Love Waits",
    artist: "Radiohead",
    trackId: "07XaOyTS5hyaWiUK1Bc3bR",
    image: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e0245643f5cf119cbc9d2811c22",
    lyric: "True love waits, in haunted attics... just don't leave",
  },
  {
    title: "No Surprises",
    artist: "Radiohead",
    trackId: "10nyNJ6zNy2YVYLrcwLccB",
    image: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02c8b444df094279e70d0ed856",
    lyric: "A heart that's full up like a landfill... no alarms and no surprises",
  },
];
