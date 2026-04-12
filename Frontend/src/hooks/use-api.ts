import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { customerApi, productApi, salesApi, analyticsApi } from "@/lib/api";
import type { Customer, Product, CreateSaleRequest } from "@/lib/api";
import { mockCustomers, mockProducts, mockSales, mockBestProducts, mockRestockSuggestions, mockLoyalCustomers } from "@/lib/mock-data";

// Set to true to use mock data (when backend is not running)
const USE_MOCK = false;

// Customers
export function useCustomers() {
  return useQuery({
    queryKey: ["customers"],
    queryFn: USE_MOCK ? () => Promise.resolve(mockCustomers) : customerApi.getAll,
  });
}

export function useCreateCustomer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: USE_MOCK
      ? async (data: Omit<Customer, "id" | "totalSpent" | "lastVisit" | "recentPurchaseIds">) => {
          mockCustomers.push({ ...data, id: `c${Date.now()}`, totalSpent: 0, lastVisit: new Date().toISOString(), recentPurchaseIds: [] });
          return "created";
        }
      : customerApi.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["customers"] }),
  });
}

// Products
export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: USE_MOCK ? () => Promise.resolve([...mockProducts]) : productApi.getAll,
  });
}

export function useLowStockProducts(threshold = 10) {
  return useQuery({
    queryKey: ["products", "low-stock", threshold],
    queryFn: USE_MOCK
      ? () => Promise.resolve(mockProducts.filter((p) => p.stockQuantity <= p.lowStockThreshold))
      : () => productApi.getLowStock(threshold),
  });
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: USE_MOCK
      ? async (data: Omit<Product, "id">) => {
          const p = { ...data, id: `p${Date.now()}` };
          mockProducts.push(p);
          return p;
        }
      : productApi.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: USE_MOCK
      ? async (id: string) => {
          const idx = mockProducts.findIndex((p) => p.id === id);
          if (idx >= 0) mockProducts.splice(idx, 1);
          return "deleted";
        }
      : productApi.delete,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}



// Sales
export function useSales() {
  return useQuery({
    queryKey: ["sales"],
    queryFn: USE_MOCK ? () => Promise.resolve([...mockSales]) : salesApi.getAll,
  });
}

export function useCreateSale() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: USE_MOCK
      ? async (data: CreateSaleRequest) => {
          const sale = {
            id: `s${Date.now()}`,
            customerId: data.customerId || "",
            items: data.items.map((i) => ({ ...i, name: "Product", priceAtSale: 0 })),
            totalAmount: 0,
            createdAt: new Date().toISOString(),
          };
          mockSales.push(sale);
          return sale;
        }
      : salesApi.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["sales"] }),
  });
}

export function useDeleteSale() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: USE_MOCK
      ? async (id: string) => {
          const idx = mockSales.findIndex((s) => s.id === id);
          if (idx >= 0) mockSales.splice(idx, 1);
          return "deleted";
        }
      : salesApi.delete,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["sales"] }),
  });
}

// Analytics
export function useBestProducts() {
  return useQuery({
    queryKey: ["analytics", "best-products"],
    queryFn: USE_MOCK ? () => Promise.resolve(mockBestProducts) : analyticsApi.bestProducts,
  });
}

export function useRestockSuggestions() {
  return useQuery({
    queryKey: ["analytics", "restock"],
    queryFn: USE_MOCK ? () => Promise.resolve(mockRestockSuggestions) : analyticsApi.restockSuggestions,
  });
}

export function useLoyalCustomers() {
  return useQuery({
    queryKey: ["analytics", "loyal-customers"],
    queryFn: USE_MOCK ? () => Promise.resolve(mockLoyalCustomers) : analyticsApi.loyalCustomers,
  });
}

export function useTrending() {
  return useQuery({
    queryKey: ["analytics", "trending"],
    queryFn: USE_MOCK ? () => Promise.resolve({}) : analyticsApi.trending,
  });
}
