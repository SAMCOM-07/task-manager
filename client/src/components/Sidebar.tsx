import { HomeIcon, NotebookPen, NotepadText, PanelLeftClose, SettingsIcon } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "../lib/utils";
import { useTask } from "../hooks/useTask";
import { useEffect, useRef } from "react";
import { useAuth } from "../hooks/useAuth";

export default function Sidebar() {

  const { user, isLoadingUser } = useAuth();

  const { showSidebar, setShowSidebar } = useTask();
  const activeHref = (useLocation().pathname)
  const sideBarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {

    const handleClickOutside = (event: MouseEvent) => {
      if (sideBarRef.current && !sideBarRef.current.contains(event.target as Node)) {
        setShowSidebar(false);
      }
    };

    window.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setShowSidebar, sideBarRef]);

  return (
    <>
      {showSidebar && (
        <div
          className="fixed inset-0 z-40 md:hidden bg-background/10 backdrop-blur-xs"
          onClick={() => setShowSidebar(false)}
        />
      )}
      <section ref={sideBarRef} className={cn("fixed z-50 transition-transform duration-300 h-dvh bg-background md:relative md:translate-x-0 w-64 2xl:w-82 border-r border-border", showSidebar ? "translate-x-0" : "-translate-x-70")}>
        <h1 className="text-2xl font-bold flex items-center gap-2 border-b border-border p-4"><NotebookPen size={36} className="inline rounded-full p-2 bg-primary/75 text-white" /><span>TaskManager</span> <PanelLeftClose className="mt-1 cursor-pointer text-muted-foreground md:hidden" onClick={() => setShowSidebar(false)} /></h1>

        <section className="p-4 flex flex-col justify-between h-[calc(100%-68px)]">
          <nav className="flex flex-col gap-2">
            {
              [
                {
                  name: 'Dashboard',
                  href: '/dashboard',
                  icon: <HomeIcon size={20} />,
                },
                {
                  name: 'Tasks',
                  href: '/tasks',
                  icon: <NotepadText size={20} />,
                },
                {
                  name: 'Settings',
                  href: '/settings',
                  icon: <SettingsIcon size={20} />,
                },

              ].map(nav =>
                <NavLink onClick={() => setShowSidebar(false)} to={nav.href} className={cn('inline-flex items-center gap-3 p-1.5 px-2 rounded-lg transition-all duration-300 outline-ring', activeHref === nav.href ? 'bg-accent text-primary hover:bg-accent' : 'text-muted-foreground hover:text-foreground hover:bg-accent/40')} key={nav.name}>
                  <span className="">{nav.icon}</span>
                  {nav.name}
                </NavLink>
              )
            }
          </nav>


          {/* user profile link */}

          <div className="p-2 rounded-lg bg-accent overflow-hidden">
            {isLoadingUser ? (
              <div className="flex items-center gap-3 animate-pulse">
                <div className="w-10 h-10 rounded-full bg-muted-foreground/50" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-24 rounded bg-muted-foreground/50" />
                  <div className="h-3 w-20 rounded bg-muted-foreground/50" />
                </div>
              </div>
            ) : <NavLink onClick={() => setShowSidebar(false)} to={'/profile'} className={'flex items-center gap-3'}>
              <div className="w-10 h-10 rounded-full font-medium  text-xl bg-linear-to-r from-primary to-purple-600 text-white flex items-center justify-center">
                {user?.username?.charAt(0) || "U"}
              </div>
              <h2 className="leading-4">
                <span className="block font-medium">{user?.username || "User"}</span>
                <span className="text-sm text-muted-foreground">View Profile</span>
              </h2>
            </NavLink>}
          </div>

        </section>
      </section>
    </>
  );
}
