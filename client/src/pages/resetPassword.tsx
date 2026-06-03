import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Lock, Eye, EyeOff, Loader, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import Alert from "../components/Alert";
import { useTask } from "../hooks/useTask";
import PasswordResetEmailForm from "../components/PasswordResetEmailForm";
import EmailSentSuccess from "../components/EmailSentSuccess";
import z from "zod";
import { API_BASE_URL } from "../config/api";

type ResetPasswordState = "email" | "email-success" | "form" | "loading" | "success" | "error";

const passwordSchema = z.object({
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(25, "Password cannot exceed 25 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const ResetPasswordPage = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { setOpenAlert, setAlertDetails, alertDetails } = useTask();

  const [state, setState] = useState<ResetPasswordState>(token ? "form" : "email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [linkExpirySeconds, setLinkExpirySeconds] = useState(0);

  useEffect(() => {
    if (!token && state === "form") {
      setState("error");
      setErrorMessage("Invalid reset link. Please request a new password reset.");
    }
  }, [token, state]);

  // Initialize countdown when email is sent
  useEffect(() => {
    if (state === "email-success" && linkExpirySeconds === 0) {
      setLinkExpirySeconds(600); // 10 minutes
    }
  }, [state, linkExpirySeconds]);

  // Handle link expiry timer
  useEffect(() => {
    if (linkExpirySeconds <= 0) return;
    if (state !== "email-success") return;

    const interval = setInterval(() => {
      setLinkExpirySeconds((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [linkExpirySeconds, state]);

  const handleEmailSubmit = (submittedEmail: string) => {
    setEmail(submittedEmail);
    setState("email-success");
  };

  const handleResendEmail = () => {
    setState("email");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    const validation = passwordSchema.safeParse({
      password,
      confirmPassword,
    });

    if (!validation.success) {
      const newErrors: { [key: string]: string } = {};
      validation.error.issues.forEach((err) => {
        if (err.path[0]) {
          newErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(newErrors);
      return;
    }

    try {
      setIsLoading(true);
      setState("loading");

      const response = await fetch(`${API_BASE_URL}/api/auth/reset-password/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ password: validation.data.password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        setState("error");
        setErrorMessage(errorData.error || "Failed to reset password. Please try again.");
        setAlertDetails({
          type: "error",
          message: errorData.error || "Failed to reset password. Please try again.",
        });
        setOpenAlert(true);
        return;
      }

      setState("success");
      setAlertDetails({
        type: "success",
        message: "Password reset successfully!",
      });
      setOpenAlert(true);

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error("Error:", err);
      setState("error");
      setErrorMessage("An error occurred. Please try again later.");
      setAlertDetails({
        type: "error",
        message: "An error occurred. Please try again later.",
      });
      setOpenAlert(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-background to-muted flex items-center justify-center p-6">
      <Alert details={alertDetails} />

      {/* Back Button */}
      <Link
        to="/login"
        className="absolute top-4 left-4 md:top-6 md:left-6 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft size={20} />
        <span className="hidden sm:inline">Back</span>
      </Link>

      {/* Main Card */}
      <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-in fade-in-0 zoom-in-95 duration-300">
        {/* Header with gradient */}
        <div className="p-6 bg-linear-to-br from-primary/10 via-accent/5 to-transparent border-b border-border">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
              {state === "email" || state === "email-success" ? "Reset Password" : "Create New Password"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {state === "email" && "Enter your email address and we'll send you a secure password reset link."}
              {state === "email-success" && "Check your email for the reset link."}
              {(state === "form" || state === "loading" || state === "success") && "Enter your new password below"}
              {state === "error" && "Something went wrong"}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          {/* Email Form State */}
          {state === "email" && (
            <PasswordResetEmailForm
              onSuccess={handleEmailSubmit}
              setAlertDetails={setAlertDetails}
              setOpenAlert={setOpenAlert}
            />
          )}

          {/* Email Success State */}
          {state === "email-success" && (
            <EmailSentSuccess
              email={email}
              onResend={handleResendEmail}
              setAlertDetails={setAlertDetails}
              setOpenAlert={setOpenAlert}
            />
          )}

          {/* Password Reset Form State */}
          {state === "form" && (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Password Field */}
              <div>
                <label htmlFor="password" className="form-overlay-label">
                  <div className="flex items-center gap-2">
                    <Lock size={16} className="text-primary" />
                    New Password
                  </div>
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`form-overlay-input pr-10 transition-colors ${errors.password
                      ? "border-destructive focus:ring-destructive"
                      : "border-border focus:ring-primary"
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-destructive mt-1.5">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="form-overlay-label">
                  <div className="flex items-center gap-2">
                    <Lock size={16} className="text-primary" />
                    Confirm Password
                  </div>
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`form-overlay-input pr-10 transition-colors ${errors.confirmPassword
                      ? "border-destructive focus:ring-destructive"
                      : "border-border focus:ring-primary"
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-destructive mt-1.5">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-8 py-3 px-4 bg-linear-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader size={18} className="animate-spin" />
                    Resetting Password...
                  </>
                ) : (
                  "Reset Password"
                )}
              </button>

              {/* Back to Login */}
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Back to{" "}
                  <a
                    href="/login"
                    className="text-primary hover:text-primary/80 hover:underline font-semibold transition-colors"
                  >
                    Login
                  </a>
                </p>
              </div>
            </form>
          )}
        </div>

        {/* Countdown Footer - Only show when email is sent */}
        {state === "email-success" && (
          <div className="px-8 py-6 bg-linear-to-r from-primary/5 via-transparent to-accent/5 border-t border-border">
            {linkExpirySeconds > 0 ? (
              <div className="space-y-3">
                {/* Countdown Display */}
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Clock size={16} className={linkExpirySeconds <= 60 ? "text-destructive animate-pulse" : "text-muted-foreground"} />
                    <span className={`font-mono font-bold text-lg ${linkExpirySeconds <= 60 ? "text-destructive" : "text-foreground"
                      }`}>
                      {Math.floor(linkExpirySeconds / 60)}:{String(linkExpirySeconds % 60).padStart(2, "0")}
                    </span>
                  </div>
                  <p className={`text-xs ${linkExpirySeconds <= 60 ? "text-destructive font-medium" : "text-muted-foreground"}`}>
                    Reset link expires in
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-1000 ${linkExpirySeconds <= 60
                      ? "bg-destructive"
                      : linkExpirySeconds <= 120
                        ? "bg-orange"
                        : "bg-linear-to-r from-primary to-accent"
                      }`}
                    style={{
                      width: `${(linkExpirySeconds / 600) * 100}%`,
                    }}
                  />
                </div>

                {/* Warning Message */}
                {linkExpirySeconds <= 60 && (
                  <p className="text-xs text-destructive font-medium text-center animate-pulse">
                    ⚠️ Hurry! Reset link expires soon!
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center">
                <p className="text-xs text-muted-foreground">🔒 Reset link has expired. Please request a new one.</p>
              </div>
            )}
          </div>
        )}

        {state === "loading" && (
          <div className="space-y-6 text-center">
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center">
                <Loader size={40} className="text-accent animate-spin" />
              </div>
            </div>
            <div>
              <p className="text-muted-foreground mb-2">Resetting your password...</p>
              <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-linear-to-r from-primary to-accent animate-pulse" />
              </div>
            </div>
          </div>
        )}

        {state === "success" && (
          <div className="space-y-6 text-center">
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-green/10 flex items-center justify-center animate-in zoom-in-0 duration-500">
                <CheckCircle2 size={40} className="text-green" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Password Reset!</h2>
              <p className="text-muted-foreground mb-4">Your password has been successfully reset.</p>
              <p className="text-sm text-muted-foreground">Redirecting to login...</p>
            </div>
          </div>
        )}

        {state === "error" && (
          <div className="space-y-6 text-center">
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertCircle size={40} className="text-destructive" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Reset Failed</h2>
              <p className="text-muted-foreground mb-6">{errorMessage}</p>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setState("email");
                    setErrorMessage("");
                  }}
                  className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  Request New Link
                </button>
                <button
                  onClick={() => navigate("/login")}
                  className="w-full px-4 py-2 bg-muted text-foreground rounded-lg font-medium hover:bg-muted/80 transition-colors"
                >
                  Back to Login
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Accent Line */}
      <div className="h-1 bg-linear-to-r from-primary/50 via-accent/50 to-transparent"></div>
    </div>
  );
};

export default ResetPasswordPage;
