import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import AppLayout from "../App";
import { useEffect } from "react";
import { useUser } from "../hooks/useUser";
import LoadingPage from "../pages/loading";

const ProtectedLayout = () => {
  const { isLoggedIn, isLoadingUser } = useAuth();
  const { fetchUser } = useUser();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  if (isLoadingUser) return <LoadingPage />;

  if (!isLoggedIn && !isLoadingUser) {
    return <Navigate to="/login" replace />;
  }

  return <AppLayout />;
};

export default ProtectedLayout;