import { MoreVertical, Layers, Users2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const pastelBorderColors = [
  "border-l-emerald-500/80 dark:border-l-emerald-400/80",
  "border-l-pink-500/80 dark:border-l-pink-400/80",
  "border-l-amber-500/80 dark:border-l-amber-400/80",
  "border-l-blue-500/80 dark:border-l-blue-400/80",
  "border-l-purple-500/80 dark:border-l-purple-400/80",
  "border-l-yellow-500/80 dark:border-l-yellow-400/80",
];

const progressGradients = [
  "from-emerald-500 to-teal-400",
  "from-pink-500 to-rose-400",
  "from-amber-500 to-orange-400",
  "from-blue-500 to-indigo-400",
  "from-purple-500 to-violet-400",
  "from-yellow-500 to-amber-400",
];

interface ProductCardProps {
  name: string;
  category: string;
  stock: number;
  maxStock: number;
  index: number;
}

export default function ProductCard({ name, category, stock, maxStock, index }: ProductCardProps) {
  const borderClass = pastelBorderColors[index % pastelBorderColors.length];
  const gradientClass = progressGradients[index % progressGradients.length];
  const percentage = Math.min(Math.round((stock / maxStock) * 100), 100);

  return (
    <div className={`glass-card relative flex flex-col justify-between rounded-2xl border-l-4 ${borderClass} p-5 bg-card/40 dark:bg-zinc-900/25 backdrop-blur-xl group hover:-translate-y-0.5`}>
      <div>
        <div className="mb-3 flex items-center justify-between">
          <Badge variant="outline" className="text-[10px] uppercase font-semibold text-muted-foreground border-border/60 px-2 py-0.5">
            {category}
          </Badge>
          <button className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-lg hover:bg-muted/50">
            <MoreVertical size={14} />
          </button>
        </div>
        
        <h3 className="mb-1 text-sm font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">{name}</h3>
        <p className="mb-4 text-xs text-muted-foreground font-medium flex items-center gap-1.5">
          <Layers size={12} className="text-muted-foreground/60" />
          Stock: <span className="font-semibold text-foreground">{stock}</span> units
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-muted-foreground">Stock Gauge</span>
          <span className="font-bold text-foreground">{percentage}%</span>
        </div>
        
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-background/50 dark:bg-zinc-950/50 p-[1px]">
          <div 
            className={`h-full rounded-full bg-gradient-to-r ${gradientClass} transition-all duration-500`} 
            style={{ width: `${percentage}%` }} 
          />
        </div>

        <div className="mt-4 pt-2 flex items-center justify-between border-t border-border/20">
          <div className="flex -space-x-2 items-center">
            <Avatar className="h-6 w-6 border-2 border-background shadow-sm">
              <AvatarFallback className="text-[8px] bg-primary/10 text-primary font-bold">
                <Users2 size={10} />
              </AvatarFallback>
            </Avatar>
            <button className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-background bg-muted hover:bg-primary hover:text-white text-[10px] font-bold text-muted-foreground transition-all">
              +
            </button>
          </div>
          
          {stock <= 10 && (
            <Badge variant="destructive" className="h-5 px-2 text-[9px] font-bold tracking-wide uppercase bg-destructive/10 text-destructive dark:bg-destructive/20 border-destructive/20 animate-pulse">
              Low Stock
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}

