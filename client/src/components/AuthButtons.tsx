import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useTask } from "../hooks/useTask";
import { LogOut } from "lucide-react";
import { API_BASE_URL } from "../config/api";

// logout button
export const LogoutButton = () => {
  const { setUser } = useAuth();
  const { setOpenAlert, setAlertDetails } = useTask();
  const [loadingLogout, setLoadingLogout] = useState(false);

  const handleLogout = async () => {
    setLoadingLogout(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      // remove access token locally regardless of server response
      localStorage.removeItem("token");

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        setOpenAlert(true);
        setAlertDetails({
          type: "error",
          message: errorData.error || "An error occurred during logout. Please try again.",
        });
        return;
      }

      setUser(null);
      setOpenAlert(true);
      setAlertDetails({
        type: "success",
        message: "Logout successful!",
      });
    } catch (err) {
      console.error("Error logging out:", err);
    } finally {
      setLoadingLogout(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loadingLogout}
      className="flex items-center gap-2 px-4 py-2 bg-destructive/10 hover:bg-destructive/20 text-destructive border border-destructive/20 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed mx-auto"
    >
      <LogOut size={18} />
      {loadingLogout ? "Logging out..." : "Logout"}
    </button>
  );
};