
import { useCallback, useEffect, useState } from "react";
import {
  AUTH_SESSION_EVENT,
  clearAuthSession,
  getValidToken,
} from "./authSession";

export const useAuth = () => {
  const [token, setToken] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const syncAuth = () => {
      setToken(getValidToken());
      setIsReady(true);
    };

    syncAuth();

    window.addEventListener(AUTH_SESSION_EVENT, syncAuth);
    window.addEventListener("storage", syncAuth);

    // Detect expiry even if the user keeps the page open.
    const expiryCheck = window.setInterval(syncAuth, 30000);

    return () => {
      window.removeEventListener(AUTH_SESSION_EVENT, syncAuth);
      window.removeEventListener("storage", syncAuth);
      window.clearInterval(expiryCheck);
    };
  }, []);

  const logout = useCallback(() => {
    clearAuthSession();
    window.location.href = "/";
  }, []);

  return {
    isLoggedIn: Boolean(token),
    logout,
    token,
    isReady,
  };
};
