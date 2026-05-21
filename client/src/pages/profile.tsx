import { useState, useRef, useEffect } from "react";
import { LogoutButton } from "../components/AuthButtons";
import { useAuth } from "../hooks/useAuth";
import { useTask } from "../hooks/useTask";
import { API_BASE_URL } from "../config/api";
import {
  User,
  Mail,
  Edit2,
  Save,
  X,
  Briefcase,
  BookOpen,
  Heart,
  Target,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";
import { useUser } from "../hooks/useUser";
import { useTaskFetch } from "../hooks/useTaskFetch";

const ProfilePage = () => {
  const { user } = useAuth();
  const { tasks, setAlertDetails, setOpenAlert } = useTask();
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [editedUsername, setEditedUsername] = useState(user?.username || "");
  const [loadingUsername, setLoadingUsername] = useState(false);
  const usernameInputRef = useRef<HTMLInputElement>(null);
  const { fetchUser } = useUser();
  const fetchTasks = useTaskFetch();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Calculate activity statistics
  const activityStats = {
    work: tasks.filter((t) => t.category === "work").length,
    education: tasks.filter((t) => t.category === "education").length,
    personal: tasks.filter((t) => t.category === "personal").length,
    career: tasks.filter((t) => t.category === "career").length,
    completed: tasks.filter((t) => t.status === "completed").length,
    inProgress: tasks.filter((t) => t.status === "in_progress").length,
    todo: tasks.filter((t) => t.status === "todo").length,
  };

  const handleEditUsername = () => {
    setIsEditingUsername(true);
    setTimeout(() => usernameInputRef.current?.focus(), 0);
  };

  const handleSaveUsername = async () => {
    if (!editedUsername.trim()) {
      setEditedUsername(user?.username || "");
      setIsEditingUsername(false);
      return;
    }

    if (editedUsername === user?.username) {
      setIsEditingUsername(false);
      return;
    }

    try {
      setLoadingUsername(true);
      const res = await fetch(`${API_BASE_URL}/api/users/update`, {
        method: "PATCH",
        // credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          username: editedUsername,
        }),
      });

      if (res.ok) {
        setIsEditingUsername(false);
        setEditedUsername(user?.username || "");
        setAlertDetails({ type: 'success', message: 'Username updated successfully!' });
        setOpenAlert(true);
        fetchUser(); // Refresh the user data
      } else {
        const response = await res.json();
        setAlertDetails({ type: 'error', message: response.error.username || 'Failed to update username.' });
        setOpenAlert(true);
        console.error("Error updating username:", response.error || response.message);
        setEditedUsername(user?.username || "");
      }
    } catch (error) {
      console.error("Network error:", error);
      setEditedUsername(user?.username || "");
    } finally {
      setLoadingUsername(false);
    }
  };

  const handleCancel = () => {
    setEditedUsername(user?.username || "");
    setIsEditingUsername(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="bg-linear-to-r from-primary/20 to-primary/5 border border-border rounded-lg p-8">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
              <User size={40} className="text-primary" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground">{user?.username}</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Account Profile
              </p>
            </div>
          </div>
          <LogoutButton />
        </div>
      </div>

      {/* Personal Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Username Section */}
        <div className="bg-card/50 border border-border rounded-lg p-6 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <User size={20} className="text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Username</h2>
          </div>

          {!isEditingUsername ? (
            <div className="flex items-center justify-between">
              <span className="text-foreground">{user?.username}</span>
              <button
                onClick={handleEditUsername}
                className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
                title="Edit username"
              >
                <Edit2 size={18} className="text-primary" />
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <input
                ref={usernameInputRef}
                type="text"
                value={editedUsername}
                onChange={(e) => setEditedUsername(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSaveUsername}
                  disabled={loadingUsername}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save size={16} />
                  {loadingUsername ? <div className="loading-spinner"></div> : "Save"}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={loadingUsername}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-background border border-border hover:bg-muted text-foreground rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <X size={16} />
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Email Section */}
        <div className="bg-card/50 border border-border rounded-lg p-6 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Mail size={20} className="text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Email</h2>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground break-all">{user?.email}</span>
            <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
              (Non-editable)
            </span>
          </div>
        </div>
      </div>

      {/* Activities Overview */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Activities Overview</h2>

        {/* Task Status Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* completed */}
          <div className="bg-green/10 border border-green/20 rounded-lg p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green/20 rounded-lg">
                <CheckCircle2 size={36} className="text-green" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completed Tasks</p>
                <p className="text-3xl font-bold text-green">{activityStats.completed}</p>
              </div>
            </div>
          </div>

          {/* todo */}
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/20 rounded-lg">
                <AlertCircle size={36} className="text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">To Do</p>
                <p className="text-3xl font-bold text-primary">{activityStats.todo}</p>
              </div>
            </div>
          </div>

          {/* in progress */}
          <div className="bg-orange/10 border border-orange/20 rounded-lg p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange/20 rounded-lg">
                <Clock size={36} className="text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-3xl font-bold text-orange-500">{activityStats.inProgress}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Task Category Overview */}
        <div className="bg-card/50 border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Tasks by Category</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {/* Work */}
            <div className="flex items-center gap-3 p-4 bg-background rounded-lg border border-border/50">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Briefcase size={20} className="text-blue-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Work</p>
                <p className="text-xl font-semibold text-foreground">
                  {activityStats.work}
                </p>
              </div>
            </div>

            {/* Education */}
            <div className="flex items-center gap-3 p-4 bg-background rounded-lg border border-border/50">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <BookOpen size={20} className="text-purple-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Education</p>
                <p className="text-xl font-semibold text-foreground">
                  {activityStats.education}
                </p>
              </div>
            </div>

            {/* Personal */}
            <div className="flex items-center gap-3 p-4 bg-background rounded-lg border border-border/50">
              <div className="p-2 bg-pink-500/20 rounded-lg">
                <Heart size={20} className="text-pink-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Personal</p>
                <p className="text-xl font-semibold text-foreground">
                  {activityStats.personal}
                </p>
              </div>
            </div>

            {/* Career */}
            <div className="flex items-center gap-3 p-4 bg-background rounded-lg border border-border/50">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <Target size={20} className="text-orange-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Career</p>
                <p className="text-xl font-semibold text-foreground">
                  {activityStats.career}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Total Tasks Summary */}
        <div className="bg-card/50 border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Total Tasks</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {tasks.length} {tasks.length === 1 ? "task" : "tasks"} created
              </p>
            </div>
            <div className="text-4xl font-bold text-primary">{tasks.length}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;