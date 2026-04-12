import { Star } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface CustomerMessageProps {
  name: string;
  message: string;
  date: string;
}

export default function CustomerMessage({ name, message, date }: CustomerMessageProps) {
  return (
    <div className="flex gap-3 border-b border-border py-4 last:border-0">
      <Avatar className="h-10 w-10 shrink-0">
        <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
          {name.charAt(0)}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center justify-between">
          <h4 className="text-sm font-semibold text-foreground">{name}</h4>
          <button className="text-muted-foreground hover:text-foreground">
            <Star size={14} />
          </button>
        </div>
        <p className="mb-1 truncate text-xs text-muted-foreground">{message}</p>
        <p className="text-[10px] text-muted-foreground">{date}</p>
      </div>
    </div>
  );
}
