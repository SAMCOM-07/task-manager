import { useEffect } from "react";
import { useTask } from "../hooks/useTask";
import { cn } from "../lib/utils";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import type { AlertType } from "../types/types";

interface AlertProps {
  details: { type: AlertType; message: string } | null;
}

const Alert = ({ details }: AlertProps) => {
  const { openAlert, setOpenAlert } = useTask();

  useEffect(() => {
    if (openAlert) {
      const timer = setTimeout(() => {
        setOpenAlert(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [openAlert, setOpenAlert]);

  const getIcon = (type: AlertType) => {
    switch (type) {
      case "success":
        return <CheckCircle2 size={20} className="shrink-0" />;
      case "error":
        return <AlertCircle size={20} className="shrink-0" />;
      case "info":
        return <Info size={20} className="shrink-0" />;
      default:
        return null;
    }
  };

  const getStyles = (type: AlertType) => {
    switch (type) {
      case "success":
        return {
          container: "border-green/30 bg-green/10 ring-1 ring-green/20",
          icon: "text-green",
          text: "text-green",
        };
      case "error":
        return {
          container: "border-destructive/30 bg-destructive/10 ring-1 ring-destructive/20",
          icon: "text-destructive",
          text: "text-destructive",
        };
      case "info":
        return {
          container: "border-primary/30 bg-primary/10 ring-1 ring-primary/20",
          icon: "text-primary",
          text: "text-primary",
        };
      default:
        return {
          container: "border-muted/30 bg-muted/10 ring-1 ring-muted/20",
          icon: "text-muted-foreground",
          text: "text-muted-foreground",
        };
    }
  };

  const styles = getStyles(details?.type as AlertType);

  return (
    <div>
      <div
        className={cn(
          "z-1000 fixed left-1/2 transform -translate-x-1/2 min-w-75 max-w-sm px-4 py-3 rounded-lg border shadow-lg flex items-center gap-3 transition-all duration-500 backdrop-blur-xs",
          styles.container,
          openAlert ? "top-6 opacity-100 pointer-events-auto" : "-top-20 opacity-0 pointer-events-none"
        )}
      >
        <div className={styles.icon}>{getIcon(details?.type as AlertType)}</div>

        <div className="flex-1">
          <p className={cn("text-sm font-medium leading-3.5", styles.text)}>
            {details?.message}
          </p>
        </div>

        <button
          onClick={() => setOpenAlert(false)}
          className={cn("shrink-0 transition-colors hover:opacity-70")}
        >
          <X size={18} className={styles.icon} />
        </button>
      </div>
    </div>
  );
};

export default Alert;
