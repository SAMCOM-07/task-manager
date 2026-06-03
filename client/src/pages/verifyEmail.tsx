import { Mail, CheckCircle2, AlertCircle, Loader, ArrowLeft, ExternalLink, Clock } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { API_BASE_URL } from "../config/api";
import Alert from "../components/Alert";
import { useTask } from "../hooks/useTask";

type VerificationState = "pending" | "verifying" | "success" | "error";
type ResendState = "idle" | "loading" | "cooldown" | "success";

interface EmailInfo {
  email: string;
  maskedEmail: string;
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

const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const { token: tokenParam } = useParams<{ token: string }>();
  const { setOpenAlert, setAlertDetails, alertDetails } = useTask();

  // Verification states
  const [verificationState, setVerificationState] = useState<VerificationState>("pending");
  const [errorMessage, setErrorMessage] = useState("");

  // Email info
  const [emailInfo, setEmailInfo] = useState<EmailInfo | null>(null);

  // Resend states
  const [resendState, setResendState] = useState<ResendState>("idle");
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const [linkExpirySeconds, setLinkExpirySeconds] = useState(0);


  // Initialize email from localStorage
  useEffect(() => {
    const pendingEmail = localStorage.getItem("pendingVerificationEmail");
    function setInfo() {
      if (pendingEmail) {
        setEmailInfo({
          email: pendingEmail,
          maskedEmail: maskEmail(pendingEmail),
        });
        // Start 5-minute countdown when email is initially sent
        setLinkExpirySeconds(300);
      } else{
        navigate("/register");
      }
    }
    setInfo();
  }, [navigate]);

  // Auto-verify email if token is in URL
  useEffect(() => {
    const verifyEmailFromToken = async () => {
      if (!tokenParam) {
        return;
      }
      const token = tokenParam;

      setVerificationState("verifying");

      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/verify-email/${token}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          setVerificationState("error");
          setErrorMessage(
            errorData.error || "Email verification failed. Please try again."
          );
          return;
        }

        setVerificationState("success");
        setAlertDetails({
          type: "success",
          message: "Email verified successfully!",
        });
        setOpenAlert(true);

        // Clear localStorage and redirect
        localStorage.removeItem("pendingVerificationEmail");

        setTimeout(() => {
          navigate("/dashboard");
        }, 3000);
      } catch (err) {
        console.error("Verification error:", err);
        setVerificationState("error");
        setErrorMessage("Network error. Please check your connection and try again.");
        setAlertDetails({
          type: "error",
          message: "Network error. Please check your connection and try again.",
        });
        setOpenAlert(true);
      }
    };

