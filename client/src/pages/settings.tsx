import { useState, useEffect, useRef } from "react";
import { useTask } from "../hooks/useTask";
import { API_BASE_URL } from "../config/api";
import {
  Moon,
  Sun,
  FileDown,
  Trash2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { jsPDF } from "jspdf";
import { useTaskFetch } from "../hooks/useTaskFetch";
import z from "zod";
import { authFetch } from "../utils/authFetch";

export default function SettingsPage() {

  const fetchTasks = useTaskFetch();
  const { tasks, setAlertDetails, setOpenAlert, theme, setTheme } = useTask();
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingPasswordChange, setLoadingPasswordChange] = useState(false);
  const [showDeleteAccountConfirm, setShowDeleteAccountConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [loadingDeleteAccount, setLoadingDeleteAccount] = useState(false);
  const passwordFormRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);


  // Handle export tasks to PDF
  const handleExportTasks = () => {
    if (tasks.length === 0) {
      setAlertDetails({ type: "error", message: "No tasks to export!" });
      setOpenAlert(true);
      return;
    }

    const doc = new jsPDF();

    // Title
    doc.setFontSize(20);
    doc.text("Task Dashboard Export", 20, 20);

    // Export date
    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128);
    doc.text(`Exported on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 20, 30);

    // Reset text color
    doc.setTextColor(0, 0, 0);

    // Summary
    const completedCount = tasks.filter((t) => t.status === "completed").length;
    const inProgressCount = tasks.filter((t) => t.status === "in_progress").length;
    const todoCount = tasks.filter((t) => t.status === "todo").length;

    doc.setFontSize(12);
    doc.text("Summary", 20, 45);
    doc.setFontSize(10);
    doc.text(`Total Tasks: ${tasks.length}`, 25, 52);
    doc.text(`Completed: ${completedCount}`, 25, 58);
    doc.text(`In Progress: ${inProgressCount}`, 25, 64);
    doc.text(`To Do: ${todoCount}`, 25, 70);

    // Task list
    let yPosition = 85;
    doc.setFontSize(12);
    doc.text("Tasks", 20, yPosition);

    tasks.forEach((task, index) => {
      yPosition += 10;

      // Check if we need a new page
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }

      // Task number and title
      doc.setFontSize(10);
      doc.setFont("bold");
      doc.text(`${index + 1}. ${task.title}`, 25, yPosition);

      yPosition += 6;

      // Task details
      doc.setFont("normal");
      doc.setFontSize(9);
      doc.setTextColor(80, 80, 80);

      doc.text(`Description: ${task.description}`, 30, yPosition);
      yPosition += 5;

      doc.text(
        `Due: ${new Date(task.due_date).toLocaleDateString()} | Priority: ${task.priority.toUpperCase()} | Status: ${task.status.replace("_", " ").toUpperCase()}`,
        30,
        yPosition
      );
      yPosition += 5;

      doc.text(`Category: ${task.category.toUpperCase()}`, 30, yPosition);

      doc.setTextColor(0, 0, 0);
    });

    // Footer
    yPosition += 15;
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("© Task Dashboard - All tasks saved locally", 20, yPosition + 10);

    // Save PDF
    doc.save(`tasks-backup-${new Date().toISOString().split("T")[0]}.pdf`);

    setAlertDetails({
      type: "success",
      message: `Exported ${tasks.length} task(s) to PDF!`,
    });
    setOpenAlert(true);
  };

  // Handle clear all tasks
  const handleClearAllTasks = async () => {
    try {
      setLoadingDelete(true);
      const res = await authFetch(`${API_BASE_URL}/api/tasks/clear`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setAlertDetails({ type: 'success', message: 'All tasks cleared successfully!' });
        setOpenAlert(true);
        fetchTasks();
      } else {
        setAlertDetails({ type: 'error', message: 'Failed to clear tasks. Please try again.' });
        setOpenAlert(true);
      }

    } catch (error) {
      console.error('Network error: ', error)
    } finally {
      setLoadingDelete(false);
      setShowClearConfirm(false);
    }
  };

  // Handle change password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = z.object({
      currentPassword: z.string().min(1, "Current password is required"),
      newPassword: z.string().min(6, "New password must be at least 6 characters"),
      confirmPassword: z.string().min(6, "Confirm password must be at least 6 characters"),
    }).refine((data) => data.newPassword === data.confirmPassword, {
      message: "New passwords do not match",
    });

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const data = {
      currentPassword: formData.get("currentPassword") as string,
      newPassword: formData.get("newPassword") as string,
      confirmPassword: formData.get("confirmPassword") as string,
    };

    const validationResult = validation.safeParse(data);

    if (!validationResult.success) {
      setAlertDetails({ type: 'error', message: validationResult.error.issues[0].message });
      setOpenAlert(true);
      return;
    }

    try {
      setLoadingPasswordChange(true);
      const res = await authFetch(`${API_BASE_URL}/api/users/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: validationResult.data.currentPassword,
          newPassword: validationResult.data.newPassword,
        }),
      });

      if (res.ok) {
        setAlertDetails({ type: 'success', message: 'Password changed successfully!' });
        setOpenAlert(true);
        passwordFormRef.current?.reset();
        console.log(res)
      } else {
        const error = await res.json();
        setAlertDetails({ type: 'error', message: error.error || 'Failed to change password.' });
        setOpenAlert(true);
      }
    } catch (error) {
      console.error('Network error: ', error);
      setAlertDetails({ type: 'error', message: 'Network error. Please try again.' });
      setOpenAlert(true);
    } finally {
      setLoadingPasswordChange(false);
    }
  };

  // Handle delete account
  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      setAlertDetails({ type: 'error', message: 'Password is required to delete account.' });
      setOpenAlert(true);
      return;
    }

    try {
      setLoadingDeleteAccount(true);
      const res = await authFetch(`${API_BASE_URL}/api/users/delete-account`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: deletePassword,
        }),
      });

      localStorage.removeItem("token");

      if (res.ok) {
        setAlertDetails({ type: 'success', message: 'Account deleted successfully. Redirecting...' });
        setOpenAlert(true);
        setTimeout(() => {
          window.location.href = '/register';
        }, 1500);
      } else {
        const error = await res.json();
        setAlertDetails({ type: 'error', message: error.error || 'Failed to delete account.' });
        setOpenAlert(true);
      }
    } catch (error) {
      console.error('Network error: ', error);
      setAlertDetails({ type: 'error', message: 'Network error. Please try again.' });
      setOpenAlert(true);
    } finally {
      setLoadingDeleteAccount(false);
      setShowDeleteAccountConfirm(false);
      setDeletePassword("");
    }
  };

  return (
    <div className="max-w-4xl p-4 mx-auto space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">
          Customize your task dashboard preferences
        </p>
      </div>

      {/* Theme Settings */}
      <div className="bg-card/50 border border-border rounded-lg p-6 space-y-4">
        <div className="flex items-center gap-2">
          {theme === "light" ? (
            <Sun size={24} className="text-yellow-500" />
          ) : (
            <Moon size={24} className="text-blue-400" />
          )}
          <h2 className="text-xl font-semibold text-foreground">
            Appearance
          </h2>
        </div>

        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">Theme Preference</p>
          <div className="flex gap-3">
            <button
              onClick={() => setTheme("light")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${theme === "light"
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background border-border hover:border-primary/50"
                }`}
            >
              <Sun size={18} />
              Light
            </button>
            <button
              onClick={() => setTheme("dark")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${theme === "dark"
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background border-border hover:border-primary/50"
                }`}
            >
              <Moon size={18} />
              Dark
            </button>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-card/50 border border-border rounded-lg p-6 space-y-4">
        <h2 className="text-xl font-semibold text-foreground">
          Data Management
        </h2>

        <div className="space-y-3">
          <button
            onClick={handleExportTasks}
            className="w-full flex items-center gap-3 px-4 py-3 bg-green/10 hover:bg-green/20 text-green border border-green/20 rounded-lg transition-colors font-medium"
          >
            <FileDown size={20} />
            Export All Tasks as PDF
          </button>

          {!showClearConfirm ? (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="w-full flex items-center gap-3 px-4 py-3 bg-destructive/10 hover:bg-destructive/20 text-destructive border border-destructive/20 rounded-lg transition-colors font-medium"
            >
              <Trash2 size={20} />
              Clear All Tasks
            </button>
          ) : (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 space-y-3">
              <div className="flex items-start gap-3">
                <AlertCircle
                  size={20}
                  className="text-destructive shrink-0 mt-0.5"
                />
                <div>
                  <p className="font-semibold text-destructive">
                    Are you sure?
                  </p>
                  <p className="text-sm text-destructive/80">
                    This will permanently delete all {tasks.length} task(s). This
                    action cannot be undone.
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleClearAllTasks}
                  className="flex-1 px-4 py-2 bg-destructive hover:bg-destructive/90 text-primary-foreground rounded-lg font-medium transition-colors"
                >
                  {loadingDelete ? <div className="loading-spinner"></div> : "Yes, Clear All"}
                </button>
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1 px-4 py-2 bg-background border border-border hover:bg-muted text-foreground rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-card/50 border border-border rounded-lg p-6 space-y-4">
        <h2 className="text-xl font-semibold text-foreground">
          Change Password
        </h2>

        <form ref={passwordFormRef} onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-foreground mb-1">
              Current Password
            </label>
            <input
              id="currentPassword"
              type="password"
              name="currentPassword"
              placeholder="Enter your current password"
              className="password-input"
            />
          </div>

          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-foreground mb-1">
              New Password
            </label>
            <input
              id="newPassword"
              type="password"
              name="newPassword"
              placeholder="Enter your new password"
              className="password-input"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-1">
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              placeholder="Confirm your new password"
              className="password-input"
            />
          </div>

          <button
            type="submit"
            disabled={loadingPasswordChange}
            className="w-full px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loadingPasswordChange ? <div className="loading-spinner"></div> : "Change Password"}
          </button>
        </form>
      </div>

      {/* Danger Zone - Delete Account */}
      <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 space-y-4">
        <div className="flex items-center gap-2">
          <AlertCircle size={24} className="text-destructive" />
          <h2 className="text-xl font-semibold text-destructive">
            Danger Zone
          </h2>
        </div>

        <div className="space-y-3">
          <p className="text-sm text-destructive/80">
            Once you delete your account, there is no going back. All your tasks and data will be permanently deleted. This action cannot be undone.
          </p>

          {!showDeleteAccountConfirm ? (
            <button
              onClick={() => setShowDeleteAccountConfirm(true)}
              className="w-fit flex items-center gap-3 px-4 py-3 bg-destructive/20 hover:bg-destructive/30 text-destructive border border-destructive/40 rounded-lg transition-colors font-medium"
            >
              <Trash2 size={20} />
              Delete My Account
            </button>
          ) : (
            <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4 space-y-3">
              <p className="text-sm font-semibold text-destructive">
                Enter your password to confirm account deletion:
              </p>
              <input
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                placeholder="Enter your password"
                className="password-input"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleDeleteAccount}
                  disabled={loadingDeleteAccount}
                  className="flex-1 px-4 py-2 bg-destructive hover:bg-destructive/90 text-primary-foreground rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingDeleteAccount ? <div className="loading-spinner"></div> : "Delete Account"}
                </button>
                <button
                  onClick={() => {
                    setShowDeleteAccountConfirm(false);
                    setDeletePassword("");
                  }}
                  className="flex-1 px-4 py-2 bg-background border border-border hover:bg-muted text-foreground rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="bg-card/50 border border-border rounded-lg p-6 space-y-4">
        <h2 className="text-xl font-semibold text-foreground">About</h2>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">App Name</span>
            <span className="font-semibold text-foreground">Task Dashboard</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Version</span>
            <span className="font-semibold text-foreground">1.0.0</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Total Tasks</span>
            <span className="font-semibold text-foreground">{tasks.length}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Completed Tasks</span>
            <span className="font-semibold text-green flex items-center gap-1">
              <CheckCircle2 size={16} />
              {tasks.filter((task) => task.status === "completed").length}
            </span>
          </div>
        </div>
      </div>


    </div>
  );
}