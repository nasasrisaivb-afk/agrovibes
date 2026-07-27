import { useQueryClient } from "@tanstack/react-query";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { sessionStore } from "../lib/session";

// Admin employee auth — a completely separate path from consumer phone-OTP.
interface AdminAuthContextValue {
  adminToken: string | null;
  adminName: string;
  isAdminAuthenticated: boolean;
  adminLogin: (token: string, name: string) => void;
  adminLogout: () => void;
  /** Called by admin hooks when the server rejects the session. */
  invalidateAdminSession: () => void;
}

const ADMIN_NAME_KEY = "cropvibe-admin-name";

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [adminToken, setAdminToken] = useState<string | null>(() =>
    sessionStore.getAdminToken(),
  );
  const [adminName, setAdminName] = useState<string>(() => {
    try {
      return localStorage.getItem(ADMIN_NAME_KEY) ?? "Admin";
    } catch {
      return "Admin";
    }
  });
  const queryClient = useQueryClient();

  const adminLogin = useCallback(
    (token: string, name: string) => {
      sessionStore.setAdminToken(token);
      try {
        localStorage.setItem(ADMIN_NAME_KEY, name);
      } catch {
        // ignore
      }
      setAdminToken(token);
      setAdminName(name);
      queryClient.invalidateQueries({ queryKey: ["admin"] });
    },
    [queryClient],
  );

  const adminLogout = useCallback(() => {
    sessionStore.setAdminToken(null);
    setAdminToken(null);
    queryClient.removeQueries({ queryKey: ["admin"] });
  }, [queryClient]);

  const value = useMemo<AdminAuthContextValue>(
    () => ({
      adminToken,
      adminName,
      isAdminAuthenticated: !!adminToken,
      adminLogin,
      adminLogout,
      invalidateAdminSession: adminLogout,
    }),
    [adminToken, adminName, adminLogin, adminLogout],
  );

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth(): AdminAuthContextValue {
  const ctx = useContext(AdminAuthContext);
  if (!ctx)
    throw new Error("useAdminAuth must be used inside AdminAuthProvider");
  return ctx;
}
