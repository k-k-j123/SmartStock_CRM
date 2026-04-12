import { useState } from "react";
import { useProducts, useCreateProduct, useDeleteProduct } from "@/hooks/use-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Package, AlertTriangle, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function ProductsPage() {
  const { data: products = [] } = useProducts();
  const createProduct = useCreateProduct();
  const deleteProduct = useDeleteProduct();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", category: "", costPrice: "", sellingPrice: "", stockQuantity: "", lowStockThreshold: "" });

  const handleSubmit = () => {
    createProduct.mutate(
      {
        name: form.name,
        category: form.category,
        costPrice: Number(form.costPrice),
        sellingPrice: Number(form.sellingPrice),
        stockQuantity: Number(form.stockQuantity),
        lowStockThreshold: Number(form.lowStockThreshold),
      },
      {
        onSuccess: () => {
          toast.success("Product created");
          setOpen(false);
          setForm({ name: "", category: "", costPrice: "", sellingPrice: "", stockQuantity: "", lowStockThreshold: "" });
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">Products</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 rounded-xl">
              <Plus size={16} /> Add Product
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>New Product</DialogTitle></DialogHeader>
            <div className="grid gap-4 py-4">
              {[
                { key: "name", label: "Name", type: "text" },
                { key: "category", label: "Category", type: "text" },
                { key: "costPrice", label: "Cost Price", type: "number" },
                { key: "sellingPrice", label: "Selling Price", type: "number" },
                { key: "stockQuantity", label: "Stock Quantity", type: "number" },
                { key: "lowStockThreshold", label: "Low Stock Threshold", type: "number" },
              ].map(({ key, label, type }) => (
                <div key={key} className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">{label}</Label>
                  <Input
                    type={type}
                    className="col-span-3"
                    value={form[key as keyof typeof form]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  />
                </div>
              ))}
            </div>
            <Button onClick={handleSubmit} disabled={createProduct.isPending}>Create</Button>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-2xl bg-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border text-left text-xs text-muted-foreground">
              <th className="p-4">Product</th>
              <th className="p-4">Category</th>
              <th className="p-4">Cost</th>
              <th className="p-4">Price</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Status</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                      <Package size={16} className="text-primary" />
                    </div>
                    <span className="text-sm font-medium text-foreground">{p.name}</span>
                  </div>
                </td>
                <td className="p-4 text-sm text-muted-foreground">{p.category}</td>
                <td className="p-4 text-sm text-muted-foreground">${p.costPrice.toFixed(2)}</td>
                <td className="p-4 text-sm font-medium text-foreground">${p.sellingPrice.toFixed(2)}</td>
                <td className="p-4 text-sm text-foreground">{p.stockQuantity}</td>
                <td className="p-4">
                  {p.stockQuantity <= p.lowStockThreshold ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[hsl(var(--badge-danger-bg))] px-2.5 py-1 text-xs font-medium text-[hsl(var(--badge-danger))]">
                      <AlertTriangle size={12} /> Low Stock
                    </span>
                  ) : (
                    <span className="rounded-full bg-[hsl(var(--badge-success-bg))] px-2.5 py-1 text-xs font-medium text-[hsl(var(--badge-success))]">
                      In Stock
                    </span>
                  )}
                </td>
                <td className="p-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() => deleteProduct.mutate(p.id, { onSuccess: () => toast.success("Product deleted") })}
                    disabled={deleteProduct.isPending}
                  >
                    <Trash2 size={16} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
