import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { type MeView, type User, UserRole } from "../backend";
import { useBackendActor } from "../lib/actor";
import { BackendError } from "../lib/errors";
import { sessionStore } from "../lib/session";

interface AuthContextValue {
  token: string | null;
  me: MeView | undefined;
  user: User | undefined;
  isLoading: boolean;
  isAuthenticated: boolean;
  isBuyer: boolean;
  isSeller: boolean;
  /** Signed in but has not completed role onboarding yet. */
  needsOnboarding: boolean;
  login: (token: string) => void;
  logout: () => Promise<void>;
  refetchMe: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() =>
    sessionStore.getConsumerToken(),
  );
  const { actor, actorReady } = useBackendActor();
  const queryClient = useQueryClient();

  const meQuery = useQuery({
    queryKey: ["me", token],
    enabled: actorReady && !!token,
    retry: false,
    queryFn: async (): Promise<MeView | null> => {
      if (!actor || !token) return null;
      const result = await actor.getMe(token);
      if (result.__kind__ === "err") {
        // Expired/invalid session → treat as signed out, not as an error.
        if (result.err.__kind__ === "Unauthorized") return null;
        throw new BackendError(result.err);
      }
      return result.ok;
    },
  });

  // Session expiry detected server-side: drop the local token.
  useEffect(() => {
    if (token && meQuery.data === null && !meQuery.isPending) {
      sessionStore.setConsumerToken(null);
      setToken(null);
    }
  }, [token, meQuery.data, meQuery.isPending]);

  const login = useCallback(
    (newToken: string) => {
      sessionStore.setConsumerToken(newToken);
      setToken(newToken);
      queryClient.invalidateQueries();
    },
    [queryClient],
  );

  const logout = useCallback(async () => {
    if (actor && token) {
      try {
        await actor.logout(token);
      } catch {
        // Best-effort server-side invalidation; local sign-out proceeds.
      }
    }
    sessionStore.setConsumerToken(null);
    setToken(null);
    queryClient.clear();
  }, [actor, token, queryClient]);

  const me = meQuery.data ?? undefined;
  const user = me?.user;

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      me,
      user,
      isLoading: !!token && (meQuery.isPending || !actorReady),
      isAuthenticated: !!token && !!user,
      isBuyer: !!user?.roles.includes(UserRole.BUYER),
      isSeller: !!user?.roles.includes(UserRole.SELLER),
      needsOnboarding: !!user && user.roles.length === 0,
      login,
      logout,
      refetchMe: () => meQuery.refetch(),
    }),
    [
      token,
      me,
      user,
      meQuery.isPending,
      meQuery.refetch,
      actorReady,
      login,
      logout,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
