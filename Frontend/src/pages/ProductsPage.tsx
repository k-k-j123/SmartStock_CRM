import { useState } from "react";
import { useProducts, useCreateProduct, useDeleteProduct } from "@/hooks/use-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Package, AlertTriangle, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { validateNumber, validateRequiredText } from "@/lib/validation";
import { formatCurrency } from "@/lib/utils";

type ProductForm = {
  name: string;
  category: string;
  costPrice: string;
  sellingPrice: string;
  stockQuantity: string;
  lowStockThreshold: string;
};

const initialProductForm: ProductForm = {
  name: "",
  category: "",
  costPrice: "",
  sellingPrice: "",
  stockQuantity: "",
  lowStockThreshold: "",
};

export default function ProductsPage() {
  const { data: products = [] } = useProducts();
  const createProduct = useCreateProduct();
  const deleteProduct = useDeleteProduct();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<ProductForm>(initialProductForm);
  const [errors, setErrors] = useState<Partial<Record<keyof ProductForm, string>>>({});

  const handleSubmit = () => {
    const nextErrors: Partial<Record<keyof ProductForm, string>> = {
      name: validateRequiredText(form.name, "Product name", 2, 100),
      category: validateRequiredText(form.category, "Category", 2, 60),
      costPrice: validateNumber(form.costPrice, "Cost price", { min: 0 }),
      sellingPrice: validateNumber(form.sellingPrice, "Selling price", { min: 0.01 }),
      stockQuantity: validateNumber(form.stockQuantity, "Stock quantity", { min: 0, integer: true }),
      lowStockThreshold: validateNumber(form.lowStockThreshold, "Low stock threshold", { min: 0, integer: true }),
    };

    const costPrice = Number(form.costPrice);
    const sellingPrice = Number(form.sellingPrice);

    if (!nextErrors.sellingPrice && Number.isFinite(costPrice) && Number.isFinite(sellingPrice) && sellingPrice < costPrice) {
      nextErrors.sellingPrice = "Selling price must be greater than or equal to cost price.";
    }

    const activeErrors = Object.fromEntries(Object.entries(nextErrors).filter(([, message]) => message));
    setErrors(activeErrors);

    if (Object.keys(activeErrors).length) {
      toast.error("Please fix the highlighted fields");
      return;
    }

    createProduct.mutate(
      {
        name: form.name.trim(),
        category: form.category.trim(),
        costPrice: Number(form.costPrice),
        sellingPrice: Number(form.sellingPrice),
        stockQuantity: Number(form.stockQuantity),
        lowStockThreshold: Number(form.lowStockThreshold),
      },
      {
        onSuccess: () => {
          toast.success("Product created successfully");
          setOpen(false);
          setForm(initialProductForm);
          setErrors({});
        },
        onError: () => {
          toast.error("Failed to create product");
        }
      }
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">Inventory Registry</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">Manage stock availability, pricing, cost logs, and active stock thresholds.</p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 rounded-2xl bg-primary hover:bg-primary/95 text-primary-foreground shadow-lg shadow-primary/10 hover:scale-[1.02] active:scale-[0.98] transition-all py-5">
              <Plus size={15} /> Add New Product
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-3xl max-w-md bg-card/95 backdrop-blur-xl border border-border/60">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-foreground font-black tracking-tight">
                <Package className="h-5 w-5 text-primary" /> New Product Registry
              </DialogTitle>
              <DialogDescription className="text-xs">
                Fill in the product details below to add a new item to stock inventory.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-3 max-h-[70vh] overflow-y-auto pr-1">
              {[
                { key: "name", label: "Product Name", type: "text", placeholder: "e.g., Slim Fit Cotton Shirt" },
                { key: "category", label: "Product Category", type: "text", placeholder: "e.g., Apparel" },
                { key: "costPrice", label: "Cost Price (Rs)", type: "number", placeholder: "e.g., 25.00" },
                { key: "sellingPrice", label: "Selling Price (Rs)", type: "number", placeholder: "e.g., 49.99" },
                { key: "stockQuantity", label: "Initial Stock Quantity", type: "number", placeholder: "e.g., 100" },
                { key: "lowStockThreshold", label: "Low Stock Alert Threshold", type: "number", placeholder: "e.g., 15" },
              ].map(({ key, label, type, placeholder }) => (
                <div key={key} className="space-y-1.5">
                  <Label htmlFor={`new-product-${key}`} className="text-xs font-semibold text-muted-foreground">{label}</Label>
                  <Input
                    id={`new-product-${key}`}
                    type={type}
                    min={type === "number" ? 0 : undefined}
                    step={key === "costPrice" || key === "sellingPrice" ? "0.01" : type === "number" ? "1" : undefined}
                    placeholder={placeholder}
                    className="rounded-xl border-border bg-background/50 text-sm focus-visible:ring-primary/45"
                    value={form[key as keyof typeof form]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    maxLength={type === "text" ? 100 : undefined}
                    aria-invalid={Boolean(errors[key as keyof ProductForm])}
                  />
                  {errors[key as keyof ProductForm] && (
                    <p className="text-xs text-destructive">{errors[key as keyof ProductForm]}</p>
                  )}
                </div>
              ))}
            </div>
            <Button onClick={handleSubmit} disabled={createProduct.isPending} className="w-full rounded-xl py-5 font-semibold bg-primary hover:bg-primary/95 text-primary-foreground shadow-lg shadow-primary/10 mt-2">
              {createProduct.isPending ? "Creating..." : "Register Product"}
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table section */}
      <div className="glass-panel rounded-3xl overflow-hidden bg-card/35 dark:bg-zinc-900/10 backdrop-blur-xl border border-white/20 dark:border-zinc-800/40 shadow-xl shadow-black/[0.01]">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-border/40 text-left text-xs text-muted-foreground/80 font-bold uppercase tracking-widest bg-muted/20">
                <th className="p-4 sm:p-5">Product Details</th>
                <th className="p-4 sm:p-5">Category</th>
                <th className="p-4 sm:p-5 text-right">Cost Price</th>
                <th className="p-4 sm:p-5 text-right">Selling Price</th>
                <th className="p-4 sm:p-5 text-center">In Stock</th>
                <th className="p-4 sm:p-5">Status</th>
                <th className="p-4 sm:p-5 w-16"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-muted/30 dark:hover:bg-zinc-950/20 transition-colors">
                  <td className="p-4 sm:p-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Package size={16} />
                      </div>
                      <span className="text-sm font-bold text-foreground">{p.name}</span>
                    </div>
                  </td>
                  <td className="p-4 sm:p-5">
                    <Badge variant="secondary" className="rounded-lg font-semibold text-xs border-border/50 text-muted-foreground bg-muted/40">
                      {p.category}
                    </Badge>
                  </td>
                  <td className="p-4 sm:p-5 text-sm text-right font-medium text-muted-foreground">{formatCurrency(p.costPrice)}</td>
                  <td className="p-4 sm:p-5 text-sm text-right font-bold text-foreground">{formatCurrency(p.sellingPrice)}</td>
                  <td className="p-4 sm:p-5 text-sm text-center font-semibold text-foreground">{p.stockQuantity}</td>
                  <td className="p-4 sm:p-5">
                    {p.stockQuantity <= p.lowStockThreshold ? (
                      <Badge variant="destructive" className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide bg-destructive/10 text-destructive dark:bg-destructive/20 border-destructive/20 animate-pulse">
                        <AlertTriangle size={11} /> Low Stock
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 dark:bg-emerald-500/20">
                        In Stock
                      </Badge>
                    )}
                  </td>
                  <td className="p-4 sm:p-5">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete ${p.name}?`)) {
                          deleteProduct.mutate(p.id, { onSuccess: () => toast.success("Product deleted successfully") });
                        }
                      }}
                      disabled={deleteProduct.isPending}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
