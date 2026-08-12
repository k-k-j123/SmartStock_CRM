import { Link } from "react-router-dom";
import { ShieldCheck, ShoppingBag, Store, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export default function LandingPage() {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

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

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-background px-6 py-12 overflow-hidden select-none">
      {/* Visual background glows */}
      <div className="glow-blob left-1/4 top-1/4 h-[300px] w-[300px] bg-primary/10 dark:bg-primary/5" />
      <div className="glow-blob right-1/4 bottom-1/4 h-[350px] w-[350px] bg-purple-500/10 dark:bg-purple-900/5" />
      
      {/* Theme Toggler Header */}
      <header className="absolute top-6 right-6 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleTheme}
          className="h-10 w-10 rounded-xl border-border/60 bg-card/40 dark:bg-zinc-950/45 backdrop-blur-md hover:bg-muted text-muted-foreground hover:text-foreground shadow-sm transition-all duration-300"
        >
          {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </Button>
      </header>

      <div className="w-full max-w-4xl relative z-10">
        <div className="mb-14 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary to-purple-600 text-white shadow-xl shadow-primary/25 hover:rotate-6 transition-transform duration-300">
            <Store className="h-8 w-8" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent sm:text-5xl">
            SmartStock CRM
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-sm sm:text-base leading-relaxed text-muted-foreground">
            A premium inventory management, sales tracking, and customer relationship workspace.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Admin Section */}
          <section className="glass-card flex flex-col justify-between rounded-3xl p-8 bg-card/40 dark:bg-zinc-900/25 backdrop-blur-xl">
            <div>
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-inner">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold text-foreground tracking-tight">Admin Console</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Gain full administrative control. Track real-time stock status, analyze sales history, manage customers, and generate analytics reports.
              </p>
            </div>
            <Button asChild className="mt-8 w-full rounded-2xl bg-primary hover:bg-primary/95 text-primary-foreground shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 py-6">
              <Link to="/login">Sign In as Admin</Link>
            </Button>
          </section>

          {/* Customer Section */}
          <section className="glass-card flex flex-col justify-between rounded-3xl p-8 bg-card/40 dark:bg-zinc-900/25 backdrop-blur-xl">
            <div>
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-500 shadow-inner">
                <ShoppingBag className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold text-foreground tracking-tight">Customer Portal</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Access your personalized purchase portal. Enter your verified phone number to instantly view your complete transactions history and receipts.
              </p>
            </div>
            <Button asChild variant="outline" className="mt-8 w-full rounded-2xl border-border/80 bg-background/50 text-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 py-6">
              <Link to="/customer-login">Sign In as Customer</Link>
            </Button>
          </section>
        </div>
      </div>
    </main>
  );
}

