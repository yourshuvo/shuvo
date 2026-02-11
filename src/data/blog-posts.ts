export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  content: string;
}

// Add your blog posts here as markdown strings
export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "3am-again",
    title: "3am again",
    date: "2026-02-10",
    content: `it's 3am and i'm still awake. not because i have things to do. i just don't want tomorrow to start yet.\n\nthe house is quiet. my head isn't. i keep replaying conversations that happened months ago, wondering if i said the wrong thing. probably did.\n\nsome nights are just like this. you sit with it.`,
  },
  {
    slug: "people-leave",
    title: "people leave",
    date: "2026-02-03",
    content: `funny how someone can text you every day for months and then just… stop. no fight. no reason. they just fade out like a song ending.\n\nyou check their profile sometimes. they're fine. laughing in photos. living. just not with you in the frame anymore.\n\ni'm not angry. i think that's the worst part. i just miss them.`,
  },
  {
    slug: "tired",
    title: "a different kind of tired",
    date: "2026-01-22",
    content: `not the kind where you sleep and it goes away. the kind where you wake up and it's still there. sitting on your chest.\n\ni smiled today and it felt like acting. went through all the motions — class, food, phone, bed. none of it meant anything.\n\ni don't know when everything started feeling like filler episodes. i'm just waiting for something to matter again.`,
  },
];
