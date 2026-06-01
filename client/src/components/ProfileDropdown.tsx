import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { User, Settings, LogOut } from "lucide-react";
import { useTask } from "../hooks/useTask";
import { API_BASE_URL } from "../config/api";
// import { API_BASE_URL } from "../config/api";

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const { setOpenAlert, setAlertDetails } = useTask();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // handle logout

  const handleLogout = async () => {

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
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}

      {/* <div className="w-10 h-10 rounded-full font-medium  text-xl bg-linear-to-r from-primary to-purple-600 text-white flex items-center justify-center">
              {user?.username?.charAt(0) || "U"}
            </div> */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-8 h-8 rounded-full text-xl text-white font-medium bg-linear-to-r from-primary to-purple-700 flex items-center justify-center hover:bg-primary/30 transition-colors"
        title={user?.username || "Profile"}
      >
        {user?.full_name ? user.full_name.charAt(0).toUpperCase() : <User size={16} className="text-primary" />}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-42 bg-card border border-border rounded-lg shadow-lg overflow-hidden">
          {/* Header with username */}
          <div className="px-4 py-3 border-b border-border bg-background/50">
            <p className="text-sm text-muted-foreground">Logged in as</p>
            <p className="text-sm font-semibold text-foreground truncate">
              {user?.full_name || user?.username || "User"}
            </p>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {/* Profile Link */}
            <button
              onClick={() => {
                navigate("/profile");
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-2 hover:bg-primary/10 transition-colors text-foreground text-sm"
            >
              <User size={16} className="text-primary" />
              View Profile
            </button>

            {/* Settings Link */}
            <button
              onClick={() => {
                navigate("/settings");
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-2 hover:bg-primary/10 transition-colors text-foreground text-sm"
            >
              <Settings size={16} className="text-primary" />
              Settings
            </button>

            {/* Divider */}
            <div className="my-2 border-t border-border"></div>

            {/* Logout Button */}
            <button
              onClick={() => {
                setIsOpen(false);
                handleLogout();
              }}
              className="w-full flex items-center gap-3 px-4 py-2 hover:bg-destructive/10 transition-colors text-destructive text-sm"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
