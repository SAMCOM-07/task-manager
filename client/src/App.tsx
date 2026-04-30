import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import FormOverlay from "./components/FormOverlay";
import { useTask } from "./hooks/useTask";
import Alert from "./components/Alert";

export default function AppLayout() {

  const { openFormOverlay, alertDetails } = useTask()

  return (
    <div className="flex h-screen relative">

      <Alert details = {alertDetails}/>

      {openFormOverlay && <div className="fixed inset-0 z-1000">
        <FormOverlay />
      </div>}
      <Sidebar />
      <main className="flex-1 overflow-auto relative">
        <nav className="sticky top-0 left-0 right-0 z-10"><Navbar /></nav>
        <div className="p-4">
          <Outlet />
        </div>
      </main>
      {/* <HamburgerMenu /> */}
    </div>
  );
}