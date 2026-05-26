import { createContext, useContext, useEffect, useState } from "react";
import type { AccessibilityState } from "../types";

const AccessibilityContext = createContext<AccessibilityState | null>(null);

export function AccessibilityProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [fontSizeClass, setFontSizeClassState] = useState<
    AccessibilityState["fontSizeClass"]
  >(() => {
    const saved = localStorage.getItem("agri-font-size");
    return (saved as AccessibilityState["fontSizeClass"]) ?? "text-base";
  });

  const [isHighContrast, setIsHighContrastState] = useState<boolean>(() => {
    return localStorage.getItem("agri-high-contrast") === "true";
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("text-sm", "text-base", "text-lg", "text-xl");
    root.classList.add(fontSizeClass);
    if (isHighContrast) {
      root.classList.add("high-contrast");
    } else {
      root.classList.remove("high-contrast");
    }
  }, [fontSizeClass, isHighContrast]);

  const setFontSize = (size: AccessibilityState["fontSizeClass"]) => {
    setFontSizeClassState(size);
    localStorage.setItem("agri-font-size", size);
  };

  const setHighContrast = (val: boolean) => {
    setIsHighContrastState(val);
    localStorage.setItem("agri-high-contrast", String(val));
  };

  return (
    <AccessibilityContext.Provider
      value={{ fontSizeClass, isHighContrast, setFontSize, setHighContrast }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibilityContext() {
  const ctx = useContext(AccessibilityContext);
  if (!ctx)
    throw new Error(
      "useAccessibilityContext must be used within AccessibilityProvider",
    );
  return ctx;
}
