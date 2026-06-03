import { PieChart, Pie, ResponsiveContainer } from "recharts";
import { useTask } from "../hooks/useTask";


export default function TaskPieChart() {
  const { tasks, loadingTasks } = useTask()

  const data = [
    { name: "In Progress", value: tasks && tasks.filter(task => task.status === 'in_progress').length || 0, fill: "#f59e0b" },
    { name: "Todo", value: tasks && tasks.filter(task => task.status === 'todo').length || 0, fill: "#3b82f6" },
    { name: "Completed", value: tasks && tasks.filter(task => task.status === 'completed').length || 0, fill: "#22c55e" },
    { name: "Overdue", value: tasks && tasks.filter(task => new Date(task.due_date) < new Date() && task.status !== 'completed').length || 0, fill: "#ef4444" },
  ];

  return (
    <div className="w-full h-100 outline-none">
      {loadingTasks ? (
        <div className="flex items-center justify-center h-full text-gray-500">
          Loading . . .
        </div>
      ) : tasks && tasks.length === 0 ? (
        <div className="flex items-center justify-center h-full text-gray-500">
          No tasks to display
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%" >
          <PieChart>
            <Pie className="outline-none"
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={130}
              paddingAngle={3}
              stroke="none"
              label={({ percent }) => `${(percent! * 100).toFixed(0)}%`}
            >
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}