import { Mail, Lock, User, Eye, EyeOff, Loader, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useTask } from "../hooks/useTask";
import Alert from "../components/Alert";
import { useAuth } from "../hooks/useAuth";
import { useUser } from "../hooks/useUser";
import { API_BASE_URL } from "../config/api";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const { setOpenAlert, setAlertDetails, alertDetails } = useTask();
  const { fetchUser } = useUser();
  const { user } = useAuth();

  useEffect(() => {
    fetchUser();
    if (user) {
      navigate("/dashboard");
    }
  }, [navigate, user, fetchUser]);


  // zod schema for validation

  const registerSchema = z.object({
    username: z
      .string()
      .trim()
      .regex(
        /^[a-zA-Z0-9$_-]+$/,
        "Username can only contain letters, numbers, underscores, hyphens, and dollar signs",
      )
      .min(6, "Username must be at least 6 characters long")
      .max(12, "Username cannot exceed 12 characters"),
    email: z.string().email("Invalid email format").transform((email) => email.toLowerCase()),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .max(25, "Password cannot exceed 25 characters"),
  });


  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      username: formData.get("username") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };


    const validation = registerSchema.safeParse(data);

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

      const result = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // credentials: "include",
        body: JSON.stringify(data),
      });


      if (!result.ok) {
        const errorData = await result.json().catch(() => ({}));
        setAlertDetails({
          type: "error",
          message: errorData.error || "An error occurred during registration. Please try again.",
        });
        setOpenAlert(true);
        return;
      }

      const resData = await result.json()
      localStorage.setItem("token", resData.token);

      setOpenAlert(true);
      setAlertDetails({
        type: "success",
        message: "Account created successfully!",
      });

      navigate("/");

      setTimeout(() => {
        fetchUser();
      }, 300)

    } catch (err) {
      console.error("Network Error:", err);
      setOpenAlert(true);
      setAlertDetails({
        type: "error",
        message: "Network error. Please check your connection and try again.",
      });
    } finally {
      setIsLoading(false);
    }

  };

  return (
    <div className="min-h-screen bg-linear-to-br from-background to-muted flex items-center justify-center p-6">

      {/* alert */}
      <Alert details={alertDetails} />

      {/* Back Button */}
      <Link
        to='/'
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
              Create Account
            </h1>
            <p className="text-sm text-muted-foreground">
              Create an account to get started
            </p>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 sm:p-8">

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Username Field */}
            <div>
              <label htmlFor="username" className="form-overlay-label">
                <div className="flex items-center gap-2">
                  <User size={16} className="text-primary" />
                  Username
                </div>
              </label>
              <input
                id="username"
                type="text"
                name="username"
                placeholder="Your username"
                className={`form-overlay-input transition-colors ${errors.username
                  ? "border-destructive focus:ring-destructive"
                  : "border-border focus:ring-primary"
                  }`}
              />
              {errors.username && (
                <p className="text-xs text-wrap text-destructive/75 mt-1.5">{errors.username}</p>
              )}
            </div>


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
                className={`form-overlay-input transition-colors ${errors.email
                  ? "border-destructive focus:ring-destructive"
                  : "border-border focus:ring-primary"
                  }`}
              />
              {errors.email && (
                <p className="text-xs text-destructive/75 mt-1.5">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="form-overlay-label">
                <div className="flex items-center gap-2">
                  <Lock size={16} className="text-primary" />
                  Password
                </div>
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="At least 6 characters"
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
                <p className="text-xs text-destructive/75 mt-1.5">{errors.password}</p>
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
                  Signing up...
                </>
              ) : (
                "Sign Up"
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary hover:text-primary/80 hover:underline font-semibold transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Bottom Accent Line */}
        <div className="h-1 bg-linear-to-r from-primary/50 via-accent/50 to-transparent"></div>
      </div>
    </div>
  );
};

export default RegisterPage;
