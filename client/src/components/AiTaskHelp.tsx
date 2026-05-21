import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  AlertCircle,
  Clock3,
  Loader2,
  RefreshCcw,
  Sparkles,
  Zap,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import type { TaskType } from "../types/types.ts";
import { API_BASE_URL } from "../config/api.ts";
import { cn } from "../lib/utils.ts";

interface AiTaskHelpProps {
  task: TaskType | null;
  onBack: () => void;
}

interface AIResponse {
  response: string;
}

export const AiTaskHelp = ({ task, onBack }: AiTaskHelpProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [copied, setCopied] = useState(false);

  // Memoize task metadata to avoid recalculating on every render
  const taskMeta = useMemo(() => {
    const dueDate = new Date(task!.due_date);
    const formattedDueDate = Number.isNaN(dueDate.getTime())
      ? "No due date"
      : dueDate.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });

    return {
      formattedDueDate,
      isOverdue:
        !Number.isNaN(dueDate.getTime()) && dueDate < new Date() && task?.status !== "completed",
    };
  }, [task]);

  // Fetch AI help when task changes or refreshKey increments
  useEffect(() => {
    const controller = new AbortController();

    const fetchAIHelp = async () => {
      setLoading(true);
      setError(null);
      setResponse(null);

      if (!task) return;

      try {
        const res = await fetch(`${API_BASE_URL}/api/ai/task-help`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          signal: controller.signal,
          body: JSON.stringify({
            title: task.title,
            description: task.description,
          }),
        });

        if (!res.ok) {
          throw new Error("Failed to fetch AI help");
        }

        const data: AIResponse = await res.json();
        setResponse(data.response);
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err instanceof Error ? err.message : "An error occurred");
          console.error("AI Help Error:", err);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchAIHelp();
    return () => controller.abort();
  }, [task, refreshKey]);

  // Reset copied state after a short delay
  useEffect(() => {
    if (!copied) return;

    const timeoutId = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(timeoutId);
  }, [copied]);

  const handleCopyResponse = async () => {
    if (!response) return;

    await navigator.clipboard.writeText(response);
    setCopied(true);
  };

  if (!task) return null;

  const markdownComponents = {
    h1: ({ ...props }) => <h1 className="mt-6 mb-3 text-xl font-bold tracking-tight text-foreground" {...props} />,
    h2: ({ ...props }) => <h2 className="mt-6 mb-3 flex items-center gap-2 text-lg font-bold text-foreground" {...props} />,
    h3: ({ ...props }) => (
      <h3 className="mt-4 mb-2 flex items-center gap-2 text-lg font-semibold text-foreground" {...props}>
        <span className="inline-block h-2 w-2 rounded-full bg-primary" />
      </h3>
    ),
    p: ({ ...props }) => <p className="mb-3 leading-normal text-foreground/80" {...props} />,
    ul: ({ ...props }) => <ul className="mb-4 ml-5 list-disc space-y-2 text-foreground/80" {...props} />,
    ol: ({ ...props }) => <ol className="mb-4 ml-5 list-decimal space-y-2 text-foreground/80" {...props} />,
    li: ({ ...props }) => <li className="pl-1 text-foreground/80" {...props} />,
    code: ({ ...props }) => <code className="rounded-md bg-accent/60 px-2 py-0.5 font-mono text-sm text-foreground" {...props} />,
    pre: ({ ...props }) => <pre className="mb-4 overflow-x-auto rounded-2xl border border-border/60 bg-background/80 p-4 text-sm shadow-sm" {...props} />,
    blockquote: ({ ...props }) => <blockquote className="mb-4 rounded-r-2xl border-l-4 border-primary bg-primary/8 px-4 py-3 italic text-foreground/75" {...props} />,
    strong: ({ ...props }) => <strong className="font-semibold text-foreground" {...props} />,
    em: ({ ...props }) => <em className="italic text-foreground/90" {...props} />,
  };

  return (
    <div className="relative flex w-full max-w-4xl flex-col overflow-hidden rounded-4xl border border-border/80 bg-card shadow-[0_30px_120px_rgba(0,0,0,0.18)] max-h-[90vh]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.12),transparent_35%),radial-gradient(circle_at_top_right,rgba(59,130,246,0.10),transparent_30%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-linear-to-br from-primary/18 via-primary/5 to-transparent" />

      <div className="sticky top-0 z-10 flex items-start gap-3 border-b border-border/80 bg-card/95 px-6 py-5 backdrop-blur">
        <button
          onClick={onBack}
          className="mt-1 rounded-full border border-border bg-background/80 p-2 text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Go back"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Sparkles size={14} />
              AI Assistant
            </span>
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
                taskMeta.isOverdue ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground"
              )}
            >
              <Clock3 size={14} />
              Due {taskMeta.formattedDueDate}
            </span>
          </div>

          <div className="min-w-0">
            <h2 className="truncate text-xl font-bold tracking-tight text-foreground">{task.title}</h2>
            <p className="mt-1 max-w-2xl text-xs leading-tight text-muted-foreground">
              A focused answer shaped around this task, with the next step, blockers, and a simple way to get moving.
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="mb-6 gap-3 text-sm">
          <div className="rounded-3xl border border-border/80 bg-background/75 p-5 shadow-sm backdrop-blur-sm">
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <Zap size={14} />
              How to use this
            </div>
            <p className="text-sm leading-relaxed text-foreground/80">Use the answer below to decide what to do first, what to ignore, and what finished looks like.</p>
            <div className="mt-4 flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <span className="inline-flex h-2 w-2 rounded-full bg-green" />
              Optimized for fast action
            </div>
          </div>
        </div>

        {loading && (
          <div className="rounded-[1.75rem] border border-border/80 bg-linear-to-br from-background via-background to-muted/35 p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <Loader2 className="animate-spin text-primary" size={22} />
              <div>
                <p className="font-semibold text-foreground">Thinking through the task</p>
                <p className="text-sm text-muted-foreground">Generating a practical breakdown and recommended next steps.</p>
              </div>
            </div>

            <div className="mt-6 grid gap-3">
              <div className="h-4 w-5/6 animate-pulse rounded-full bg-muted" />
              <div className="h-4 w-full animate-pulse rounded-full bg-muted" />
              <div className="h-4 w-4/5 animate-pulse rounded-full bg-muted" />
              <div className="h-24 animate-pulse rounded-2xl bg-muted/80" />
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-[1.75rem] border border-destructive/30 bg-destructive/10 p-4 shadow-sm">
            <div className="flex gap-3">
              <AlertCircle className="mt-0.5 shrink-0 text-destructive" size={20} />
              <div className="flex-1">
                <p className="font-semibold text-destructive">Could not load AI help</p>
                <p className="mt-1 text-sm text-destructive/80">{error}</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    onClick={() => setRefreshKey((current) => current + 1)}
                    className="inline-flex items-center gap-2 rounded-full bg-destructive px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-destructive/90"
                  >
                    <RefreshCcw size={16} />
                    Try again
                  </button>
                  <button
                    onClick={onBack}
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                  >
                    Go back
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {!loading && !error && response && (
          <div className="rounded-[1.75rem] border border-border/80 bg-background/90 p-4 shadow-sm backdrop-blur-sm">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Sparkles size={16} className="text-primary" />
                AI guidance
              </div>
              <button
                onClick={handleCopyResponse}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
              >
                {copied ? "Copied" : "Copy response"}
              </button>
            </div>
            <div className="max-w-none text-sm leading-relaxed text-foreground/90">
              <ReactMarkdown components={markdownComponents}>{response}</ReactMarkdown>
            </div>
          </div>
        )}

        {!loading && !error && !response && (
          <div className="rounded-[1.75rem] border border-border/80 bg-background/70 px-6 py-10 text-center shadow-sm">
            <p className="text-sm font-medium text-foreground">No guidance available yet</p>
            <p className="mt-1 text-sm text-muted-foreground">AI insights will appear here once the request finishes.</p>
          </div>
        )}
      </div>

      {response && !loading && (
        <div className="sticky bottom-0 border-t border-border/80 bg-card/95 px-6 py-4 backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
            <p>Generated for "{task.title}"</p>
            <button
              onClick={() => setRefreshKey((current) => current + 1)}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 font-medium text-foreground transition-colors hover:bg-muted"
            >
              <RefreshCcw size={14} />
              Regenerate
            </button>
          </div>
        </div>
      )}
    </div>
  );
};