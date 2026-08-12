import { useCustomers } from "@/hooks/use-api";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Mail, Phone, Calendar, DollarSign, User } from "lucide-react";
import { format } from "date-fns";
import CreateCustomerDialog from "@/components/CreateCustomerDialog";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

export default function CustomersPage() {
  const { data: customers = [] } = useCustomers();
  const navigate = useNavigate();

  const getInitials = (name: string) => {
    return name
      .trim()
      .split(" ")
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">Customers Profiles</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">Maintain customer contact information, interaction history, and spent logs.</p>
        </div>
        <CreateCustomerDialog triggerLabel="Register Customer" triggerClassName="gap-2 rounded-2xl bg-primary hover:bg-primary/95 text-primary-foreground shadow-lg shadow-primary/10 hover:scale-[1.02] active:scale-[0.98] transition-all py-5 font-semibold text-xs" />
      </div>

      {/* Grid listing */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {customers.map((c) => (
          <button
            key={c.id}
            className="glass-card flex flex-col justify-between text-left rounded-3xl p-6 bg-card/45 dark:bg-zinc-900/15 backdrop-blur-xl hover:-translate-y-1 hover:border-primary/20 dark:hover:border-primary/20 group relative overflow-hidden"
            onClick={() => navigate(`/customers/${c.id}`)}
          >
            {/* Top decorative gradient glow */}
            <span className="absolute top-0 right-0 h-16 w-16 bg-primary/5 dark:bg-primary/5 rounded-bl-full group-hover:scale-150 transition-transform duration-300" />
            
            <div>
              <div className="mb-4 flex items-center gap-3.5">
                <Avatar className="h-12 w-12 border border-border/30 shadow-inner">
                  <AvatarFallback className="bg-primary/10 text-sm font-black text-primary uppercase">
                    {getInitials(c.name) || <User size={16} />}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">{c.name}</h3>
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1 mt-0.5">
                    <Calendar size={10} /> Visit: {format(new Date(c.lastVisit), "MMM dd, yyyy")}
                  </p>
                </div>
              </div>
              
              <div className="space-y-2.5 text-xs text-muted-foreground font-medium pt-2 border-t border-border/25">
                <div className="flex items-center gap-2 hover:text-foreground transition-colors">
                  <Phone size={12} className="text-muted-foreground/60" /> 
                  <span>{c.phone}</span>
                </div>
                <div className="flex items-center gap-2 hover:text-foreground transition-colors line-clamp-1">
                  <Mail size={12} className="text-muted-foreground/60" /> 
                  <span>{c.email || "No email registered"}</span>
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-border/20 pt-4">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                <DollarSign size={10} /> Total Spent
              </span>
              <span className="text-sm font-black text-foreground bg-muted/40 px-3 py-1 rounded-xl border border-border/40">
                {formatCurrency(c.totalSpent)}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
