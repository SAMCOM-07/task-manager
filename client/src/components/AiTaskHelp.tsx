import { useState, useEffect } from "react";
import { ArrowLeft, Loader2, AlertCircle, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import type { TaskType } from "../types/types";
import { API_BASE_URL } from "../config/api.ts";

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

  useEffect(() => {
    const fetchAIHelp = async () => {
      if (!task) return;

      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`${API_BASE_URL}/api/ai/task-help`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
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
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("AI Help Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAIHelp();
  }, [task]);

  if (!task) return null;

  const markdownComponents = {
    h1: ({ ...props }) => <h1 className="text-2xl font-bold text-foreground mt-4 mb-2" {...props} />,
    h2: ({ ...props }) => <h2 className="text-xl font-bold text-foreground mt-3 mb-2 flex items-center gap-2" {...props} />,
    h3: ({ ...props }) => <h3 className="text-lg font-semibold text-foreground mt-3 mb-2 flex items-center gap-2"><span className="inline-block w-1 h-1 bg-primary rounded-full"></span><span {...props} /></h3>,
    p: ({ ...props }) => <p className="text-foreground/80 leading-relaxed mb-2" {...props} />,
    ul: ({ ...props }) => <ul className="list-disc list-inside space-y-1 ml-2 mb-3" {...props} />,
    ol: ({ ...props }) => <ol className="list-decimal list-inside space-y-1 ml-2 mb-3" {...props} />,
    li: ({ ...props }) => <li className="text-foreground/80" {...props} />,
    code: ({ ...props }) => <code className="bg-accent/50 px-2 py-1 rounded text-sm text-foreground font-mono" {...props} />,
    pre: ({ ...props }) => <pre className="bg-accent/30 p-3 rounded-lg overflow-x-auto mb-3 border border-border/30" {...props} />,
    blockquote: ({ ...props }) => <blockquote className="border-l-4 border-primary pl-4 py-2 italic text-foreground/70 mb-3" {...props} />,
    strong: ({ ...props }) => <strong className="font-semibold text-foreground" {...props} />,
    em: ({ ...props }) => <em className="italic text-foreground/90" {...props} />,
  };

  return (
    <div
      className="bg-card rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-border flex flex-col">
      {/* Header */}
      <div className="sticky top-0 flex items-center gap-3 px-6 py-4 border-b border-border bg-card">
        <button
          onClick={onBack}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="flex items-center gap-2 flex-1">
          <Sparkles size={20} className="text-yellow-500" />
          <div className="flex flex-col">
            <h2 className="text-xl font-bold text-foreground">AI Assistant</h2>
            <p className="text-muted-foreground text-xs">Smart productivity insights</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {loading && (
          <div className="flex flex-col items-center justify-center gap-3 py-12">
            <Loader2 className="animate-spin text-primary" size={32} />
            <p className="text-muted-foreground">Getting AI insights...</p>
          </div>
        )}

        {error && (
          <div className="flex gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/30">
            <AlertCircle className="text-destructive shrink-0 mt-0.5" size={20} />
            <div className="flex-1">
              <p className="font-semibold text-destructive">Error</p>
              <p className="text-sm text-destructive/80">{error}</p>
            </div>
          </div>
        )}

        {!loading && !error && response && (
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown components={markdownComponents}>
              {response}
            </ReactMarkdown>
          </div>
        )}

        {!loading && !error && !response && (
          <p className="text-muted-foreground text-center">No response yet</p>
        )}
      </div>

      {/* Footer */}
      {response && !loading && (
        <div className="sticky bottom-0 px-6 py-4 border-t border-border bg-card/50 backdrop-blur">
          <p className="text-xs text-muted-foreground text-center">
            AI insights powered by GPT-4. For task: <span className="font-semibold">{task.title}</span>
          </p>
        </div>
      )}
    </div>
  );
};