import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import FormOverlay from "./components/FormOverlay";
import TaskDetailsModal from "./components/TaskDetailsModal";
import { useTask } from "./hooks/useTask";
import Alert from "./components/Alert";

export default function AppLayout() {

  const { openFormOverlay, alertDetails, openDetailsModal, selectedTask } = useTask()

  return (
    <div className="flex h-screen relative">

      <Alert details={alertDetails} />

      {openDetailsModal && <TaskDetailsModal task={selectedTask} />}

      {openFormOverlay && <div className="fixed inset-0 z-700">
        <FormOverlay />
      </div>}
      <Sidebar />
      <main className="flex-1 overflow-auto relative">
        <nav className="sticky z-10 inset-0"><Navbar /></nav>
        <div className="p-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
}