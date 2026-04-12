import { useState } from "react";
import { useCustomers, useCreateCustomer } from "@/hooks/use-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus, Mail, Phone } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

export default function CustomersPage() {
  const { data: customers = [] } = useCustomers();
  const createCustomer = useCreateCustomer();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "" });

  const handleSubmit = () => {
    createCustomer.mutate(form, {
      onSuccess: () => {
        toast.success("Customer created");
        setOpen(false);
        setForm({ name: "", phone: "", email: "" });
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">Customers</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 rounded-xl"><Plus size={16} /> Add Customer</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>New Customer</DialogTitle></DialogHeader>
            <div className="grid gap-4 py-4">
              {[
                { key: "name", label: "Name" },
                { key: "phone", label: "Phone" },
                { key: "email", label: "Email" },
              ].map(({ key, label }) => (
                <div key={key} className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">{label}</Label>
                  <Input className="col-span-3" value={form[key as keyof typeof form]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
                </div>
              ))}
            </div>
            <Button onClick={handleSubmit} disabled={createCustomer.isPending}>Create</Button>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {customers.map((c) => (
          <div key={c.id} className="rounded-2xl bg-card p-5 transition-shadow hover:shadow-md">
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
          </div>
        ))}
      </div>
    </div>
  );
}
