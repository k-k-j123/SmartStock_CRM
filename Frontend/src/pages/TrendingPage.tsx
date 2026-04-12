import TrendingCategory from "@/components/TrendingCategory";
import { useTrending } from "@/hooks/use-api";

export default function TrendingPage() {
  const { data: trendingData = {}, isLoading } = useTrending();

  if (isLoading) {
    return <div className="p-6">Loading trending products...</div>;
  }

  return (
    <div className="p-6 space-y-12">
      <h1 className="text-2xl font-bold text-foreground">Trending Products</h1>
      <div className="space-y-12">
        {Object.entries(trendingData).map(([category, products]) => (
          <TrendingCategory key={category} category={category} products={products as any} />
        ))}
      </div>
    </div>
  );
}
