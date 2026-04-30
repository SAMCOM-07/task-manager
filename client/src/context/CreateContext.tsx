import { createContext } from "react";
import type { AuthContextType, TaskContextType } from "../types/types";

export const TaskContext = createContext<TaskContextType | null>(null);

export const AuthContext = createContext<AuthContextType | null>(null);