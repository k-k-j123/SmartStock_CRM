import { useCustomers } from "@/hooks/use-api";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Mail, Phone } from "lucide-react";
import { format } from "date-fns";
import CreateCustomerDialog from "@/components/CreateCustomerDialog";
import { useNavigate } from "react-router-dom";

export default function CustomersPage() {
  const { data: customers = [] } = useCustomers();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">Customers</h2>
        <CreateCustomerDialog triggerLabel="Add Customer" triggerClassName="gap-2 rounded-xl" />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {customers.map((c) => (
          <button
            key={c.id}
            className="rounded-2xl bg-card p-5 text-left transition-shadow hover:shadow-md"
            onClick={() => navigate(`/customers/${c.id}`)}
          >
            <div className="mb-4 flex items-center gap-3">
              <Avatar className="h-11 w-11">
                <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
                  {c.name.split(" ").map((w) => w[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-sm font-semibold text-foreground">{c.name}</h3>
                <p className="text-xs text-muted-foreground">Last visit: {format(new Date(c.lastVisit), "MMM dd, yyyy")}</p>
              </div>
            </div>
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2"><Phone size={12} /> {c.phone}</div>
              <div className="flex items-center gap-2"><Mail size={12} /> {c.email}</div>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
              <span className="text-xs text-muted-foreground">Total Spent</span>
              <span className="text-sm font-bold text-foreground">${c.totalSpent.toLocaleString()}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
