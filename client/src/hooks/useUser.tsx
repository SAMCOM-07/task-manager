import { useCallback } from "react";
import { useAuth } from "./useAuth";
import { API_BASE_URL } from "../config/api";

export const useUser = () => {

  const { setIsLoadingUser, setUser } = useAuth();

  const fetchUser = useCallback(async () => {
    setIsLoadingUser(true);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/me`, {
        // credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        setUser(null);
      } else {
        const data = await res.json();
        setUser(data.user);
      }
    } catch (err) {
      console.error("Error fetching user:", err);
      setUser(null);
    } finally {
      setIsLoadingUser(false);
    }
  }, [setIsLoadingUser, setUser]);

  return { fetchUser };

}