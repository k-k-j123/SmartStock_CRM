import { useEffect, useState } from "react";
import { Plus, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { useCreateCustomer } from "@/hooks/use-api";
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
  const [errors, setErrors] = useState<Partial<Record<keyof CustomerForm, string>>>({});

  useEffect(() => {
    if (!open) {
      setForm(initialForm);
      setErrors({});
    }
  }, [open]);

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

    createCustomer.mutate(
      {
        name: form.name.trim(),
        phone: normalizePhone(form.phone),
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
              placeholder="Name"
              maxLength={80}
              pattern="[A-Za-z][A-Za-z\s'-]*"
              inputMode="text"
              aria-invalid={Boolean(errors.name)}
            />
            {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="customer-phone">Phone</Label>
            <Input
              id="customer-phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={form.phone}
              onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
              placeholder="1234567890"
              aria-invalid={Boolean(errors.phone)}
            />
            {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="customer-email">Email</Label>
            <Input
              id="customer-email"
              type="email"
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              placeholder="Optional"
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
            />
            {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
          </div>
        </div>

        <Button onClick={handleSubmit} disabled={createCustomer.isPending}>
          {createCustomer.isPending ? "Creating..." : "Create Customer"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
