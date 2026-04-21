// SmartStock API Client
// Configure BASE_URL to point to your backend

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
const ANALYTICS_BASE = import.meta.env.VITE_ANALYTICS_BASE_URL || "http://localhost:8000";

// Types
export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  totalSpent: number;
  lastVisit: string;
  recentPurchaseIds: string[];
}

export interface Product {
  id: string;
  name: string;
  category: string;
  costPrice: number;
  sellingPrice: number;
  stockQuantity: number;
  lowStockThreshold: number;
}

export interface SaleItem {
  productId: string;
  name?: string;
  quantity: number;
  priceAtSale?: number;
}

export interface Sale {
  id: string;
  customerId: string;
  items: SaleItem[];
  totalAmount: number;
  createdAt: string;
}

export interface CreateSaleRequest {
  customerId?: string;
  customerPhone: string;
  customerName: string;
  items: { productId: string; quantity: number }[];
}

export interface BestSellingProduct {
  productId: string;
  name: string;
  quantitySold: number;
  totalRevenue: number;
}

export interface RestockSuggestion {
  product: string;
  currentStock: number;
  predictedDemand: number;
  suggestedOrder: number;
}

export interface LoyalCustomer {
  customerId: string;
  name: string;
  phone: string;
  totalSpent: number;
  lastVisit: string;
}

export interface Recommendations {
  bestSellingProducts: BestSellingProduct[];
  restockSuggestions: RestockSuggestion[];
  loyalCustomers: LoyalCustomer[];
}

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...options?.headers },
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const contentType = res.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return res.json();
  }

  return (await res.text()) as T;
}

// Customer API
export const customerApi = {
  getAll: () => apiFetch<Customer[]>(`${API_BASE}/api/customer`),
  getById: (id: string) => apiFetch<Customer>(`${API_BASE}/api/customer/${id}`),
  getByPhone: (phone: string) => apiFetch<Customer>(`${API_BASE}/api/customer/phone/${phone}`),
  create: (data: Omit<Customer, "id" | "totalSpent" | "lastVisit" | "recentPurchaseIds">) =>
    apiFetch<string>(`${API_BASE}/api/customer`, { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Customer>) =>
    apiFetch<string>(`${API_BASE}/api/customer/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  sendMail: (id: string) =>
    apiFetch<string>(`${API_BASE}/api/customer/${id}/sendMail`, { method: "POST" }),
};

// Product API
export const productApi = {
  getAll: () => apiFetch<Product[]>(`${API_BASE}/api/product`),
  getLowStock: (threshold = 10) => apiFetch<Product[]>(`${API_BASE}/api/product/low-stock?threshold=${threshold}`),
  create: (data: Omit<Product, "id">) =>
    apiFetch<Product>(`${API_BASE}/api/product`, { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Product>) =>
    apiFetch<Product>(`${API_BASE}/api/product/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: string) =>
    apiFetch<string>(`${API_BASE}/api/product/${id}`, { method: "DELETE" }),
};

// Sales API
export const salesApi = {
  getAll: () => apiFetch<Sale[]>(`${API_BASE}/api/sales`),
  create: (data: CreateSaleRequest) =>
    apiFetch<Sale>(`${API_BASE}/api/sales`, { method: "POST", body: JSON.stringify(data) }),
  delete: (id: string) =>
    apiFetch<string>(`${API_BASE}/api/sales/${id}`, { method: "DELETE" }),
};

// Analytics API
export const analyticsApi = {
  bestProducts: () => apiFetch<BestSellingProduct[]>(`${ANALYTICS_BASE}/analytics/best-products`),
  restockSuggestions: () => apiFetch<RestockSuggestion[]>(`${ANALYTICS_BASE}/analytics/restock-suggestions`),
  loyalCustomers: () => apiFetch<LoyalCustomer[]>(`${ANALYTICS_BASE}/analytics/loyal-customers`),
  recommendations: () => apiFetch<Recommendations>(`${ANALYTICS_BASE}/analytics/recommendations`),
  trending: () => apiFetch<Record<string, any[]>>(`${ANALYTICS_BASE}/api/trending`),
};

// Search API
export interface SearchResults {
  products: Product[];
  customers: Customer[];
}

export const searchApi = {
  search: (query: string) => apiFetch<SearchResults>(`${API_BASE}/api/search?query=${query}`),
};
