import { createContext, useContext, useEffect, useState } from "react";

export type UserRole =
  | "farmer"
  | "buyer"
  | "educator"
  | "machinery"
  | "service";

export type UserRoleSimple = "Buyer" | "Seller" | "Expert";

export interface LanguageOption {
  code: string;
  label: string;
  native: string;
}

export interface LocationState {
  district: string;
  village: string;
}

export interface WalletState {
  balance: number;
  escrow: number;
  earnings: number;
}

export interface RoleState {
  role: UserRole;
  activeRole: UserRoleSimple;
  language: LanguageOption;
  location: LocationState;
  wallet: WalletState;
  notificationCount: number;
  setRole: (role: UserRole) => void;
  setActiveRole: (role: UserRoleSimple) => void;
  setLanguage: (lang: LanguageOption) => void;
  setLocation: (loc: LocationState) => void;
  setNotificationCount: (count: number) => void;
}

export const LANGUAGES: LanguageOption[] = [
  { code: "EN", label: "English", native: "English" },
  { code: "HI", label: "Hindi", native: "हिंदी" },
  { code: "TA", label: "Tamil", native: "தமிழ்" },
  { code: "TE", label: "Telugu", native: "తెలుగు" },
  { code: "KA", label: "Kannada", native: "ಕನ್ನಡ" },
  { code: "ML", label: "Malayalam", native: "മലയാളം" },
  { code: "BN", label: "Bengali", native: "বাংলা" },
  { code: "MR", label: "Marathi", native: "मराठी" },
  { code: "PA", label: "Punjabi", native: "ਪੰਜਾਬੀ" },
];

export const ROLE_CONFIG: Record<
  UserRole,
  {
    label: string;
    color: string;
    bgClass: string;
    textClass: string;
    borderClass: string;
  }
> = {
  farmer: {
    label: "Farmer",
    color: "var(--role-farmer)",
    bgClass: "bg-[oklch(var(--role-farmer)/0.12)]",
    textClass: "text-[oklch(var(--role-farmer))]",
    borderClass: "border-[oklch(var(--role-farmer)/0.3)]",
  },
  buyer: {
    label: "Buyer",
    color: "var(--role-buyer)",
    bgClass: "bg-[oklch(var(--role-buyer)/0.12)]",
    textClass: "text-[oklch(var(--role-buyer))]",
    borderClass: "border-[oklch(var(--role-buyer)/0.3)]",
  },
  educator: {
    label: "Educator",
    color: "var(--role-educator)",
    bgClass: "bg-[oklch(var(--role-educator)/0.12)]",
    textClass: "text-[oklch(var(--role-educator))]",
    borderClass: "border-[oklch(var(--role-educator)/0.3)]",
  },
  machinery: {
    label: "Machinery",
    color: "var(--role-machinery)",
    bgClass: "bg-[oklch(var(--role-machinery)/0.12)]",
    textClass: "text-[oklch(var(--role-machinery))]",
    borderClass: "border-[oklch(var(--role-machinery)/0.3)]",
  },
  service: {
    label: "Service",
    color: "var(--role-service)",
    bgClass: "bg-[oklch(var(--role-service)/0.12)]",
    textClass: "text-[oklch(var(--role-service))]",
    borderClass: "border-[oklch(var(--role-service)/0.3)]",
  },
};

const DEFAULT_WALLET: WalletState = {
  balance: 25480.5,
  escrow: 4200.0,
  earnings: 8750.0,
};

const RoleContext = createContext<RoleState | null>(null);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<UserRole>(() => {
    return (localStorage.getItem("agri-role") as UserRole) ?? "farmer";
  });

  const [activeRole, setActiveRoleState] = useState<UserRoleSimple>(() => {
    return (
      (localStorage.getItem("agri-active-role") as UserRoleSimple) ?? "Buyer"
    );
  });

  const [language, setLanguageState] = useState<LanguageOption>(() => {
    const saved = localStorage.getItem("agri-language");
    return LANGUAGES.find((l) => l.code === saved) ?? LANGUAGES[0];
  });

  const [location, setLocationState] = useState<LocationState>({
    district: "Mumbai",
    village: "Dharavi",
  });

  const [wallet] = useState<WalletState>(DEFAULT_WALLET);
  const [notificationCount, setNotificationCount] = useState(3);

  useEffect(() => {
    localStorage.setItem("agri-role", role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem("agri-active-role", activeRole);
  }, [activeRole]);

  useEffect(() => {
    localStorage.setItem("agri-language", language.code);
  }, [language]);

  const setRole = (newRole: UserRole) => setRoleState(newRole);
  const setActiveRole = (newRole: UserRoleSimple) =>
    setActiveRoleState(newRole);
  const setLanguage = (lang: LanguageOption) => setLanguageState(lang);
  const setLocation = (loc: LocationState) => setLocationState(loc);

  return (
    <RoleContext.Provider
      value={{
        role,
        activeRole,
        language,
        location,
        wallet,
        notificationCount,
        setRole,
        setActiveRole,
        setLanguage,
        setLocation,
        setNotificationCount,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
}

export function useRoleContext(): RoleState {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRoleContext must be used within RoleProvider");
  return ctx;
}
