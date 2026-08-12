import { FormEvent, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Phone, ReceiptText, ArrowLeft, Sun, Moon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { customerApi } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { normalizePhone, validatePhone } from "@/lib/validation";

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
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  const redirectTo = (location.state as LocationState | null)?.from?.pathname || "/customer/sales";

  if (isCustomerAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const normalizedPhone = normalizePhone(phone);
    const phoneError = validatePhone(phone);

    if (phoneError) {
      setError(phoneError);
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
      setError("No registered customer profile matches this phone number.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-12 overflow-hidden relative select-none">
      {/* Background glow blobs */}
      <div className="glow-blob -left-20 -bottom-20 h-[300px] w-[300px] bg-primary/10 dark:bg-primary/5" />
      <div className="glow-blob -right-20 -top-20 h-[300px] w-[300px] bg-purple-500/10 dark:bg-purple-900/5" />

      {/* Floating Header Actions */}
      <header className="absolute top-6 left-6 right-6 flex items-center justify-between z-50">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft size={14} className="transition-transform duration-200 group-hover:-translate-x-0.5" />
          Back to Portal
        </Link>

        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={toggleTheme}
          className="h-9 w-9 rounded-xl border-border/60 bg-card/45 dark:bg-zinc-950/45 backdrop-blur-md hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-300"
        >
          {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </Button>
      </header>

      <div className="w-full max-w-md relative z-10">
        <div className="mb-8 text-center sm:text-left">
          <div className="mx-auto sm:mx-0 mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary to-purple-600 text-white shadow-xl shadow-primary/20">
            <ReceiptText className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">View Your Purchases</h1>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            Sign in with the verified phone number used during checkout to view your invoices, purchase receipts, and sales timeline.
          </p>
        </div>

        <div className="glass-card rounded-3xl p-8 bg-card/50 dark:bg-zinc-900/15 backdrop-blur-2xl shadow-2xl border-white/20 dark:border-zinc-800/40">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-3 text-xs text-destructive font-medium animate-in shake duration-300">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="customer-phone" className="text-xs font-semibold text-muted-foreground">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/80" />
                <Input
                  id="customer-phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="Enter phone number"
                  className="rounded-xl border-border bg-background/50 pl-10 pr-4 py-6 text-sm focus-visible:ring-primary/40 focus-visible:border-primary transition-all duration-200"
                  value={phone}
                  required
                  onChange={(event) => setPhone(event.target.value)}
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full rounded-2xl bg-primary hover:bg-primary/95 text-primary-foreground shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 py-6 font-semibold" 
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Verifying...
                </span>
              ) : (
                "Access Purchases"
              )}
            </Button>
          </form>
        </div>

        <div className="mt-8 text-center text-xs text-muted-foreground pt-2">
          Are you an administrator?{" "}
          <Link className="font-semibold text-primary hover:underline" to="/login">
            Sign In as Admin
          </Link>
        </div>
      </div>
    </main>
  );
}
