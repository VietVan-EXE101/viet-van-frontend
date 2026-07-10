import { StoryDetailPage } from "@/scenes/story-detail-scene/StoryDetailPage";

type LibraryStoryPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function Page({ params }: LibraryStoryPageProps) {
  const { slug } = await params;

  return <StoryDetailPage slug={slug} />;
}
