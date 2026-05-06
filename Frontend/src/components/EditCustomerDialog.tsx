import { useEffect, useState } from "react";
import { Pencil, UserRoundPen } from "lucide-react";
import { toast } from "sonner";
import { useUpdateCustomer } from "@/hooks/use-api";
import type { Customer } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type CustomerForm = {
  name: string;
  phone: string;
  email: string;
};

interface EditCustomerDialogProps {
  customer: Customer;
}

export default function EditCustomerDialog({ customer }: EditCustomerDialogProps) {
  const updateCustomer = useUpdateCustomer();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<CustomerForm>({
    name: customer.name,
    phone: customer.phone,
    email: customer.email,
  });

  useEffect(() => {
    if (open) {
      setForm({
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
      });
    }
  }, [customer, open]);

  const handleSubmit = () => {
    if (!form.name.trim() || !form.phone.trim()) {
      toast.error("Name and phone are required");
      return;
    }

    updateCustomer.mutate(
      {
        id: customer.id,
        data: {
          name: form.name.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
        },
      },
      {
        onSuccess: () => {
          toast.success("Customer updated");
          setOpen(false);
        },
        onError: () => {
          toast.error("Failed to update customer");
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 rounded-xl">
          <Pencil size={14} />
          Edit Customer
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserRoundPen size={18} />
            Edit Customer
          </DialogTitle>
          <DialogDescription>Update this customer's contact details.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="edit-customer-name">Name</Label>
            <Input
              id="edit-customer-name"
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              placeholder="Customer name"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="edit-customer-phone">Phone</Label>
            <Input
              id="edit-customer-phone"
              value={form.phone}
              onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
              placeholder="Phone number"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="edit-customer-email">Email</Label>
            <Input
              id="edit-customer-email"
              type="email"
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              placeholder="Email address"
            />
          </div>
        </div>

        <Button onClick={handleSubmit} disabled={updateCustomer.isPending}>
          {updateCustomer.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
