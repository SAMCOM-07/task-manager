import { BadgePlus } from "lucide-react";
import TaskFilter from "../components/Filter";
import TasksTable from "../components/TasksTable";
import { useTask } from "../hooks/useTask";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTaskFetch } from "../hooks/useTaskFetch";


const TaskPage = () => {

  const [searchParams] = useSearchParams();

  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const { setOpenFormOverlay } = useTask();
  const currentFilter = searchParams.get("filter");

  const fetchTasks = useTaskFetch();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return (
    <section className="">

      {/* task filter, search and create task button */}
      <div className="px-4 flex items-center justify-between gap-3 border-b border-border py-4 sticky top-17.25 bg-background ">
        <TaskFilter />

        {/* search input */}
        <form
          className="flex w-full items-center gap-3"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="text"
            placeholder="Search tasks..."
            maxLength={30}
            value={searchTerm}
            onChange={(e) => {
              const value = e.target.value;
              e.preventDefault();
              setSearchTerm(value);

              const params = new URLSearchParams();

              if (value) {
                params.set("search", value);
              }

              if (currentFilter) {
                params.set("filter", currentFilter);
              }

              navigate(`/tasks?${params.toString()}`, { replace: true });
            }}
            className="border border-border rounded-md px-3 py-2 text-sm flex-1 w-full max-w-lg mx-auto outline-ring text-muted-foreground"
          />
        </form>

        {/* create task button */}
        <button
          onClick={() => setOpenFormOverlay(true)}
          className="bg-primary/75 text-nowrap w-fit px-3 py-2 rounded-md text-sm hover:bg-primary/85 active:scale-95 transition-all duration-200 flex items-center gap-2 text-white font-medium outline-none">
          <span className="hidden sm:block">Create</span> <BadgePlus size={20} />
        </button>

      </div>
      {/* task list table */}
      <section className="px-4">
        <h2 className="mt-6 mb-3 font-medium">Task List</h2>
        <TasksTable />
      </section>
    </section>
  );
};

export default TaskPage;