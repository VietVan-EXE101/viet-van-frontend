import { PlansPage } from "@/scenes/plans-scene/PlansPage";

export const metadata = {
  title: "Subscription - Viet Van",
  description: "Chọn gói trải nghiệm Việt Văn cho MVP.",
};

type PlansRouteProps = {
  searchParams: Promise<{ story?: string }>;
};

export default async function Page({ searchParams }: PlansRouteProps) {
  const { story } = await searchParams;

  return <PlansPage storySlug={story || "chi-pheo"} />;
}
