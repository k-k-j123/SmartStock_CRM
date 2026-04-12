import { MoreVertical } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const pastelColors = ["card-green", "card-pink", "card-orange", "card-blue", "card-purple", "card-yellow"];
const progressColors = [
  "bg-[hsl(var(--progress-orange))]",
  "bg-[hsl(var(--progress-blue))]",
  "bg-[hsl(var(--progress-green))]",
  "bg-[hsl(var(--progress-pink))]",
];

interface ProductCardProps {
  name: string;
  category: string;
  stock: number;
  maxStock: number;
  index: number;
}

export default function ProductCard({ name, category, stock, maxStock, index }: ProductCardProps) {
  const bgClass = pastelColors[index % pastelColors.length];
  const progressClass = progressColors[index % progressColors.length];
  const percentage = Math.min(Math.round((stock / maxStock) * 100), 100);

  return (
    <div className={`${bgClass} rounded-2xl p-5 transition-shadow hover:shadow-md`}>
      <div className="mb-3 flex items-start justify-between">
        <p className="text-xs text-muted-foreground">{category}</p>
        <button className="text-muted-foreground hover:text-foreground">
          <MoreVertical size={16} />
        </button>
      </div>
      <h3 className="mb-1 text-sm font-semibold text-foreground">{name}</h3>
      <p className="mb-3 text-xs text-muted-foreground">Stock: {stock} units</p>

      <div className="mb-1 flex items-center justify-between">
        <span className="text-xs font-medium text-foreground">Stock Level</span>
        <span className="text-xs font-semibold text-foreground">{percentage}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-background/50">
        <div className={`h-full rounded-full ${progressClass} transition-all`} style={{ width: `${percentage}%` }} />
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex -space-x-2">
          <Avatar className="h-7 w-7 border-2 border-card">
            <AvatarFallback className="text-[10px] bg-primary/20 text-primary">S</AvatarFallback>
          </Avatar>
          <button className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-card bg-background text-xs text-muted-foreground">
            +
          </button>
        </div>
        {stock <= 10 && (
          <span className="rounded-full bg-[hsl(var(--badge-danger-bg))] px-2.5 py-0.5 text-[10px] font-medium text-[hsl(var(--badge-danger))]">
            Low Stock
          </span>
        )}
      </div>
    </div>
  );
}
