import { Link } from "react-router-dom";
import { ShieldCheck, ShoppingBag, Store } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-12">
      <div className="w-full max-w-4xl">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Store className="h-7 w-7" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">SmartStock</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
            Choose how you want to sign in.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <section className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-bold text-foreground">Admin</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Manage products, customers, sales, analytics, and settings.
            </p>
            <Button asChild className="mt-6 w-full">
              <Link to="/login">Admin login</Link>
            </Button>
          </section>

          <section className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-bold text-foreground">Customer</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Sign in with your phone number to view only your purchase history.
            </p>
            <Button asChild variant="outline" className="mt-6 w-full">
              <Link to="/customer-login">Customer login</Link>
            </Button>
          </section>
        </div>
      </div>
    </main>
  );
}
