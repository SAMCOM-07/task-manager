import { CheckCircle2, Briefcase } from "lucide-react";

export default function LoadingPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-primary/5 via-background to-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo/Icon Section */}
        <div className="flex justify-center">
          <div className="relative w-24 h-24">
            {/* Rotating background circle */}
            <div className="absolute inset-0 rounded-full bg-linear-to-r from-primary/40 to-primary/10 animate-spin"></div>

            {/* Icon container */}
            <div className="absolute inset-0 rounded-full bg-background border-2 border-primary/20 flex items-center justify-center">
              <Briefcase size={48} className="text-primary animate-pulse" />
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-3 text-center">
          <h1 className="text-3xl font-bold text-foreground">Task Dashboard</h1>
          <p className="text-muted-foreground text-lg">Preparing your workspace . . .</p>
        </div>

        {/* Loading Dots Animation */}
        <div className="flex justify-center items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0s" }}></div>
          <div className="w-3 h-3 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0.2s" }}></div>
          <div className="w-3 h-3 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0.4s" }}></div>
        </div>

        {/* Loading Steps */}
        <div className="space-y-3 mt-8">
          <LoadingStep label="Authenticating" completed={true} />
          <LoadingStep label="Loading dashboard" completed={true} />
          <LoadingStep label="Fetching tasks" completed={false} />
        </div>

        {/* Footer text */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            This usually takes a few seconds...
          </p>
        </div>
      </div>
    </div>
  );
}

interface LoadingStepProps {
  label: string;
  completed: boolean;
}

function LoadingStep({ label, completed }: LoadingStepProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-6 h-6 rounded-full flex items-center justify-center border-2 border-primary/40">
        {completed ? (
          <CheckCircle2 size={20} className="text-green-500" />
        ) : (
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
        )}
      </div>
      <span className={`text-sm ${completed ? "text-muted-foreground" : "text-foreground font-medium"}`}>
        {label}
      </span>
    </div>
  );
}
