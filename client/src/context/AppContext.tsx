import { useEffect, useState, type ReactNode } from "react"
import { TaskContext } from "./CreateContext";
import type { TaskType } from "../types/types";


export const TaskProvider = ({ children }: { children: ReactNode }) => {

  const [showSidebar, setShowSidebar] = useState(false);

  const [openFormOverlay, setOpenFormOverlay] = useState(false)

  const [tasks, setTasks] = useState<TaskType[]>([])
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [editDetails, setEditDetails] = useState<TaskType | null>(null)
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskType | null>(null);
  const [openAlert, setOpenAlert] = useState(false);
  const [alertDetails, setAlertDetails] = useState({ type: "", message: "" });

  // Theme state
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    return (localStorage.getItem("theme") || "light") as "light" | "dark";
  });

  // manage theme changes
  useEffect(() => {
    document.documentElement.className = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <TaskContext.Provider
      value={{
        openFormOverlay,
        setOpenFormOverlay,
        tasks,
        setTasks,
        editDetails,
        setEditDetails,
        openDetailsModal,
        setOpenDetailsModal,
        selectedTask,
        setSelectedTask,
        openAlert,
        setOpenAlert,
        alertDetails,
        setAlertDetails,
        theme,
        setTheme,
        showSidebar,
        setShowSidebar,
        loadingTasks,
        setLoadingTasks,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}
