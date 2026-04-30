import { X } from "lucide-react"
import { useTask } from "../hooks/useTask";
import { API_BASE_URL } from "../config/api";
import { useEffect, useRef, useState } from "react";
import { z } from "zod"

// zod validation
const taskSchema = z.object({
  title: z.string().trim().min(1, "Task title is required.").max(30, "Task title cannot exceed 30 characters."),
  description: z.string().trim().min(1, "Task description is required."),
  priority: z.enum(["low", "medium", "high"], { error: () => ({ message: "Priority is required." }) }),
  status: z.enum(["todo", "in_progress", "completed"], { error: () => ({ message: "Status is required." }) }),
  category: z.enum(["work", "education", "personal", "career"], { error: () => ({ message: "Category is required." }) }),
  due_date: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), "Invalid due date format")
    .refine(
      (date) => new Date(date) > new Date(),
      "Due date must be in the future"
    ),
});

const FormOverlay = () => {
  const { setOpenFormOverlay, editDetails, setEditDetails, setOpenAlert, setAlertDetails } = useTask();
  const overlayRef = useRef<HTMLDivElement>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenFormOverlay(false);
        setEditDetails(null);
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (overlayRef.current && !overlayRef.current.contains(event.target as Node)) {
        setEditDetails(null);
        setOpenFormOverlay(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setOpenFormOverlay, overlayRef, setEditDetails]);


  // handle submit function for both creating and updating tasks
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const validatedData = taskSchema.safeParse(data);

    if (!validatedData.success) {
      const newErrors: { [key: string]: string } = {};
      validatedData.error.issues.forEach(err => {
        if (err.path[0]) {
          newErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(newErrors);
      return;
    }


    try {
      setLoading(true);

      const url = editDetails ? `${API_BASE_URL}/api/tasks/update/${editDetails.id}` : `${API_BASE_URL}/api/tasks/create`;
      const method = editDetails ? "PATCH" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(validatedData.data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        setAlertDetails({
          type: "error",
          message: errorData.error || "An error occurred while creating the task. Please try again.",
        });
        setOpenAlert(true);
        return;
      }

      setAlertDetails({ type: "success", message: "Task created successfully!" });
      setOpenAlert(true);

    } catch {
      setAlertDetails({
        type: "error",
        message: "A network error occurred. Please check your connection and try again.",
      });
      setOpenAlert(true);
    } finally {
      setLoading(false);
    }

    setOpenFormOverlay(false);
    setEditDetails(null);
  };

  return (
    <div className={"w-dvw h-dvh py-12 bg-black/50 backdrop-blur-sm flex items-center justify-center px-6"}>
      <div ref={overlayRef} className="bg-background border border-border rounded-2xl shadow-lg w-full max-w-xl h-full max-h-fit overflow-auto relative">
        <div className="p-6 flex justify-between items-center text-lg font-medium sticky top-0 border-b border-border bg-background">
          <h2 className="font-semibold text-2xl">Create New Task</h2>
          <button
            onClick={() => {
              setOpenFormOverlay(false);
              setEditDetails(null);
            }}
            className="hover-scale hover:bg-muted-foreground/30 rounded-full p-1.5 text-muted-foreground">
            <span className="sr-only">Close</span>
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 w-full">
          <div className="flex flex-col gap-4">
            {/* Task title */}
            <label className="form-overlay-label">
              Task Title
              <input
                type="text"
                className={'form-overlay-input'}
                placeholder="Enter task name"
                name="title"
                defaultValue={editDetails?.title || ""}
                maxLength={30}
              />
              {errors.title && <span className="text-destructive/70 text-sm">{errors.title}</span>}
            </label>

            {/* Task description */}
            <label className="form-overlay-label">
              Description
              <textarea
                className={`form-overlay-input h-38 resize-none-input resize-none`}
                placeholder="Enter task description"
                name="description"
                defaultValue={editDetails?.description || ""}
                maxLength={100}
              />
              {errors.description && <span className="text-destructive/70 text-sm">{errors.description}</span>}
            </label>

            {/* Priority and status */}
            <div className="flex gap-4 justify-between">
              <label className="form-overlay-label w-full">
                Priority
                <select defaultValue={editDetails?.priority || ""} name="priority" className="form-overlay-input">
                  <option value="">Select Priority</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                {errors.priority && <span className="block text-destructive/70 text-sm">{errors.priority}</span>}
              </label>

              <label className="form-overlay-label w-full">
                Status
                <select defaultValue={editDetails?.status || ""} name="status" className="form-overlay-input">
                  <option value="">Select Status</option>
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
                {errors.status && <span className="block text-destructive/70 text-sm">{errors.status}</span>}
              </label>
            </div>

            {/* Category and due date */}
            <div className="flex gap-4 justify-between">
              <label className="form-overlay-label w-full">
                Category
                <select defaultValue={editDetails?.category || ""} name="category" className="form-overlay-input">
                  <option value="">Select Category</option>
                  <option value="work">Work</option>
                  <option value="education">Education</option>
                  <option value="personal">Personal</option>
                  <option value="career">Career</option>
                </select>
                {errors.category && <span className="block text-destructive/70 text-sm">{errors.category}</span>}
              </label>

              <label className="form-overlay-label w-full">
                Due Date
                <input
                  type="date"
                  defaultValue={editDetails?.due_date ? new Date(editDetails.due_date).toISOString().split('T')[0] : undefined}
                  name="due_date"
                  className="form-overlay-input"
                />
                {errors.due_date && <span className="text-destructive/70 text-sm">{errors.due_date}</span>}
              </label>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end w-full text-sm text-white gap-4 py-4 sticky bottom-0 bg-background">
            <button
              type="button"
              onClick={() => {
                setOpenFormOverlay(false);
                setEditDetails(null);
              }}
              className="px-4 py-2 bg-destructive/75 rounded-lg hover:bg-destructive transition-all duration-300 active:scale-95"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="min-w-24 px-4 py-2 bg-primary/75 rounded-lg hover:bg-primary transition-all duration-300 active:scale-95"
            >
              {loading ? (editDetails ? <div className="loading-spinner"></div> : <div className="loading-spinner"></div>) : (editDetails ? "Update Task" : "Create Task")}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default FormOverlay;
