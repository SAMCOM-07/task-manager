import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useUser } from "../hooks/useUser";
import { useEffect } from "react";
import LoadingPage from "../pages/loading";

const RootRedirect = () => {
  const { isLoggedIn, isLoadingUser } = useAuth();
  const { fetchUser } = useUser();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  if (isLoadingUser) return <LoadingPage />;

  return isLoggedIn && !isLoadingUser
    ? <Navigate to="/dashboard" replace />
    : <Navigate to="/login" replace />;
};

export default RootRedirect;