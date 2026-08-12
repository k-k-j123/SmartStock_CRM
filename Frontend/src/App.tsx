import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppLayout from "@/components/AppLayout";
import { AuthProvider, useAuth } from "@/lib/auth";
import DashboardPage from "@/pages/DashboardPage";
import ProductsPage from "@/pages/ProductsPage";
import CustomersPage from "@/pages/CustomersPage";
import CustomerDetailPage from "@/pages/CustomerDetailPage";
import SalesPage from "@/pages/SalesPage";
import AnalyticsPage from "@/pages/AnalyticsPage";
import TrendingPage from "@/pages/TrendingPage";
import SettingsPage from "@/pages/SettingsPage";
import LoginPage from "@/pages/LoginPage";
import LandingPage from "@/pages/LandingPage";
import CustomerLoginPage from "@/pages/CustomerLoginPage";
import CustomerSalesPage from "@/pages/CustomerSalesPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function RequireAuth({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

function RequireCustomerAuth({ children }: { children: JSX.Element }) {
  const { isCustomerAuthenticated } = useAuth();
  const location = useLocation();

  if (!isCustomerAuthenticated) {
    return <Navigate to="/customer-login" replace state={{ from: location }} />;
  }

  return children;
}

function HomeRoute() {
  const { isAuthenticated, isCustomerAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <AdminRoutes />;
  }

  if (isCustomerAuthenticated) {
    return <Navigate to="/customer/sales" replace />;
  }

  return <LandingPage />;
}

function AdminRoutes() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/customers" element={<CustomersPage />} />
        <Route path="/customers/:id" element={<CustomerDetailPage />} />
        <Route path="/sales" element={<SalesPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/trending" element={<TrendingPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppLayout>
  );
}

const App = () => {
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<HomeRoute />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/customer-login" element={<CustomerLoginPage />} />
              <Route
                path="/customer/sales"
                element={
                  <RequireCustomerAuth>
                    <CustomerSalesPage />
                  </RequireCustomerAuth>
                }
              />
              <Route
                path="/*"
                element={
                  <RequireAuth>
                    <AdminRoutes />
                  </RequireAuth>
                }
              />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

