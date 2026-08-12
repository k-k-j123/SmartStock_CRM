import { Badge } from "@/components/ui/badge";
import { Star, DollarSign } from "lucide-react";

interface Product {
  title: string;
  price: {
    raw: string;
  };
  thumbnail: string;
  rating: number;
}

interface TrendingProps {
  category: string;
  products: Product[];
}

export default function TrendingCategory({ category, products }: TrendingProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 pb-2 border-b border-border/30">
        <h3 className="text-lg font-extrabold capitalize text-foreground tracking-tight">{category}</h3>
        <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-widest text-primary bg-primary/5 border-primary/20">
          Suggested
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
        {products.slice(0, 5).map((product, i) => (
          <div 
            key={i} 
            className="glass-card flex flex-col justify-between overflow-hidden rounded-2xl border border-white/20 dark:border-zinc-800/40 bg-card/35 dark:bg-zinc-900/10 backdrop-blur-xl shadow-lg hover:-translate-y-0.5 transition-transform group"
          >
            {/* Image Wrapper */}
            <div className="h-40 bg-muted/40 dark:bg-zinc-950/20 flex items-center justify-center p-4 border-b border-border/25 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-background/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <img 
                src={product.thumbnail} 
                alt={product.title} 
                className="h-28 w-28 object-contain transition-transform duration-300 group-hover:scale-105" 
              />
            </div>

            {/* Info details */}
            <div className="p-4 flex-1 flex flex-col justify-between gap-3">
              <h4 className="text-xs font-bold text-foreground leading-relaxed line-clamp-2 group-hover:text-primary transition-colors">
                {product.title}
              </h4>
              
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/10">
                <span className="text-xs font-black text-foreground flex items-center">
                  {product.price?.raw || "N/A"}
                </span>
                
                <Badge variant="secondary" className="h-5 px-1.5 text-[9px] font-bold tracking-wide uppercase bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 flex items-center gap-0.5">
                  <Star size={8} className="fill-current" />
                  {product.rating || "N/A"}
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

