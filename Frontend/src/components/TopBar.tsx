import { Search, Package, Users, Loader2, LogOut, Sun, Moon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useRef } from "react";
import { searchApi, SearchResults } from "@/lib/api";
import { useDebounce } from "@/hooks/use-debounce";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

export default function TopBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  const debouncedQuery = useDebounce(query, 300);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { adminEmail, logout } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (debouncedQuery.trim().length > 1) {
      setIsLoading(true);
      searchApi.search(debouncedQuery)
        .then(res => {
          setResults(res);
          setIsOpen(true);
        })
        .catch(err => console.error("Search error:", err))
        .finally(() => setIsLoading(false));
    } else {
      setResults(null);
      setIsOpen(false);
    }
  }, [debouncedQuery]);

  const handleSelect = (type: 'products' | 'customers', id: string) => {
    setIsOpen(false);
    setQuery("");
    navigate(`/${type}/${id}`);
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

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
    <header className="flex h-16 items-center justify-between border-b border-border/40 bg-card/40 dark:bg-zinc-950/45 backdrop-blur-md px-6 relative z-50">
      <div className="flex items-center gap-6">
        <h2 className="text-md font-extrabold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent sm:text-lg">
          SmartStock
        </h2>
        <div className="relative" ref={dropdownRef}>
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search products or customers..."
            className="w-64 sm:w-80 rounded-xl border-border/60 bg-background/50 pl-9 pr-12 text-sm focus-visible:ring-primary/40 focus-visible:border-primary transition-all duration-200"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.trim().length > 1 && setIsOpen(true)}
          />
          {isLoading ? (
            <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
          ) : (
            <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              /
            </kbd>
          )}

          {isOpen && (results?.products.length || results?.customers.length) ? (
            <div className="absolute top-full mt-2 w-full max-h-[350px] overflow-y-auto rounded-xl border border-border/50 bg-card/95 dark:bg-zinc-900/95 backdrop-blur-xl shadow-xl p-2 animate-in fade-in slide-in-from-top-1 duration-200 scrollbar-thin">
              {results.products.length > 0 && (
                <div className="mb-2">
                  <h3 className="px-2 py-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Products</h3>
                  {results.products.map(product => (
                    <button
                      key={product.id}
                      className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-primary/10 hover:text-foreground text-sm text-left transition-colors"
                      onClick={() => handleSelect('products', product.id)}
                    >
                      <Package className="h-4 w-4 text-primary/75" />
                      <div className="flex flex-grow flex-col">
                        <span className="font-medium text-foreground text-xs sm:text-sm">{product.name}</span>
                        <span className="text-[10px] sm:text-xs text-muted-foreground">{product.category} • {formatCurrency(product.sellingPrice)}</span>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-[10px] font-semibold text-foreground">Stock: {product.stockQuantity}</span>
                        {product.stockQuantity <= product.lowStockThreshold && (
                          <Badge variant="destructive" className="h-4 px-1 text-[9px] font-bold animate-pulse">Low</Badge>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
              {results.customers.length > 0 && (
                <div>
                  <h3 className="px-2 py-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Customers</h3>
                  {results.customers.map(customer => (
                    <button
                      key={customer.id}
                      className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-primary/10 hover:text-foreground text-sm text-left transition-colors"
                      onClick={() => handleSelect('customers', customer.id)}
                    >
                      <Users className="h-4 w-4 text-primary/75" />
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground text-xs sm:text-sm">{customer.name}</span>
                        <span className="text-[10px] sm:text-xs text-muted-foreground">{customer.phone}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : isOpen && query.trim().length > 1 && !isLoading ? (
            <div className="absolute top-full mt-2 w-full rounded-xl border border-border bg-card/95 dark:bg-zinc-900/95 backdrop-blur-xl shadow-lg p-4 text-center text-xs text-muted-foreground">
              No results found for "{query}"
            </div>
          ) : null}
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Sun/Moon Theme Toggle Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          className="h-9 w-9 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-300"
        >
          {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </Button>

        <span className="hidden text-xs font-medium text-muted-foreground sm:inline bg-muted border border-border px-2.5 py-1 rounded-xl">
          {adminEmail}
        </span>
        
        <Button 
          variant="ghost" 
          size="icon" 
          title="Log out" 
          onClick={handleLogout}
          className="h-9 w-9 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-300"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
