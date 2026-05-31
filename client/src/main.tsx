import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

// import App from "./App.tsx";
import DashboardPage from "./pages/dashboard";
import TasksPage from "./pages/tasks";
import SettingsPage from "./pages/settings";

import "./index.css";
import { TaskProvider } from "./context/AppContext.tsx";
import LoginPage from "./pages/login.tsx";
import RegisterPage from "./pages/register.tsx";
import VerifyEmailPage from "./pages/verifyEmail.tsx";
import ProfilePage from "./pages/profile.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import RootRedirect from "./layouts/RouteRedirect.tsx";
import ProtectedLayout from "./layouts/ProtectedLayout.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootRedirect />, // handles redirect logic
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/verify-email/:token?",
    element: <VerifyEmailPage />,
  },
  {
    path: "/",
    element: <ProtectedLayout />, // 🔐 protected wrapper
    children: [
      { index: true, path: "/dashboard", element: <DashboardPage /> },
      { path: "tasks", element: <TasksPage /> },
      { path: "settings", element: <SettingsPage /> },
      { path: "profile", element: <ProfilePage /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <TaskProvider>
        <RouterProvider router={router} />
      </TaskProvider>
    </AuthProvider>
  </React.StrictMode>
);