import { useEffect, useState } from "react";
import { Pencil, UserRoundPen } from "lucide-react";
import { toast } from "sonner";
import { useUpdateCustomer } from "@/hooks/use-api";
import type { Customer } from "@/lib/api";
import { normalizePhone, validateEmail, validatePersonName, validatePhone } from "@/lib/validation";
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
  const [errors, setErrors] = useState<Partial<Record<keyof CustomerForm, string>>>({});

  useEffect(() => {
    if (open) {
      setForm({
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
      });
      setErrors({});
    }
  }, [customer, open]);

  const handleSubmit = () => {
    const nextErrors: Partial<Record<keyof CustomerForm, string>> = {
      name: validatePersonName(form.name, "Name"),
      phone: validatePhone(form.phone),
      email: validateEmail(form.email),
    };
    const activeErrors = Object.fromEntries(Object.entries(nextErrors).filter(([, message]) => message));

    setErrors(activeErrors);

    if (Object.keys(activeErrors).length) {
      toast.error("Please fix the highlighted fields");
      return;
    }

    updateCustomer.mutate(
      {
        id: customer.id,
        data: {
          name: form.name.trim(),
          phone: normalizePhone(form.phone),
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
              maxLength={80}
              pattern="[A-Za-z][A-Za-z\s'-]*"
              inputMode="text"
              aria-invalid={Boolean(errors.name)}
            />
            {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="edit-customer-phone">Phone</Label>
            <Input
              id="edit-customer-phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={form.phone}
              onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
              placeholder="Phone number"
              aria-invalid={Boolean(errors.phone)}
            />
            {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="edit-customer-email">Email</Label>
            <Input
              id="edit-customer-email"
              type="email"
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              placeholder="Email address"
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
            />
            {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
          </div>
        </div>

        <Button onClick={handleSubmit} disabled={updateCustomer.isPending}>
          {updateCustomer.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
