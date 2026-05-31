import { useCallback } from "react";
import { useAuth } from "./useAuth";
import { API_BASE_URL } from "../config/api";
import { authFetch } from "../utils/authFetch";
// import { useTask } from "./useTask";

export const useUser = () => {

  const { setIsLoadingUser, setUser } = useAuth();
  // const { setAlertDetails, setOpenAlert } = useTask();

  const fetchUser = useCallback(async () => {
    setIsLoadingUser(true);
    try {
      const res = await authFetch(`${API_BASE_URL}/api/users/me`);

      if (!res.ok) {
        // const errorData = await res.json().catch(() => ({}));
        // if (res.status !== 401) {
        //   setAlertDetails({
        //     type: "error",
        //     message: errorData.error || "Failed to fetch user details.",
        //   });
        //   setOpenAlert(true)
        // }
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