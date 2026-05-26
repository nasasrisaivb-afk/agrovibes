import { createContext, useCallback, useContext, useState } from "react";
import type { TrustContextState } from "../types";

const TrustContext = createContext<TrustContextState | null>(null);

export function TrustProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const triggerTrust = useCallback(() => setIsOpen(true), []);
  const closeTrust = useCallback(() => setIsOpen(false), []);

  return (
    <TrustContext.Provider value={{ isOpen, triggerTrust, closeTrust }}>
      {children}
    </TrustContext.Provider>
  );
}

export function useTrustContext() {
  const ctx = useContext(TrustContext);
  if (!ctx)
    throw new Error("useTrustContext must be used within TrustProvider");
  return ctx;
}
