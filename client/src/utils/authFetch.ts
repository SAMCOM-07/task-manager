import { API_BASE_URL } from "../config/api";

const TOKEN_KEY = "token";

const buildHeaders = (
  headers: HeadersInit | undefined,
  token: string | null,
) => {
  const nextHeaders = new Headers(headers);

  if (token) {
    nextHeaders.set("Authorization", `Bearer ${token}`);
  }

  return nextHeaders;
};

// Attempt to refresh the access token using the refresh token cookie
export const refreshAccessToken = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/refresh-token`, {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      localStorage.removeItem(TOKEN_KEY);
      return null;
    }

    const data = await response.json();
    const newToken = data?.token;

    if (typeof newToken !== "string" || !newToken) {
      localStorage.removeItem(TOKEN_KEY);
      return null;
    }

    localStorage.setItem(TOKEN_KEY, newToken);
    return newToken;
  } catch {
    localStorage.removeItem(TOKEN_KEY);
    return null;
  }
};

export const authFetch = async (
  input: RequestInfo | URL,
  init: RequestInit = {},
) => {
  const currentToken = localStorage.getItem(TOKEN_KEY);
  const response = await fetch(input, {
    ...init,
    headers: buildHeaders(init.headers, currentToken),
  });

  if (response.status !== 401) {
    return response;
  }

  const refreshedToken = await refreshAccessToken();

  if (!refreshedToken) {
    return response;
  }

  return fetch(input, {
    ...init,
    headers: buildHeaders(init.headers, refreshedToken),
  });
};
