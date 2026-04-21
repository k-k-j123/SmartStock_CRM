import { useEffect, useState } from "react";
import { Plus, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { useCreateCustomer } from "@/hooks/use-api";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type CustomerForm = {
  name: string;
  phone: string;
  email: string;
};

const initialForm: CustomerForm = {
  name: "",
  phone: "",
  email: "",
};

interface CreateCustomerDialogProps {
  triggerLabel?: string;
  triggerClassName?: string;
}

export default function CreateCustomerDialog({
  triggerLabel = "Create Customer",
  triggerClassName,
}: CreateCustomerDialogProps) {
  const createCustomer = useCreateCustomer();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<CustomerForm>(initialForm);

  useEffect(() => {
    if (!open) {
      setForm(initialForm);
    }
  }, [open]);

  const handleSubmit = () => {
    if (!form.name.trim() || !form.phone.trim()) {
      toast.error("Name and phone are required");
      return;
    }

    createCustomer.mutate(
      {
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
      },
      {
        onSuccess: () => {
          toast.success("Customer created");
          setOpen(false);
        },
        onError: () => {
          toast.error("Failed to create customer");
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={triggerClassName}>
          <Plus size={16} />
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus size={18} />
            New Customer
          </DialogTitle>
          <DialogDescription>Add a customer manually from the dashboard.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="customer-name">Name</Label>
            <Input
              id="customer-name"
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              placeholder="Kavita"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="customer-phone">Phone</Label>
            <Input
              id="customer-phone"
              value={form.phone}
              onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
              placeholder="8073085190"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="customer-email">Email</Label>
            <Input
              id="customer-email"
              type="email"
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              placeholder="Optional"
            />
          </div>
        </div>

        <Button onClick={handleSubmit} disabled={createCustomer.isPending}>
          {createCustomer.isPending ? "Creating..." : "Create Customer"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