    verifyEmailFromToken();
  }, [navigate, setOpenAlert, setAlertDetails, tokenParam]);

  // Handle cooldown timer
  useEffect(() => {
    if (resendState !== "cooldown") return;

    const interval = setInterval(() => {
      setCooldownSeconds((prev) => {
        if (prev <= 1) {
          setResendState("idle");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [resendState]);

  // Handle link expiry timer (5 minutes)
  useEffect(() => {
    if (linkExpirySeconds <= 0) return;

    const interval = setInterval(() => {
      setLinkExpirySeconds((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [linkExpirySeconds]);


  // Handle email resend
  const handleEmailResend = useCallback(async () => {
    if (!emailInfo) {
      setAlertDetails({
        type: "error",
        message: "Email address not found. Please register again.",
      });
      setOpenAlert(true);
      return;
    }

    setResendState("loading");

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/resend-verification-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email: emailInfo.email }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        // setResendState("idle");
        // setAlertDetails({
        //   type: "error",
        //   message: errorData.error || "Failed to resend email. Check your connection and try again.",
        // });
        // setOpenAlert(true);
        throw new Error(errorData.error || "Failed to resend email. Check your connection and try again.");
        return;
      }

      setResendState("success");
      setAlertDetails({
        type: "success",
        message: "Verification email resent! Check your inbox.",
      });
      setOpenAlert(true);

      // Start cooldown
      setCooldownSeconds(60);
      setTimeout(() => {
        setResendState("cooldown");
      }, 500);

      // Start 5-minute expiry countdown
      setLinkExpirySeconds(300);
    } catch (err) {
      console.error("Resend error:", err);
      setResendState("idle");
      setAlertDetails({
        type: "error",
        message: err instanceof Error ? err.message : "Failed to resend email. Check your connection and try again.",
      });
      setOpenAlert(true);
    }
  }, [emailInfo, setOpenAlert, setAlertDetails]);

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-muted/20 to-background flex items-center justify-center p-6">
      <Alert details={alertDetails} />

      {/* Back Button */}
      <Link
        to="/"
        className="absolute top-4 left-4 md:top-6 md:left-6 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft size={20} />
        <span className="hidden sm:inline">Back</span>
      </Link>

      {/* Main Container */}
      <div className="w-full max-w-md">
        {/* Main Card */}
        <div className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-in fade-in-0 zoom-in-95 duration-300">
          {/* Header with gradient */}
          <div className="p-6 bg-linear-to-br from-primary/10 via-accent/5 to-transparent border-b border-border">
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
                Verify Email
              </h1>
              <p className="text-sm text-muted-foreground">
                Confirm your email address to activate your account
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Pending State - Waiting for token or showing resend option */}
            {verificationState === "pending" && (
              <div className="space-y-6">
                {/* Email Icon */}
                <div className="flex justify-center">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center animate-bounce">
                    <Mail size={40} className="text-primary" />
                  </div>
                </div>

                {/* Email Display */}
                {emailInfo && (
                  <div className="text-center space-y-2">
                    <p className="text-sm text-muted-foreground">Verification email sent to</p>
                    <p className="text-lg font-semibold text-foreground">{emailInfo.maskedEmail}</p>
                  </div>
                )}

                {/* Instructions */}
                <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground text-center">
                  <p>Check your inbox for a verification link. Click it to confirm your email address.</p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  {/* Open Gmail Button */}
                  <button
                    onClick={() => window.open("https://mail.google.com/mail/u/0/#inbox", "_blank")}
                    className="w-full px-4 py-3 bg-muted text-foreground rounded-lg font-medium hover:bg-muted/80 transition-colors flex items-center justify-center gap-2 group"
                  >
                    <ExternalLink size={18} className="group-hover:translate-x-0.5 transition-transform" />
                    Open Gmail
                  </button>

                  {/* Resend Button */}
                  <button
                    onClick={handleEmailResend}
                    disabled={resendState === "loading" || resendState === "cooldown"}
                    className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                  >
                    {resendState === "loading" && <Loader size={18} className="animate-spin" />}
                    {resendState === "cooldown" && <Clock size={18} />}
                    {resendState === "loading"
                      ? "Sending..."
                      : resendState === "cooldown"
                        ? `Resend in ${cooldownSeconds}s`
                        : "Resend Email"}
                  </button>
                </div>

                {/* Spam Folder Note */}
                <div className="text-xs text-muted-foreground text-center bg-accent/5 rounded p-3">
                  💡 <span className="font-medium">Tip:</span> Check your spam or promotions folder if you don't see the email.
                </div>
              </div>
            )}

            {/* Verifying State */}
            {verificationState === "verifying" && (
              <div className="space-y-6 text-center">
                <div className="flex justify-center">
                  <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center">
                    <Loader size={40} className="text-accent animate-spin" />
                  </div>
                </div>
                <div>
                  <p className="text-muted-foreground mb-2">Verifying your email...</p>
                  <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-linear-to-r from-primary to-accent animate-pulse" />
                  </div>
                </div>
              </div>
            )}

            {/* Success State */}
            {verificationState === "success" && (
              <div className="space-y-6 text-center">
                <div className="flex justify-center">
                  <div className="w-20 h-20 rounded-full bg-green/10 flex items-center justify-center animate-in zoom-in-0 duration-500">
                    <CheckCircle2 size={40} className="text-green" />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">Email Verified!</h2>
                  <p className="text-muted-foreground mb-4">Your account is now fully activated.</p>
                  <p className="text-sm text-muted-foreground">Redirecting to dashboard...</p>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-green animate-pulse" />
                </div>
              </div>
            )}

            {/* Error State */}
            {verificationState === "error" && (
              <div className="space-y-6 text-center">
                <div className="flex justify-center">
                  <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center">
                    <AlertCircle size={40} className="text-destructive" />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">Verification Failed</h2>
                  <p className="text-muted-foreground mb-6">{errorMessage}</p>

                  <div className="space-y-3">
                    <button
                      onClick={() => setVerificationState("pending")}
                      className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                    >
                      Try Again
                    </button>
                    <button
                      onClick={() => navigate("/dashboard")}
                      className="w-full px-4 py-2 bg-muted text-foreground rounded-lg font-medium hover:bg-muted/80 transition-colors"
                    >
                      Go to Dashboard
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer with Countdown Timer */}
          {verificationState === "success" ? (
            <div className="px-8 py-4 bg-green/10 border-t border-green/20 text-center">
              <p className="text-xs text-green font-medium">✓ Your account is fully activated and ready to use.</p>
            </div>
          ) : (
            <div className="px-8 py-6 bg-linear-to-r from-primary/5 via-transparent to-accent/5 border-t border-border">
              {linkExpirySeconds > 0 ? (
                <div className="space-y-3">
                  {/* Countdown Display */}
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Clock size={16} className={linkExpirySeconds <= 60 ? "text-destructive animate-pulse" : "text-muted-foreground"} />
                      <span className={`font-mono font-bold text-lg ${
                        linkExpirySeconds <= 60 ? "text-destructive" : "text-foreground"
                      }`}>
                        {Math.floor(linkExpirySeconds / 60)}:{String(linkExpirySeconds % 60).padStart(2, "0")}
                      </span>
                    </div>
                    <p className={`text-xs ${linkExpirySeconds <= 60 ? "text-destructive font-medium" : "text-muted-foreground"}`}>
                      Verification link expires in
                    </p>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-1000 ${
                        linkExpirySeconds <= 60
                          ? "bg-destructive"
                          : linkExpirySeconds <= 120
                            ? "bg-orange"
                            : "bg-linear-to-r from-primary to-accent"
                      }`}
                      style={{
                        width: `${(linkExpirySeconds / 300) * 100}%`,
                      }}
                    />
                  </div>

                  {/* Warning Message */}
                  {linkExpirySeconds <= 60 && (
                    <p className="text-xs text-destructive font-medium text-center animate-pulse">
                      ⚠️ Hurry! Link expires soon. Verify now!
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">🔒 Verification link has expired. Please request a new one.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Security Note */}
        <div className="mt-6 p-4 bg-card border border-border rounded-lg text-center text-xs text-muted-foreground">
          <p className="mb-2">🔐 <span className="font-medium">Security:</span></p>
          <p>Never share your verification link with anyone. Task Manager will never ask for your password via email.</p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
