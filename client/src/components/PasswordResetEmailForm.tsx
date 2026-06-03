import { Mail, Loader } from "lucide-react";
import { useState } from "react";
import z from "zod";
import { API_BASE_URL } from "../config/api";

interface ForgotPasswordFormProps {
  onSuccess: (email: string) => void;
  setAlertDetails: (details: {
    type: "success" | "error" | "info";
    message: string;
  }) => void;
  setOpenAlert: (open: boolean) => void;
}

const emailSchema = z.object({
  email: z.string().email("Invalid email format").transform((email) => email.toLowerCase()),
});

const PasswordResetEmailFor = ({
  onSuccess,
  setAlertDetails,
  setOpenAlert,
}: ForgotPasswordFormProps) => {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    const validation = emailSchema.safeParse({ email });

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

      const response = await fetch(`${API_BASE_URL}/api/auth/password-reset-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email: validation.data.email }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        setAlertDetails({
          type: "error",
          message: errorData.error || "Failed to send reset link. Please try again.",
        });
        setOpenAlert(true);
        return;
      }

      setAlertDetails({
        type: "success",
        message: "Password reset link sent successfully!",
      });
      setOpenAlert(true);

      // Delay to show the alert before transitioning
      setTimeout(() => {
        onSuccess(validation.data.email);
      }, 500);
    } catch (err) {
      console.error("Error:", err);
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
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Email Field */}
      <div>
        <label htmlFor="email" className="form-overlay-label">
          <div className="flex items-center gap-2">
            <Mail size={16} className="text-primary" />
            Email Address
          </div>
        </label>
        <input
          id="email"
          type="email"
          name="email"
          placeholder="example@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`form-overlay-input transition-colors ${
            errors.email
              ? "border-destructive focus:ring-destructive"
              : "border-border focus:ring-primary"
          }`}
        />
        {errors.email && (
          <p className="text-xs text-destructive mt-1.5">{errors.email}</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading || !email.trim()}
        className="w-full mt-8 py-3 px-4 bg-linear-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <Loader size={18} className="animate-spin" />
            Sending Link...
          </>
        ) : (
          "Send Reset Link"
        )}
      </button>

      {/* Back to Login */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Remember your password?{" "}
          <a
            href="/login"
            className="text-primary hover:text-primary/80 hover:underline font-semibold transition-colors"
          >
            Back to Login
          </a>
        </p>
      </div>
    </form>
  );
};

export default PasswordResetEmailFor;
