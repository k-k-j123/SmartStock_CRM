import { FormEvent, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { LockKeyhole, Mail, PackageCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { demoAdminCredentials, useAuth } from "@/lib/auth";

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

  const redirectTo = (location.state as LocationState | null)?.from?.pathname || "/";

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!login(email, password)) {
      setError("Invalid admin email or password.");
      return;
    }

    navigate(redirectTo, { replace: true });
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="grid min-h-screen lg:grid-cols-[0.95fr_1.05fr]">
        <section className="hidden flex-col justify-between bg-foreground p-10 text-background lg:flex">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-background text-foreground">
              <PackageCheck className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xl font-bold leading-none">SmartStock</p>
              <p className="mt-1 text-sm text-background/70">Admin Console</p>
            </div>
          </div>

          <div className="max-w-md">
            <p className="text-4xl font-bold leading-tight">Inventory, sales, and customer insights in one workspace.</p>
            <p className="mt-5 text-base leading-7 text-background/70">
              Sign in to manage products, review sales, and monitor business trends.
            </p>
          </div>
        </section>

        <section className="flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            <div className="mb-9 lg:hidden">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <PackageCheck className="h-6 w-6" />
              </div>
              <h1 className="text-2xl font-bold">SmartStock Admin</h1>
            </div>

            <div className="rounded-lg border border-border bg-card p-7 shadow-sm">
              <div className="mb-7">
                <h2 className="text-2xl font-bold tracking-tight">Admin Login</h2>
                <p className="mt-2 text-sm text-muted-foreground">Use the temporary admin credentials to continue.</p>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      className="pl-9"
                      placeholder="your email here"
                      onChange={(event) => setEmail(event.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      autoComplete="current-password"
                      className="pl-9"
                      placeholder="your pass here"
                      onChange={(event) => setPassword(event.target.value)}
                    />
                  </div>
                </div>

                {error ? <p className="text-sm font-medium text-destructive">{error}</p> : null}

                <Button type="submit" className="w-full">
                  Sign in
                </Button>
              </form>

              {/* <div className="mt-6 rounded-md bg-muted p-4 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">Temporary credentials</p>
                <p className="mt-1">Email: {demoAdminCredentials.email}</p>
                <p>Password: {demoAdminCredentials.password}</p>
              </div> */}
            </div>
            <div className="mt-5 text-center text-sm text-muted-foreground">
              <Link className="font-medium text-primary hover:underline" to="/customer-login">
                Customer login
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
