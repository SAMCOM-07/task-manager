import { useLocation } from "react-router-dom"
import ThemeToogle from "./ThemeToogle"
import ProfileDropdown from "./ProfileDropdown"
import { PanelLeftOpen } from "lucide-react"
import { useTask } from "../hooks/useTask"

const Navbar = () => {

  const activeHref = (useLocation().pathname)

  const { setShowSidebar } = useTask()

  return (
    <section className="bg-background border-b border-border p-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <PanelLeftOpen onClick={() => setShowSidebar(true)} className="inline cursor-pointer text-muted-foreground md:hidden" />
        <h1 className="text-xl tracking-wide font-bold text-primary/75"> {activeHref === '/dashboard' ? 'Dashboard Overview' : activeHref === '/tasks' ? 'Manage Tasks' : activeHref === '/settings' ? 'Settings' : 'Profile'}</h1>
      </div>

      <div className="flex items-center gap-3">
        <ProfileDropdown />
        <ThemeToogle />
      </div>
    </section>
  )
}

export default Navbar
