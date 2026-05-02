import { Trash2 } from "lucide-react";
import { useTask } from "../hooks/useTask";
import { useState } from "react";
import { useTaskFetch } from "../hooks/useTaskFetch";
import { API_BASE_URL } from "../config/api";


export const DeleteButton = ({ id }: { id: string | undefined }) => {

  const fetchTasks = useTaskFetch();

  const { setAlertDetails, setOpenAlert } = useTask();
  const [loadingDelete, setLoadingTasks] = useState(false);

  const handleDelete = async () => {

    if (!id) {
      setAlertDetails({ type: "error", message: "Task ID is missing. Cannot delete task." });
      setOpenAlert(true);
      return;
    }

    try {
      setLoadingTasks(true);
      const res = await fetch(`${API_BASE_URL}/api/tasks/delete/${id}`, {
        method: "DELETE",
        // credentials: "include",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!res.ok) {
        setAlertDetails({ type: "error", message: "Failed to delete task. Please try again." });
        setOpenAlert(true);
        // throw new Error("Failed to delete task");
      }

      setAlertDetails({ type: "success", message: "Task deleted successfully." });
      setOpenAlert(true);
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    } finally {
      setLoadingTasks(false);
    }
  };

  return (
    <>
      {loadingDelete ? <div className="loading-spinner"></div> :
        <button
          onClick={(e) => {
            e.stopPropagation()
            handleDelete()
          }}
          className="hover-scale text-destructive" > <Trash2 size={20} />
        </button >}
    </>
  )
};