import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { FilterType } from "../types/types";
import { Link, useSearchParams } from "react-router-dom";


const options: { value: FilterType; label: string }[] = [
  { value: "", label: "📋 All Tasks" },
  { value: "completed", label: "✅ Completed" },
  { value: "in_progress", label: "⏳ In Progress" },
  { value: "todo", label: "📃 To Do" },
  { value: "overdue", label: "🚨 Overdue" },
  { value: "low", label: "🟢 Low Priority" },
  { value: "medium", label: "🟡 Medium Priority" },
  { value: "high", label: "🔴 High Priority" },
];

const TaskFilter = () => {

  const [searchParams] = useSearchParams();

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);


  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentSearch = searchParams.get("search");
  const currentFilter = searchParams.get("filter");
  const selectedOption = options.find((opt) => opt.value === currentFilter) || options[0];


  return (
    <div className="flex items-center gap-3">
      <label className="text-sm font-medium text-muted-foreground">Filter:</label>

      <div className="relative w-36" ref={dropdownRef}>
        {/* Trigger */}
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between bg-accent border border-border px-3 py-1.5 rounded-md shadow-sm shadow-muted-foreground/50 text-xs hover:border-primary/60 transition-all"
        >
          <span>{selectedOption?.label}</span>
          <ChevronDown
            size={16}
            className={`transition-transform duration-200 ${open && "rotate-180"
              }`}
          />
        </button>

        {/* Dropdown Menu */}
        {open && (
          <div className="absolute mt-2 w-full bg-background shadow-muted-foreground/50 rounded-md shadow-sm z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {options.map((option) => (

              <Link
                to={`/tasks?${currentSearch
                  ? `search=${encodeURIComponent(currentSearch)}&filter=${encodeURIComponent(option.value)}`
                  : `filter=${encodeURIComponent(option.value)}`
                  }`}
                key={option.value}
                onClick={() => {
                  setOpen(false);
                }}
                className={`block w-full text-left px-4 py-2.5 text-xs hover:bg-accent/50 transition-colors ${selectedOption?.value === option.value
                  && "bg-accent text-primary font-medium"
                  }`}
              >
                {option.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskFilter;