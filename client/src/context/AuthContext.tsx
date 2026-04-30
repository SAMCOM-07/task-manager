import { useState, type ReactNode } from "react";
import type { User } from "../types/types";
import { AuthContext } from "./CreateContext";


export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoadingUser,
        setIsLoadingUser,
        isLoggedIn: !!user,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};