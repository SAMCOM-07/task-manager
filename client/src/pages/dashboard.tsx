import { AlertCircle, ChevronRight, FileCheck, OctagonAlert, RectangleEllipsis, SquareCheckBig } from "lucide-react";
import { useTask } from "../hooks/useTask";
import TaskPieChart from "../components/PieChart";
import { Link } from "react-router-dom";
import { cn } from "../lib/utils";
import { useEffect } from "react";
import { useTaskFetch } from "../hooks/useTaskFetch";

export default function DashboardPage() {

  const { tasks, loadingTasks, openFormOverlay } = useTask();

  const fetchTasks = useTaskFetch();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks, openFormOverlay]);



  const taskAnalysis = [
    { title: "Total Tasks", subTitle: 'Tasks', value: tasks && tasks.length, icon: <FileCheck size={36} />, bgGradient: 'bg-gradient-to-r from-blue-600 to-blue-400' },
    { title: "Completed Tasks", subTitle: 'Completed', value: tasks && tasks.filter(task => task.status === 'completed').length, icon: <SquareCheckBig size={36} />, bgGradient: 'bg-gradient-to-r from-green-600 to-green-400' },
    { title: "In Progress", subTitle: 'Pending', value: tasks && tasks.filter(task => task.status === 'in_progress').length, icon: <RectangleEllipsis size={36} />, bgGradient: 'bg-gradient-to-r from-yellow-600 to-yellow-400' },
    { title: "Overdue Tasks", subTitle: 'Overdue', value: tasks && tasks.filter(task => new Date(task.due_date) < new Date() && task.status !== 'completed').length || 0, icon: <OctagonAlert size={36} />, bgGradient: 'bg-gradient-to-r from-red-600 to-red-400' },
  ];

  return (
    <section className="">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {taskAnalysis.map((item) => (
          <div key={item.subTitle} className={`${item.bgGradient} text-white/80 rounded-lg py-3 px-4 shadow-sm relative`}>
            <h2 className="font-bold">{item.title}</h2>
            <span className="text-3xl font-bold block">{item.value}</span>
            <small className="text-white/60">{item.subTitle}</small>
            <div className="absolute bottom-3 right-3 opacity-70">{item.icon}</div>
          </div>
        ))}
      </div>

      {/* pie chart and recent tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-4 mt-12 pb-24">

        {/* pie chart */}
        <div className="p-3 w-full h-full shadow-[0px_5px_10px_2px] shadow-muted-foreground/20 rounded-lg flex flex-col items-center justify-center">

          <h3 className="font-semibold text-xl p-4 border-b border-border w-full">Task Overview</h3>
          <TaskPieChart />

          <div className="flex gap-4 py-4 text-xs justify-evenly w-full items-center">
            <div className="flex items-center gap-1.5">
              <span className="block w-4 h-4 rounded-sm bg-green"></span>
              <span>Completed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="block w-4 h-4 rounded-sm bg-orange"></span>
              <span>In Progress</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="block w-4 h-4 rounded-sm bg-primary"></span>
              <span>Todo</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="block w-4 h-4 rounded-sm bg-destructive"></span>
              <span>Overdue</span>
            </div>
          </div>
        </div>

        {/* recent tasks */}
        <div className="w-full">
          <div className="flex items-center gap-4 justify-between mb-4">
            <h3 className="text-lg font-medium">Recent Tasks</h3>
            <Link to="/tasks" className="flex items-center gap-2 text-primary group">{tasks && tasks.length > 0 ? 'View All' : 'Create one'} <ChevronRight size={20} className="group-hover:translate-x-2 transition-transform duration-300" /></Link>
          </div>
          <div className="flex flex-col gap-2">
            {loadingTasks ? (
              <div className="text-center py-36 text-muted-foreground"><span className="animate-pulse">Loading tasks . . .</span></div>
            ) : tasks && tasks.length > 0 ? [...tasks].reverse().slice(0, 4).map((task) => {
              const overdue = new Date(task.due_date) < new Date() && task.status !== 'completed';
              return (
                <div key={task.id} className="border border-border rounded-md p-4 hover:bg-accent/30 transition-colors flex items-center justify-between gap-2">
                  <div className="space-y-2">
                    <h4 className="font-semibold">{task.title}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-2 max-w-[80%] leading-3.5">{task.description}</p>
                    <span className={cn('capitalize text-sm', 'px-3 py-1 rounded-full', task.priority === 'high' ? "text-red-600 bg-red-400/20" : task.priority === 'medium' ? "text-orange bg-orange/20" : "text-green bg-green/20")}>{task.priority}</span>
                  </div>
                  <div className="text-sm flex flex-col items-end gap-1">
                    <p className={cn("capitalize text-nowrap px-3 py-1 rounded-full", task.status === 'completed' ? 'bg-green/20 text-green' : task.status === 'in_progress' ? 'bg-orange/20 text-orange' : 'bg-primary/20 text-primary')}>{task.status === 'in_progress' ? 'In Progress' : task.status}</p>
                    <span className={cn("text-xs text-nowrap flex flex-col items-end gap-1", overdue ? "text-destructive" : "text-muted-foreground")}>Due: {new Date(task.due_date).toLocaleDateString("en-GB", {
                      day: "2-digit", month: "short", year: "numeric",
                    })} {overdue && <span className="flex items-center text-destructive gap-1 text-xs font-bold animate-pulse">
                      <AlertCircle size={14} />
                      OVERDUE
                    </span>}
                    </span>
                  </div>
                </div>
              )
            }) : (
              <div className="text-center py-12 text-muted-foreground">No tasks found. Create your first task!</div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}