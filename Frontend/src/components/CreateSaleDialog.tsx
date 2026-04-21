import { useEffect, useMemo, useState } from "react";
import { Loader2, Plus, Search, ShoppingCart, Trash2, UserRoundSearch } from "lucide-react";
import { toast } from "sonner";
import { useCreateSale, useProducts } from "@/hooks/use-api";
import { customerApi } from "@/lib/api";
import type { Product } from "@/lib/api";
import { useDebounce } from "@/hooks/use-debounce";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

type SelectedSaleItem = {
  productId: string;
  name: string;
  quantity: number;
  stockQuantity: number;
};

const initialCustomerForm = {
  customerPhone: "",
  customerName: "",
};

function isNotFoundError(error: unknown) {
  return error instanceof Error && error.message.includes("404");
}

interface CreateSaleDialogProps {
  triggerLabel?: string;
  triggerClassName?: string;
}

export default function CreateSaleDialog({
  triggerLabel = "Create Sale",
  triggerClassName,
}: CreateSaleDialogProps) {
  const { data: products = [] } = useProducts();
  const createSale = useCreateSale();
  const [open, setOpen] = useState(false);
  const [customerForm, setCustomerForm] = useState(initialCustomerForm);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItems, setSelectedItems] = useState<SelectedSaleItem[]>([]);
  const [lookupState, setLookupState] = useState<"idle" | "loading" | "found" | "new">("idle");
  const [lookupMessage, setLookupMessage] = useState("");
  const debouncedPhone = useDebounce(customerForm.customerPhone.trim(), 400);
  const debouncedSearch = useDebounce(searchTerm.trim().toLowerCase(), 200);

  useEffect(() => {
    if (!open) {
      setCustomerForm(initialCustomerForm);
      setSearchTerm("");
      setSelectedItems([]);
      setLookupState("idle");
      setLookupMessage("");
    }
  }, [open]);

  useEffect(() => {
    if (!debouncedPhone) {
      setLookupState("idle");
      setLookupMessage("");
      return;
    }

    let active = true;
    setLookupState("loading");
    setLookupMessage("Searching customer by phone...");

    customerApi
      .getByPhone(debouncedPhone)
      .then((customer) => {
        if (!active) {
          return;
        }

        setLookupState("found");
        setLookupMessage(`Existing customer found: ${customer.name}`);
        setCustomerForm((current) => ({
          ...current,
          customerName: customer.name || current.customerName,
        }));
      })
      .catch((error) => {
        if (!active) {
          return;
        }

        if (isNotFoundError(error)) {
          setLookupState("new");
          setLookupMessage("No customer found. This sale will create a new customer.");
          return;
        }

        setLookupState("idle");
        setLookupMessage("Customer lookup failed. You can still create the sale manually.");
      });

    return () => {
      active = false;
    };
  }, [debouncedPhone]);

  const filteredProducts = useMemo(() => {
    if (!debouncedSearch) {
      return products.slice(0, 8);
    }

    return products
      .filter((product) => {
        const searchValue = `${product.name} ${product.category}`.toLowerCase();
        return searchValue.includes(debouncedSearch);
      })
      .slice(0, 8);
  }, [debouncedSearch, products]);

  const addProduct = (product: Product) => {
    setSelectedItems((current) => {
      const existingItem = current.find((item) => item.productId === product.id);
      if (existingItem) {
        return current.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: Math.min(item.quantity + 1, item.stockQuantity) }
            : item,
        );
      }

      return [
        ...current,
        {
          productId: product.id,
          name: product.name,
          quantity: 1,
          stockQuantity: product.stockQuantity,
        },
      ];
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setSelectedItems((current) =>
      current.map((item) =>
        item.productId === productId
          ? {
              ...item,
              quantity: Math.max(1, Math.min(Number.isNaN(quantity) ? 1 : quantity, item.stockQuantity)),
            }
          : item,
      ),
    );
  };

  const removeItem = (productId: string) => {
    setSelectedItems((current) => current.filter((item) => item.productId !== productId));
  };

  const handleSubmit = () => {
    const customerPhone = customerForm.customerPhone.trim();
    const customerName = customerForm.customerName.trim();
    const items = selectedItems.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    }));

    if (!customerPhone || !customerName) {
      toast.error("Customer phone and name are required");
      return;
    }

    if (!items.length) {
      toast.error("Add at least one product");
      return;
    }

    createSale.mutate(
      {
        customerPhone,
        customerName,
        items,
      },
      {
        onSuccess: () => {
          toast.success("Sale created");
          setOpen(false);
        },
        onError: (error) => {
          toast.error(error instanceof Error ? error.message : "Failed to create sale");
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={triggerClassName}>
          <Plus size={16} />
          {triggerLabel}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart size={18} />
            Create Sale
          </DialogTitle>
          <DialogDescription>Search by customer phone, add products, and submit the sale in one flow.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 md:grid-cols-[1.05fr_1.2fr]">
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="sale-customer-phone">Customer Phone</Label>
              <Input
                id="sale-customer-phone"
                value={customerForm.customerPhone}
                onChange={(event) =>
                  setCustomerForm((current) => ({
                    ...current,
                    customerPhone: event.target.value,
                  }))
                }
                placeholder="8073085190"
              />
            </div>

            <div className="rounded-xl border border-border bg-muted/30 p-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                {lookupState === "loading" ? <Loader2 className="animate-spin" size={15} /> : <UserRoundSearch size={15} />}
                <span>{lookupMessage || "Enter a phone number to search for an existing customer."}</span>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="sale-customer-name">Customer Name</Label>
              <Input
                id="sale-customer-name"
                value={customerForm.customerName}
                onChange={(event) =>
                  setCustomerForm((current) => ({
                    ...current,
                    customerName: event.target.value,
                  }))
                }
                placeholder="Kavita"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="sale-product-search">Search Products</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                <Input
                  id="sale-product-search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search by name or category"
                  className="pl-9"
                />
              </div>
            </div>

            <ScrollArea className="h-72 rounded-xl border border-border">
              <div className="space-y-2 p-3">
                {filteredProducts.map((product) => {
                  const selected = selectedItems.some((item) => item.productId === product.id);

                  return (
                    <div
                      key={product.id}
                      className="flex items-center justify-between rounded-lg border border-border bg-background p-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">{product.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {product.category} · Stock {product.stockQuantity} · Rs {product.sellingPrice.toFixed(2)}
                        </p>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant={selected ? "secondary" : "outline"}
                        onClick={() => addProduct(product)}
                        disabled={product.stockQuantity <= 0}
                      >
                        {product.stockQuantity <= 0 ? "Out of stock" : selected ? "Add More" : "Add"}
                      </Button>
                    </div>
                  );
                })}

                {!filteredProducts.length && (
                  <div className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
                    No matching products found.
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Selected Items</h3>
              <p className="text-sm text-muted-foreground">Adjust quantities before creating the sale.</p>
            </div>

            <div className="space-y-3">
              {selectedItems.map((item) => (
                <div key={item.productId} className="rounded-xl border border-border bg-background p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.name}</p>
                      <p className="text-xs text-muted-foreground">Available stock: {item.stockQuantity}</p>
                    </div>

                    <Button type="button" variant="ghost" size="icon" onClick={() => removeItem(item.productId)}>
                      <Trash2 size={15} />
                    </Button>
                  </div>

                  <div className="mt-3 grid gap-2">
                    <Label htmlFor={`quantity-${item.productId}`}>Quantity</Label>
                    <Input
                      id={`quantity-${item.productId}`}
                      type="number"
                      min={1}
                      max={item.stockQuantity}
                      value={item.quantity}
                      onChange={(event) => updateQuantity(item.productId, Number(event.target.value))}
                    />
                  </div>
                </div>
              ))}

              {!selectedItems.length && (
                <div className="rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">
                  Search for products and add them to the sale.
                </div>
              )}
            </div>

            <Button onClick={handleSubmit} disabled={createSale.isPending} className="w-full">
              {createSale.isPending ? "Creating Sale..." : "Create Sale"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
