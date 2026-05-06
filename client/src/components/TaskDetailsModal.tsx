import { X, Calendar, Tag, AlertCircle, Zap, CheckCircle, MessageCircle } from "lucide-react";
import { useTask } from "../hooks/useTask";
import type { TaskType } from "../types/types";
import { cn } from "../lib/utils";
import { useRef, useEffect, useState } from "react";
import { AiTaskHelp } from "./aiTaskHelp";

const TaskDetailsModal = ({ task }: { task: TaskType | null }) => {
  const { setOpenDetailsModal } = useTask();
  const [askAi, setAskAi] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!task) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenDetailsModal(false);
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setOpenDetailsModal(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setOpenDetailsModal, task]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green bg-green/20";
      case "in_progress":
        return "text-orange bg-orange/20";
      case "todo":
        return "text-primary bg-primary/20";
      default:
        return "text-muted-foreground bg-muted";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-destructive bg-destructive/20";
      case "medium":
        return "text-orange bg-orange/20";
      case "low":
        return "text-green bg-green/20";
      default:
        return "text-muted-foreground bg-muted";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "work":
        return "bg-primary/10 text-primary";
      case "education":
        return "bg-purple-500/10 text-purple-500";
      case "personal":
        return "bg-pink-500/10 text-pink-500";
      case "career":
        return "bg-amber-500/10 text-amber-500";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  if (!task) return null;

  const overdue = new Date(task.due_date) < new Date() && task.status !== "completed";

  return (
    <div
      className="fixed inset-0 z-200 flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm"
    >
      {askAi ? (
        <AiTaskHelp task={task} onBack={() => setAskAi(false)} />
      ) : (
        <div
            ref={modalRef}
            className="bg-card rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-border">
            {/* Header */}
            <div className="sticky top-0 flex items-center justify-between px-6 py-4 border-b border-border bg-card">
              <div className="flex flex-col max-w-[45%]">
                <h2 className="text-lg leading-5 font-bold text-foreground">{task.title}</h2>
                <p className="text-muted-foreground mt-1 text-sm">Task Details</p>
              </div>

              <button
                onClick={() => setAskAi(true)}
                className="flex items-center gap-2 px-3 py-2 text-primary rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
              >
                <MessageCircle size={18} className="animate-bounce -mb-1"/>
                <span className="text-xs font-medium text-nowrap">Ask AI for Help</span>
              </button>

              <button
                onClick={() => setOpenDetailsModal(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Description
                </label>
                <p className="text-foreground/80 bg-accent/50 rounded-lg p-4 max-h-48 overflow-y-auto">
                  {task.description}
                </p>
              </div>

              {/* Status, Priority, Category */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Status */}
                <div>
                  <label className="flex text-sm font-semibold text-foreground mb-2 items-center gap-2">
                    <CheckCircle size={16} />
                    Status
                  </label>
                  <div
                    className={cn(
                      "px-4 py-2 rounded-lg font-medium text-center capitalize inline-block w-full",
                      getStatusColor(task.status)
                    )}
                  >
                    {task.status === "in_progress" ? "In Progress" : task.status}
                  </div>
                </div>

                {/* Priority */}
                <div>
                  <label className="flex text-sm font-semibold text-foreground mb-2 items-center gap-2">
                    <Zap size={16} />
                    Priority
                  </label>
                  <div
                    className={cn(
                      "px-4 py-2 rounded-lg font-medium text-center capitalize inline-block w-full",
                      getPriorityColor(task.priority)
                    )}
                  >
                    {task.priority}
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="flex text-sm font-semibold text-foreground mb-2 items-center gap-2">
                    <Tag size={16} />
                    Category
                  </label>
                  <div
                    className={cn(
                      "px-4 py-2 rounded-lg font-medium text-center capitalize inline-block w-full",
                      getCategoryColor(task.category)
                    )}
                  >
                    {task.category}
                  </div>
                </div>
              </div>

              {/* Due Date */}
              <div>
                <label className="flex text-sm font-semibold text-foreground mb-2 items-center gap-2">
                  <Calendar size={16} />
                  Due Date
                </label>
                <div
                  className={cn(
                    "px-4 py-3 rounded-lg font-medium",
                    overdue ? "bg-destructive/20 text-destructive" : "bg-accent/50 text-foreground"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span>
                      {new Date(task.due_date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                    {overdue && (
                      <span className="flex items-center gap-1 text-xs font-bold animate-pulse">
                        <AlertCircle size={14} />
                        OVERDUE
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Task ID */}
              <div className="pt-4 border-t border-border/50">
                <p className="text-xs text-muted-foreground">
                  Task ID: <span className="font-mono">{task.id}</span>
                </p>
              </div>
            </div>
          </div>
      )}
    </div>
  );
};

export default TaskDetailsModal;
