import type { Customer, Product, Sale, BestSellingProduct, RestockSuggestion, LoyalCustomer } from "./api";

export const mockCustomers: Customer[] = [
  { id: "c1", name: "Rahul Sharma", phone: "9876543210", email: "rahul@example.com", totalSpent: 4200, lastVisit: "2026-03-10T10:00:00", recentPurchaseIds: ["s1", "s2"] },
  { id: "c2", name: "Priya Patel", phone: "9876543211", email: "priya@example.com", totalSpent: 3100, lastVisit: "2026-03-09T14:30:00", recentPurchaseIds: ["s3"] },
  { id: "c3", name: "Amit Kumar", phone: "9876543212", email: "amit@example.com", totalSpent: 2800, lastVisit: "2026-03-08T09:15:00", recentPurchaseIds: ["s4", "s5"] },
  { id: "c4", name: "Sneha Reddy", phone: "9876543213", email: "sneha@example.com", totalSpent: 1950, lastVisit: "2026-03-07T16:45:00", recentPurchaseIds: ["s6"] },
  { id: "c5", name: "Vikram Singh", phone: "9876543214", email: "vikram@example.com", totalSpent: 5600, lastVisit: "2026-03-11T11:20:00", recentPurchaseIds: ["s7", "s8", "s9"] },
];

export const mockProducts: Product[] = [
  { id: "p1", name: "Wireless Mouse", category: "Electronics", costPrice: 15, sellingPrice: 25, stockQuantity: 85, lowStockThreshold: 10 },
  { id: "p2", name: "USB-C Hub", category: "Electronics", costPrice: 22, sellingPrice: 45, stockQuantity: 8, lowStockThreshold: 10 },
  { id: "p3", name: "Milk (1L)", category: "Grocery", costPrice: 1.2, sellingPrice: 2.5, stockQuantity: 120, lowStockThreshold: 20 },
  { id: "p4", name: "Notebook A5", category: "Stationery", costPrice: 1.5, sellingPrice: 4, stockQuantity: 200, lowStockThreshold: 30 },
  { id: "p5", name: "Bluetooth Speaker", category: "Electronics", costPrice: 30, sellingPrice: 55, stockQuantity: 5, lowStockThreshold: 10 },
  { id: "p6", name: "Rice (5kg)", category: "Grocery", costPrice: 4, sellingPrice: 7.5, stockQuantity: 60, lowStockThreshold: 15 },
  { id: "p7", name: "Mechanical Keyboard", category: "Electronics", costPrice: 40, sellingPrice: 75, stockQuantity: 22, lowStockThreshold: 5 },
  { id: "p8", name: "Hand Sanitizer", category: "Health", costPrice: 2, sellingPrice: 5, stockQuantity: 3, lowStockThreshold: 10 },
];

export const mockSales: Sale[] = [
  { id: "s1", customerId: "c1", items: [{ productId: "p1", name: "Wireless Mouse", quantity: 2, priceAtSale: 25 }], totalAmount: 50, createdAt: "2026-03-10T10:00:00" },
  { id: "s2", customerId: "c1", items: [{ productId: "p3", name: "Milk (1L)", quantity: 5, priceAtSale: 2.5 }], totalAmount: 12.5, createdAt: "2026-03-10T10:05:00" },
  { id: "s3", customerId: "c2", items: [{ productId: "p7", name: "Mechanical Keyboard", quantity: 1, priceAtSale: 75 }], totalAmount: 75, createdAt: "2026-03-09T14:30:00" },
  { id: "s4", customerId: "c3", items: [{ productId: "p4", name: "Notebook A5", quantity: 10, priceAtSale: 4 }, { productId: "p6", name: "Rice (5kg)", quantity: 2, priceAtSale: 7.5 }], totalAmount: 55, createdAt: "2026-03-08T09:15:00" },
  { id: "s5", customerId: "c5", items: [{ productId: "p5", name: "Bluetooth Speaker", quantity: 1, priceAtSale: 55 }], totalAmount: 55, createdAt: "2026-03-11T11:20:00" },
];

export const mockBestProducts: BestSellingProduct[] = [
  { productId: "p3", name: "Milk (1L)", quantitySold: 150, totalRevenue: 375 },
  { productId: "p1", name: "Wireless Mouse", quantitySold: 89, totalRevenue: 2225 },
  { productId: "p4", name: "Notebook A5", quantitySold: 75, totalRevenue: 300 },
  { productId: "p6", name: "Rice (5kg)", quantitySold: 60, totalRevenue: 450 },
  { productId: "p7", name: "Mechanical Keyboard", quantitySold: 42, totalRevenue: 3150 },
];

export const mockRestockSuggestions: RestockSuggestion[] = [
  { product: "USB-C Hub", currentStock: 8, predictedDemand: 25, suggestedOrder: 17 },
  { product: "Bluetooth Speaker", currentStock: 5, predictedDemand: 18, suggestedOrder: 13 },
  { product: "Hand Sanitizer", currentStock: 3, predictedDemand: 30, suggestedOrder: 27 },
];

export const mockLoyalCustomers: LoyalCustomer[] = [
  { customerId: "c5", name: "Vikram Singh", phone: "9876543214", totalSpent: 5600, lastVisit: "2026-03-11" },
  { customerId: "c1", name: "Rahul Sharma", phone: "9876543210", totalSpent: 4200, lastVisit: "2026-03-10" },
  { customerId: "c2", name: "Priya Patel", phone: "9876543211", totalSpent: 3100, lastVisit: "2026-03-09" },
];
