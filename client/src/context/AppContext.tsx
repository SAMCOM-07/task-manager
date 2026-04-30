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

  // tasks fetch handler

  // const fetchTasks = useCallback(async () => {
  //   try {
  //     setLoadingTasks(true);

  //     // Read query parameters directly from URL
  //     const urlParams = new URLSearchParams(window.location.search);
  //     const search = urlParams.get("search");
  //     const filter = urlParams.get("filter");

  //     // Build API URL with query parameters
  //     const url = new URL("http://localhost:5000/api/tasks/read");

  //     if (search) {
  //       url.searchParams.append("search", search);
  //     }

  //     if (filter) {
  //       url.searchParams.append("filter", filter);
  //     }

  //     const res = await fetch(url.toString(), {
  //       credentials: "include",
  //     });
  //     if (res.ok) {
  //       const data = await res.json();
  //       setTasks(data.data);
  //       // console.log(data)
  //     } else {
  //       console.error("Error fetching tasks:", res.status, res.statusText);
  //     }
  //   } catch (err) {
  //     console.error("Network error fetching tasks:", err);
  //   } finally {
  //     setLoadingTasks(false);
  //   }
  // }, []);


  // const fetchTasks = useCallback(async () => {
  //   try {
  //     setLoadingTasks(true);

  //     const search = searchParams.get("search");
  //     const filter = searchParams.get("filter");

  //     const url = new URL("http://localhost:5000/api/tasks/read");

  //     if (filter) url.searchParams.set("filter", filter);
  //     if (search) url.searchParams.set("search", search);

  //     const res = await fetch(url.toString(), {
  //       credentials: "include",
  //     });

  //     if (!res.ok) {
  //       throw new Error("Failed to fetch tasks");
  //     }

  //     const data = await res.json();
  //     setTasks(data.data);
  //   } catch (err) {
  //     console.error("Error fetching tasks:", err);
  //   } finally {
  //     setLoadingTasks(false);
  //   }
  // }, [searchParams]);

  // // fecth tasks on mount, when form is closed, and when URL changes
  // useEffect(() => {
  //   fetchTasks();
  // }, [openFormOverlay, fetchTasks]);

  // Listen for URL changes (manual URL input)
  // useEffect(() => {
  //   fetchTasks();
  // }, [fetchTasks, filterValue, searchValue]);

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
