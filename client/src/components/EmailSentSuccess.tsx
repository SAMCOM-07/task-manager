import { CheckCircle2, Loader, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config/api";

interface EmailSentSuccessProps {
  email: string;
  onResend: () => void;
  setAlertDetails: (details: {
    type: "success" | "error" | "info";
    message: string;
  }) => void;
  setOpenAlert: (open: boolean) => void;
}

// Utility to mask email
const maskEmail = (email: string): string => {
  const [localPart, domain] = email.split("@");
  if (localPart.length <= 3) {
    return `${localPart}****@${domain}`;
  }
  const visible = localPart.substring(0, 3);
  return `${visible}${"*".repeat(Math.max(2, localPart.length - 3))}@${domain}`;
};

const EmailSentSuccess = ({
  email,
  // onResend,
  setAlertDetails,
  setOpenAlert,
}: EmailSentSuccessProps) => {
  const navigate = useNavigate();
  const [cooldownSeconds, setCooldownSeconds] = useState(60);
  const [isResending, setIsResending] = useState(false);

  // Countdown timer for resend button
  useEffect(() => {
    if (cooldownSeconds <= 0) return;

    const interval = setInterval(() => {
      setCooldownSeconds((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [cooldownSeconds]);

  const handleResendEmail = async () => {
    try {
      setIsResending(true);

      const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        setAlertDetails({
          type: "error",
          message: errorData.error || "Failed to resend email. Please try again.",
        });
        setOpenAlert(true);
        return;
      }

      setAlertDetails({
        type: "success",
        message: "Password reset link sent again!",
      });
      setOpenAlert(true);

      // Reset cooldown
      setCooldownSeconds(60);
    } catch (err) {
      console.error("Error:", err);
      setAlertDetails({
        type: "error",
        message: "An error occurred. Please try again later.",
      });
      setOpenAlert(true);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="space-y-6 text-center">
      {/* Success Icon */}
      <div className="flex justify-center">
        <div className="w-20 h-20 rounded-full bg-green/10 flex items-center justify-center animate-in zoom-in-0 duration-500">
          <CheckCircle2 size={40} className="text-green" />
        </div>
      </div>

      {/* Title and Description */}
      <div className="space-y-3">
        <h2 className="text-2xl font-bold text-foreground">Check Your Email</h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          We've sent a password reset link to your email address. Click the link in the email to create a new password.
        </p>
      </div>

      {/* Masked Email Display */}
      <div className="bg-muted/50 rounded-lg p-4">
        <p className="text-xs text-muted-foreground mb-1">Reset link sent to</p>
        <p className="text-base font-semibold text-foreground">{maskEmail(email)}</p>
      </div>

      {/* Spam Folder Note */}
      <div className="text-xs text-muted-foreground text-center bg-accent/5 rounded p-3">
        💡 <span className="font-medium">Tip:</span> Check your spam or promotions folder if you don't see the email.
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pt-2">
        {/* Resend Button with Cooldown */}
        <button
          onClick={handleResendEmail}
          disabled={cooldownSeconds > 0 || isResending}
          className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {isResending ? (
            <>
              <Loader size={18} className="animate-spin" />
              Sending...
            </>
          ) : cooldownSeconds > 0 ? (
            <>
              <Clock size={18} />
              Resend in {cooldownSeconds}s
            </>
          ) : (
            "Resend Email"
          )}
        </button>

        {/* Back to Login Button */}
        <button
          onClick={() => navigate("/login")}
          className="w-full px-4 py-3 bg-muted text-foreground rounded-lg font-medium hover:bg-muted/80 transition-colors"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default EmailSentSuccess;
