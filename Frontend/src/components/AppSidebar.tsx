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
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-16 flex-col items-center gap-2 border-r border-border bg-card py-6">
      {links.map(({ to, icon: Icon, label }) => {
        const active = location.pathname === to;
        return (
          <NavLink
            key={to}
            to={to}
            title={label}
            className={`flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-200 ${
              active
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <Icon size={20} />
          </NavLink>
        );
      })}
    </aside>
  );
}
