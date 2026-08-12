import TrendingCategory from "@/components/TrendingCategory";
import { useTrending } from "@/hooks/use-api";
import { Sparkles, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function TrendingPage() {
  const { data: trendingData = {}, isLoading } = useTrending();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 py-24 gap-3 text-center">
        <Loader2 className="h-7 w-7 text-primary animate-spin" />
        <p className="text-sm font-semibold text-muted-foreground">Analysing Google Shopping API search trends...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Header section */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">Shopping Search Trends</h1>
          <Badge variant="outline" className="h-5 text-[9px] font-bold tracking-wide uppercase bg-primary/5 text-primary border-primary/20 flex items-center gap-0.5">
            <Sparkles size={9} /> Live Fetch
          </Badge>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Real-time trending search items extracted directly from shopping platforms to optimize inventory demands.
        </p>
      </div>

      <div className="space-y-10">
        {Object.entries(trendingData).map(([category, products]) => (
          <TrendingCategory key={category} category={category} products={products as any} />
        ))}
      </div>
    </div>
  );
}

