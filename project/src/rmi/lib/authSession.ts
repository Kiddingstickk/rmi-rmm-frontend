
const AUTH_CHANGE_EVENT = "rmi-auth-change";

const notifyAuthChange = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
  }
};

export const getValidToken = (): string | null => {
  if (typeof window === "undefined") return null;

  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payloadPart = token.split(".")[1];
    if (!payloadPart) throw new Error("Invalid JWT");

    const base64 = payloadPart
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const paddedBase64 = base64.padEnd(
      Math.ceil(base64.length / 4) * 4,
      "="
    );

    const payload = JSON.parse(atob(paddedBase64));

    if (
      typeof payload.exp !== "number" ||
      payload.exp * 1000 <= Date.now()
    ) {
      throw new Error("JWT expired or missing expiry");
    }

    return token;
  } catch {
    clearAuthSession();
    return null;
  }
};

export const setAuthSession = (
  token: string,
  userId: string
): void => {
  if (typeof window === "undefined") return;

  localStorage.setItem("token", token);
  localStorage.setItem("userId", userId);

  notifyAuthChange();
};

export const clearAuthSession = (): void => {
  if (typeof window === "undefined") return;

  const hadSession =
    localStorage.getItem("token") !== null ||
    localStorage.getItem("userId") !== null;

  localStorage.removeItem("token");
  localStorage.removeItem("userId");

  if (hadSession) notifyAuthChange();
};

export const AUTH_SESSION_EVENT = AUTH_CHANGE_EVENT;
