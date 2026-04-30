// task filter type
export type FilterType =
  | ""
  | "completed"
  | "in_progress"
  | "todo"
  | "overdue"
  | "low"
  | "medium"
  | "high";

// task type definition
export interface TaskType {
  id?: string;
  title: string;
  description: string;
  due_date: Date;
  priority: "low" | "medium" | "high";
  status: "todo" | "in_progress" | "completed";
  category: "work" | "education" | "personal" | "career";
}

// task context type
export type TaskContextType = {
  openFormOverlay: boolean;
  setTasks: React.Dispatch<React.SetStateAction<TaskType[]>>;
  tasks: TaskType[];
  setOpenFormOverlay: React.Dispatch<React.SetStateAction<boolean>>;
  editDetails: TaskType | null;
  setEditDetails: React.Dispatch<React.SetStateAction<TaskType | null>>;
  openDetailsModal: boolean;
  setOpenDetailsModal: React.Dispatch<React.SetStateAction<boolean>>;
  selectedTask: TaskType | null;
  setSelectedTask: React.Dispatch<React.SetStateAction<TaskType | null>>;
  openAlert: boolean;
  setOpenAlert: React.Dispatch<React.SetStateAction<boolean>>;
  alertDetails: { type: string; message: string };
  setAlertDetails: React.Dispatch<
    React.SetStateAction<{ type: string; message: string }>
  >;
  theme: "light" | "dark";
  setTheme: React.Dispatch<React.SetStateAction<"light" | "dark">>;
  showSidebar: boolean;
  setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>;
  loadingTasks: boolean;
  setLoadingTasks: React.Dispatch<React.SetStateAction<boolean>>;
};

// user type definition
export type User = {
  id: string;
  username: string;
  email: string;
};

// auth context type
export type AuthContextType = {
  user: User | null;
  isLoadingUser: boolean;
  setIsLoadingUser: React.Dispatch<React.SetStateAction<boolean>>;
  isLoggedIn: boolean;
  setUser: (user: User | null) => void;
};
