import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

type AuthUser = {
  id: string | null;
  email: string | null;
  name: string | null;
};

type AuthState = {
  user: AuthUser | null;
  token: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
};

type SessionPayload = {
  user: AuthUser | null;
  token: string | null;
  refreshToken?: string | null;
  expiresAt?: number | null;
};

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (payload: SessionPayload, options?: { redirectTo?: string }) => void;
  logout: (options?: { redirectTo?: string; silent?: boolean }) => Promise<void>;
};

const STORAGE_KEY = "auth_state";
const defaultState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  expiresAt: null,
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const parseOAuthHash = (hash: string) => {
  const raw = hash.startsWith("#") ? hash.slice(1) : hash;
  const params = new URLSearchParams(raw);
  const accessToken = params.get("access_token");
  if (!accessToken) return null;

  const refreshToken = params.get("refresh_token");
  const expiresIn = params.get("expires_in");
  const providerToken = params.get("provider_token");
  const tokenType = params.get("token_type");

  return {
    accessToken,
    refreshToken,
    expiresIn: expiresIn ? Number(expiresIn) : null,
    providerToken,
    tokenType,
  };
};

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [state, setState] = useState<AuthState>(defaultState);
  const [loading, setLoading] = useState(true);
  const hydratedRef = useRef(false);
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL //|| "http://localhost:3001";

  const persistState = useCallback((next: AuthState) => {
    setState(next);
    try {
      if (typeof window !== "undefined") {
        if (next.token) {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } else {
          window.localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch (err) {
      console.error("Failed to persist auth state", err);
    }
  }, []);

  useEffect(() => {
    if (hydratedRef.current) return;
    hydratedRef.current = true;

    if (typeof window === "undefined") {
      setLoading(false);
      return;
    }

    try {
      const cached = window.localStorage.getItem(STORAGE_KEY);
      if (cached) {
        const parsed: Partial<AuthState> = JSON.parse(cached);
        persistState({
          user: parsed.user ?? null,
          token: parsed.token ?? null,
          refreshToken: parsed.refreshToken ?? null,
          expiresAt: parsed.expiresAt ?? null,
        });
      }
    } catch (err) {
      console.error("Failed to restore auth state", err);
      persistState(defaultState);
    } finally {
      setLoading(false);
    }
  }, [persistState]);

  const setSession = useCallback(
    (payload: SessionPayload, options?: { redirectTo?: string }) => {
      const nextState: AuthState = {
        user: payload.user ?? null,
        token: payload.token ?? null,
        refreshToken: payload.refreshToken ?? null,
        expiresAt: payload.expiresAt ?? null,
      };

      persistState(nextState);

      if (options?.redirectTo) {
        navigate(options.redirectTo, { replace: true });
      }
    },
    [navigate, persistState],
  );

  const login = useCallback<AuthContextValue["login"]>((payload, options) => {
    setSession(payload, options);
  }, [setSession]);

  const logout = useCallback<AuthContextValue["logout"]>(
    async (options) => {
      const redirectTo = options?.redirectTo ?? "/login";
      const silent = options?.silent ?? false;

      try {
        await fetch(`${apiBaseUrl}/api/auth/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(state.token ? { Authorization: `Bearer ${state.token}` } : {}),
          },
        });

        if (!silent) {
          toast({
            title: "Signed out",
            description: "You have been logged out successfully.",
          });
        }
      } catch (err) {
        console.error("Logout failed", err);
        if (!silent) {
          toast({
            title: "Logout failed",
            description: "We could not reach the server. Please try again.",
            variant: "destructive",
          });
        }
      } finally {
        persistState(defaultState);
        navigate(redirectTo, { replace: true });
      }
    },
    [navigate, persistState, state.token, toast],
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (loading) return;

    const hash = window.location.hash;
    if (!hash || !hash.includes("access_token")) return;

    const oauthData = parseOAuthHash(hash);
    const cleanupHash = () => {
      window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
    };

    if (!oauthData) {
      cleanupHash();
      return;
    }

    const finalizeOAuth = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/auth/session`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            access_token: oauthData.accessToken,
            refresh_token: oauthData.refreshToken,
            expires_in: oauthData.expiresIn,
            token_type: oauthData.tokenType,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          const expiresAtSeconds = typeof data.expires_at === "number" ? data.expires_at : null;
          const expiresAt = expiresAtSeconds
            ? expiresAtSeconds * 1000
            : oauthData.expiresIn
              ? Date.now() + oauthData.expiresIn * 1000
              : null;
          setSession(
            {
              user: data.user ?? null,
              token: data.token ?? oauthData.accessToken,
              refreshToken: data.refresh_token ?? oauthData.refreshToken ?? null,
              expiresAt,
            },
            { redirectTo: "/chat" },
          );

          toast({
            title: "Login Successful",
            description: "Welcome back! Redirecting to chat...",
          });
        } else {
          toast({
            title: "Google login failed",
            description: data.error || "We could not complete Google login.",
            variant: "destructive",
          });
        }
      } catch (err) {
        console.error("Failed to finalize OAuth session", err);
        toast({
          title: "Google login failed",
          description: "An unexpected error occurred while finalizing login.",
          variant: "destructive",
        });
      } finally {
        cleanupHash();
      }
    };

    finalizeOAuth();
  }, [apiBaseUrl, loading, setSession, toast]);

  useEffect(() => {
    if (loading) return;
    if (!state.token) return;
    if (!state.expiresAt) return;

    const remainingMs = state.expiresAt - Date.now();
    if (remainingMs <= 0) {
      logout({ silent: true });
      return;
    }

    const timer = window.setTimeout(() => {
      logout({ silent: true });
    }, remainingMs);

    return () => window.clearTimeout(timer);
  }, [loading, logout, state.expiresAt, state.token]);

  const value = useMemo<AuthContextValue>(() => ({
    user: state.user,
    token: state.token,
    refreshToken: state.refreshToken,
    expiresAt: state.expiresAt,
    loading,
    isAuthenticated: Boolean(state.token),
    login,
    logout,
  }), [loading, login, logout, state.expiresAt, state.refreshToken, state.token, state.user]);

  const showLoader = loading && !state.token;

  return (
    <AuthContext.Provider value={value}>
      {showLoader ? (
        <div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground">
          Restoring session...
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
};

