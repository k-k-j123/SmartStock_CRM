import { createContext, ReactNode, useContext, useMemo, useState } from "react";

const AUTH_STORAGE_KEY = "smartstock_admin_auth";
const CUSTOMER_AUTH_STORAGE_KEY = "smartstock_customer_auth";
const ADMIN_EMAIL = "admin@smartstock.com";
const ADMIN_PASSWORD = "admin123";

export type CustomerSession = {
  id: string;
  name: string;
  phone: string;
};

type AuthContextValue = {
  isAuthenticated: boolean;
  adminEmail: string;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  customer: CustomerSession | null;
  isCustomerAuthenticated: boolean;
  loginCustomer: (customer: CustomerSession) => void;
  logoutCustomer: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [adminEmail, setAdminEmail] = useState(() => localStorage.getItem(AUTH_STORAGE_KEY) ?? "");
  const [customer, setCustomer] = useState<CustomerSession | null>(() => {
    const storedCustomer = localStorage.getItem(CUSTOMER_AUTH_STORAGE_KEY);

    if (!storedCustomer) {
      return null;
    }

    try {
      return JSON.parse(storedCustomer) as CustomerSession;
    } catch {
      localStorage.removeItem(CUSTOMER_AUTH_STORAGE_KEY);
      return null;
    }
  });

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated: Boolean(adminEmail),
      adminEmail,
      login: (email, password) => {
        const normalizedEmail = email.trim().toLowerCase();

        if (normalizedEmail !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
          return false;
        }

        localStorage.setItem(AUTH_STORAGE_KEY, normalizedEmail);
        setAdminEmail(normalizedEmail);
        return true;
      },
      logout: () => {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        setAdminEmail("");
      },
      customer,
      isCustomerAuthenticated: Boolean(customer),
      loginCustomer: (customerSession) => {
        localStorage.setItem(CUSTOMER_AUTH_STORAGE_KEY, JSON.stringify(customerSession));
        setCustomer(customerSession);
      },
      logoutCustomer: () => {
        localStorage.removeItem(CUSTOMER_AUTH_STORAGE_KEY);
        setCustomer(null);
      },
    }),
    [adminEmail, customer],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}

export const demoAdminCredentials = {
  email: ADMIN_EMAIL,
  password: ADMIN_PASSWORD,
};
