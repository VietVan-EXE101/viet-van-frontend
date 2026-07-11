import type { Story } from "@/lib/api/stories";

const LOCAL_STORIES: Story[] = [
  {
    id: "chi-pheo",
    slug: "chi-pheo",
    title: "Chí Phèo",
    author: "Nam Cao",
    coverUrl: "/images/stories/chi-pheo-cover.webp",
  },
];

export function getLocalStories(): Story[] {
  return LOCAL_STORIES;
}

export function getLocalStoryBySlug(slug: string): Story | undefined {
  return LOCAL_STORIES.find((story) => story.slug === slug);
}
