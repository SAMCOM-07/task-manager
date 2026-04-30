import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useUser } from "../hooks/useUser";
import { useEffect } from "react";

const RootRedirect = () => {
  const { isLoggedIn, isLoadingUser } = useAuth();
  const { fetchUser } = useUser();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  if (isLoadingUser) return null;

  return isLoggedIn
    ? <Navigate to="/dashboard" replace />
    : <Navigate to="/login" replace />;
};

export default RootRedirect;