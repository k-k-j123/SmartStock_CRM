import { Search, Package, Users, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useRef } from "react";
import { searchApi, SearchResults } from "@/lib/api";
import { useDebounce } from "@/hooks/use-debounce";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

export default function TopBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6 relative z-50">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-bold text-foreground">SmartStock</h1>
        <div className="relative" ref={dropdownRef}>
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search products or customers..."
            className="w-80 rounded-xl border-border bg-background pl-9 text-sm"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.trim().length > 1 && setIsOpen(true)}
          />
          {isLoading && (
            <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
          )}

          {isOpen && (results?.products.length || results?.customers.length) ? (
            <div className="absolute top-full mt-2 w-full max-h-[400px] overflow-y-auto rounded-xl border border-border bg-card shadow-lg p-2 animate-in fade-in zoom-in-95 duration-200">
              {results.products.length > 0 && (
                <div className="mb-2">
                  <h3 className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Products</h3>
                  {results.products.map(product => (
                    <button
                      key={product.id}
                      className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-accent text-sm text-left transition-colors"
                      onClick={() => handleSelect('products', product.id)}
                    >
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <div className="flex flex-grow flex-col">
                        <span className="font-medium">{product.name}</span>
                        <span className="text-xs text-muted-foreground">{product.category} • ${product.sellingPrice}</span>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-xs font-semibold">Stock: {product.stockQuantity}</span>
                        {product.stockQuantity <= product.lowStockThreshold && (
                          <Badge variant="destructive" className="h-4 px-1 text-[10px]">Low</Badge>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
              {results.customers.length > 0 && (
                <div>
                  <h3 className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Customers</h3>
                  {results.customers.map(customer => (
                    <button
                      key={customer.id}
                      className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-accent text-sm text-left transition-colors"
                      onClick={() => handleSelect('customers', customer.id)}
                    >
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <div className="flex flex-col">
                        <span className="font-medium">{customer.name}</span>
                        <span className="text-xs text-muted-foreground">{customer.phone}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : isOpen && query.trim().length > 1 && !isLoading ? (
            <div className="absolute top-full mt-2 w-full rounded-xl border border-border bg-card shadow-lg p-4 text-center text-sm text-muted-foreground">
              No results found for "{query}"
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}

