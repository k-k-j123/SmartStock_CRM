import { FormEvent, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { LockKeyhole, Mail, Store, ArrowLeft, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { demoAdminCredentials, useAuth } from "@/lib/auth";
import { validateEmail } from "@/lib/validation";

type LocationState = {
  from?: {
    pathname?: string;
  };
};

export default function LoginPage() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState(demoAdminCredentials.email);
  const [password, setPassword] = useState(demoAdminCredentials.password);
  const [error, setError] = useState("");
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  const redirectTo = (location.state as LocationState | null)?.from?.pathname || "/";

  if (isAuthenticated) {
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

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const normalizedEmail = email.trim();
    const emailError = validateEmail(normalizedEmail, { required: true });

    if (emailError) {
      setError(emailError);
      return;
    }

    if (!password) {
      setError("Password is required.");
      return;
    }

    if (!login(normalizedEmail, password)) {
      setError("Invalid admin email or password.");
      return;
    }

    navigate(redirectTo, { replace: true });
  };

  return (
    <main className="flex min-h-screen bg-background overflow-hidden relative">
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

      {/* Left Visual Pane (Large Devices) */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-tr from-zinc-950 to-primary/45 relative items-center justify-center p-12 overflow-hidden border-r border-border/20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-950/30 via-zinc-950/60 to-zinc-950/95 z-0" />
        <div className="absolute inset-0 bg-grid-white/[0.01] bg-[size:32px] z-0" />
        
        <div className="relative z-10 max-w-md text-white text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
            <Store className="h-8 w-8 text-primary-foreground" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight">SmartStock Management</h2>
          <p className="mt-4 text-sm text-zinc-400 leading-relaxed">
            Monitor inventories, customer interaction logs, invoice reports, and real-time analytics insights inside one unified panel.
          </p>
        </div>
      </div>

      {/* Right Credentials Form Pane */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative z-10">
        <div className="w-full max-w-md glass-card rounded-3xl p-8 sm:p-10 bg-card/50 dark:bg-zinc-900/15 backdrop-blur-2xl shadow-2xl border-white/20 dark:border-zinc-800/40">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Admin Login</h1>
            <p className="mt-2 text-xs text-muted-foreground">
              Sign in with your workspace administrator credentials.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-3 text-xs text-destructive font-medium animate-in shake duration-300">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="login-email" className="text-xs font-semibold text-muted-foreground">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/80" />
                <Input
                  id="login-email"
                  type="email"
                  placeholder="your email here"
                  className="rounded-xl border-border bg-background/50 pl-10 pr-4 py-6 text-sm focus-visible:ring-primary/40 focus-visible:border-primary transition-all duration-200"
                  autoComplete="email"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="login-password" className="text-xs font-semibold text-muted-foreground">Password</Label>
              <div className="relative">
                <LockKeyhole className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/80" />
                <Input
                  id="login-password"
                  type="password"
                  placeholder="your password here"
                  className="rounded-xl border-border bg-background/50 pl-10 pr-4 py-6 text-sm focus-visible:ring-primary/40 focus-visible:border-primary transition-all duration-200"
                  autoComplete="current-password"
                  required
                  minLength={6}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full rounded-2xl bg-primary hover:bg-primary/95 text-primary-foreground shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 py-6 font-semibold"
            >
              Log In
            </Button>
          </form>

          {/* Prompt to return to selection */}
          <div className="mt-8 text-center text-xs text-muted-foreground border-t border-border/50 pt-6">
            Not an administrator?{" "}
            <Link to="/customer-login" className="font-semibold text-primary hover:underline">
              Go to Customer Login
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
