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
  sellingPrice: number;
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

  const billTotal = useMemo(
    () => selectedItems.reduce((total, item) => total + item.sellingPrice * item.quantity, 0),
    [selectedItems],
  );

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
          sellingPrice: product.sellingPrice,
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

      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart size={18} />
            Create Sale
          </DialogTitle>
          <DialogDescription>Search by customer phone, add products, and submit the sale in one flow.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 md:grid-cols-[1.05fr_0.95fr]">
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

          <div>
            <div className="sticky top-4 rounded-2xl border border-border bg-background p-5 shadow-lg">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Bill Preview</h3>
                  <p className="text-sm text-muted-foreground">
                    {customerForm.customerName.trim() || "Customer"} - {customerForm.customerPhone.trim() || "No phone"}
                  </p>
                </div>
                <div className="rounded-lg bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                  Rs {billTotal.toFixed(2)}
                </div>
              </div>

              <div className="overflow-hidden rounded-xl border border-border">
                <div className="grid grid-cols-[1fr_72px_88px] border-b border-border bg-muted/40 px-3 py-2 text-xs font-medium text-muted-foreground">
                  <span>Product</span>
                  <span className="text-right">Qty</span>
                  <span className="text-right">Amount</span>
                </div>

                {selectedItems.map((item) => (
                  <div key={item.productId} className="border-b border-border p-3 last:border-0">
                    <div className="grid grid-cols-[1fr_72px_88px] items-center gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Rs {item.sellingPrice.toFixed(2)} each - Stock {item.stockQuantity}
                        </p>
                      </div>

                      <Input
                        id={`quantity-${item.productId}`}
                        type="number"
                        min={1}
                        max={item.stockQuantity}
                        value={item.quantity}
                        onChange={(event) => updateQuantity(item.productId, Number(event.target.value))}
                        className="h-9 text-right"
                        aria-label={`${item.name} quantity`}
                      />

                      <div className="flex items-center justify-end gap-1">
                        <span className="text-sm font-semibold text-foreground">
                          Rs {(item.sellingPrice * item.quantity).toFixed(2)}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                          onClick={() => removeItem(item.productId)}
                          aria-label={`Remove ${item.name}`}
                        >
                          <Trash2 size={15} />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}

                {!selectedItems.length && (
                  <div className="p-6 text-sm text-muted-foreground">
                    Search for products and add them to build the bill.
                  </div>
                )}
              </div>

              <div className="mt-4 space-y-2 rounded-xl bg-muted p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Items</span>
                  <span className="font-medium text-foreground">{selectedItems.length}</span>
                </div>
                <div className="flex items-center justify-between text-base font-bold">
                  <span>Total Amount</span>
                  <span>Rs {billTotal.toFixed(2)}</span>
                </div>
              </div>

              <Button onClick={handleSubmit} disabled={createSale.isPending} className="mt-4 w-full">
                {createSale.isPending ? "Saving Sale..." : "OK - Save Sale"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
