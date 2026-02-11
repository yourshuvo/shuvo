export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  content: string;
}

// Add your blog posts here as markdown strings
export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "hello-world",
    title: "hello world",
    date: "2026-02-10",
    content: `first post on here. just vibes, pixels, and late-night thoughts.\n\nbuilding this little corner of the internet felt right. no algorithms, no feeds — just a page that's mine.`,
  },
  {
    slug: "favorite-tools",
    title: "tools i use daily",
    date: "2026-02-05",
    content: `a quick rundown of what's in my toolkit:\n\n- **editor:** vs code w/ a custom mono theme\n- **music:** spotify on repeat\n- **notes:** obsidian for everything\n- **design:** figma + pixel art in aseprite`,
  },
  {
    slug: "on-simplicity",
    title: "on simplicity",
    date: "2026-01-28",
    content: `less is more. i keep coming back to that.\n\nstripped this site down to black and white. no gradients, no noise. just text and links. feels good.`,
  },
];
