import { FormEvent, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Phone, ReceiptText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { customerApi } from "@/lib/api";
import { useAuth } from "@/lib/auth";

type LocationState = {
  from?: {
    pathname?: string;
  };
};

export default function CustomerLoginPage() {
  const { isCustomerAuthenticated, loginCustomer } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const redirectTo = (location.state as LocationState | null)?.from?.pathname || "/customer/sales";

  if (isCustomerAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const normalizedPhone = phone.trim();

    if (!normalizedPhone) {
      setError("Enter the phone number used for your purchases.");
      return;
    }

    try {
      setIsLoading(true);
      const customer = await customerApi.getByPhone(normalizedPhone);
      loginCustomer({
        id: customer.id,
        name: customer.name,
        phone: customer.phone,
      });
      navigate(redirectTo, { replace: true });
    } catch {
      setError("No customer was found with that phone number.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <ReceiptText className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">View Your Purchases</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Sign in with the phone number used at checkout to see your sales history.
          </p>
        </div>

        <div className="rounded-lg border border-border bg-card p-7 shadow-sm">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="customer-phone">Phone number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="customer-phone"
                  type="tel"
                  autoComplete="tel"
                  className="pl-9"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                />
              </div>
            </div>

            {error ? <p className="text-sm font-medium text-destructive">{error}</p> : null}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Checking..." : "Sign in"}
            </Button>
          </form>
        </div>

        <div className="mt-5 text-center text-sm text-muted-foreground">
          <Link className="font-medium text-primary hover:underline" to="/login">
            Admin login
          </Link>
        </div>
      </div>
    </main>
  );
}
