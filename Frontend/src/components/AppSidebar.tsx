import { NavLink, useLocation } from "react-router-dom";
import { Home, Package, Users, ShoppingCart, BarChart3, TrendingUp, Settings } from "lucide-react";

const links = [
  { to: "/", icon: Home, label: "Dashboard" },
  { to: "/products", icon: Package, label: "Products" },
  { to: "/customers", icon: Users, label: "Customers" },
  { to: "/sales", icon: ShoppingCart, label: "Sales" },
  { to: "/analytics", icon: BarChart3, label: "Analytics" },
  { to: "/trending", icon: TrendingUp, label: "Trending" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

export default function AppSidebar() {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-16 flex-col items-center justify-between border-r border-border/40 bg-card/60 dark:bg-zinc-950/65 backdrop-blur-xl py-6">
      <div className="flex flex-col items-center gap-6 w-full">
        {/* Brand Icon with glowing gradient background */}
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-purple-600 text-white shadow-lg shadow-primary/20 hover:rotate-6 transition-all duration-300">
          <span className="text-sm font-black tracking-tighter">S</span>
          <span className="text-xs font-black tracking-tighter -ml-0.5">S</span>
        </div>
        
        <nav className="flex flex-col items-center gap-3.5 w-full px-2">
          {links.slice(0, -1).map(({ to, icon: Icon, label }) => {
            const active = location.pathname === to || (to !== "/" && location.pathname.startsWith(to));
            return (
              <NavLink
                key={to}
                to={to}
                title={label}
                className={`relative flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-300 group ${
                  active
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30 scale-105"
                    : "text-muted-foreground hover:bg-primary/10 hover:text-primary hover:scale-105"
                }`}
              >
                <Icon size={18} className="transition-transform duration-300 group-hover:scale-110" />
                {active && (
                  <span className="absolute left-0 top-1/3 bottom-1/3 w-0.5 bg-primary-foreground rounded-r-md" />
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="w-full px-2">
        {links.slice(-1).map(({ to, icon: Icon, label }) => {
          const active = location.pathname === to;
          return (
            <NavLink
              key={to}
              to={to}
              title={label}
              className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-300 group ${
                active
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30 scale-105"
                  : "text-muted-foreground hover:bg-primary/10 hover:text-primary hover:scale-105"
              }`}
            >
              <Icon size={18} className="transition-transform duration-300 group-hover:rotate-45" />
            </NavLink>
          );
        })}
      </div>
    </aside>
  );
}

