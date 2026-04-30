import { EditIcon } from "lucide-react"
import { useTask } from "../hooks/useTask"
import { cn } from "../lib/utils"
import { DeleteButton } from "./ActionButtons";

const TasksTable = () => {

  const { tasks, loadingTasks, setOpenFormOverlay, setEditDetails } = useTask();

  return (
    <div className="overflow-auto rounded-lg border border-border shadow-sm">
      <table className="w-full text-nowrap">
        <thead className="bg-accent border-b border-border">
          <tr className="text-left">
            {["Task", "Status", "Priority", "Category", "Due Date", "Action"].map((header, index) => (
              <th key={index} className="px-6 py-4 font-semibold text-foreground">
                {header}
              </th>
            ))}

          </tr>
        </thead>
        {loadingTasks ? (
          <tbody>
            <tr className="animate-pulse">
              <td colSpan={6} className="py-12 text-center text-muted-foreground">
                Loading tasks . . .
              </td>
            </tr>
          </tbody>
        ) : <tbody className="">
          {tasks && tasks.length > 0 ? [...tasks].reverse().map((task) => {
            const overdue = new Date(task.due_date) < new Date() && task.status !== 'completed'
            return (
              <tr key={task.id} className="border-b border-border hover:bg-accent/30 transition-colors">
                <td className="px-6 py-4 max-w-xs min-w-xs  w-full">
                  <span>{task.title}</span>
                  <span className="block text-muted-foreground overflow-x-scroll mt-2 text-sm">{task.description}</span>
                </td>
                <td className="px-6 py-4"><span className={cn('capitalize text-sm', 'px-3 py-1 rounded-full', task.status === 'completed' ? "text-green bg-green/20" : task.status === 'in_progress' ? "text-orange bg-orange/20" : "text-primary bg-primary/20")}>{task.status === 'in_progress' ? 'In Progress' : task.status}</span></td>
                <td className="px-6 py-4"><span className={cn('capitalize text-sm', 'px-3 py-1 rounded-full', task.priority === 'high' ? "text-red-600 bg-red-400/20" : task.priority === 'medium' ? "text-orange bg-orange/20" : "text-green bg-green/20")}>{task.priority}</span></td>
                <td className="px-6 py-4"><span className="capitalize">{task.category}</span></td>
                <td className={cn("px-6 py-4", overdue && "text-destructive")}>{new Date(task.due_date).toLocaleDateString("en-GB", {
                  day: "2-digit", month: "short", year: "numeric",
                })} {overdue && <span className="animate-pulse ml-2 text-xs font-bold">OVERDUE</span>}</td>
                <td className="px-6 py-4 mt-4 flex items-center gap-4 text-foreground hover:text-foreground/70 cursor-pointer">

                  {/* task edit button */}
                  <button className="hover-scale text-primary" onClick={() => {
                    setOpenFormOverlay(true)
                    setEditDetails({
                      id: task.id,
                      title: task.title,
                      description: task.description,
                      priority: task.priority,
                      status: task.status,
                      category: task.category,
                      due_date: task.due_date
                    })
                  }}><EditIcon size={20} /></button>

                  {/* task delete button */}
                  <DeleteButton id={task.id} />
                </td>
              </tr>
            )
          }) : <tr>
            <td colSpan={6} className="text-center py-12 text-muted-foreground">No tasks found.</td>
          </tr>}
        </tbody>}
      </table>
    </div>
  )
}

export default TasksTable
