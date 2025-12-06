import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "../api/apis";
import { useAuth } from "../context/AuthContext";
import { Loader2, Mail, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await authAPI.login(formData);
      console.log("Login successful:", response.data);

      const { user, token } = response.data;

      // Store user data in context
      const loginResult = await login(user, token);

      if (loginResult.success) {
        navigate("/dashboard");
      } else {
        setError("Failed to save login data");
      }
    } catch (err) {
      console.log("Login error:", err);
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Left Side - Visual & Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-muted text-white overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20" />

        {/* Decorative circles */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-500/30 rounded-full blur-3xl opacity-50" />
        <div className="absolute top-1/2 right-0 w-64 h-64 bg-purple-500/30 rounded-full blur-3xl opacity-50" />

        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2 text-white">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
              <span className="font-mono text-lg font-bold">F</span>
            </div>
            <span className="text-2xl font-bold tracking-tight">FINCA.AI</span>
          </Link>
        </div>

        <div className="relative z-10 space-y-6">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl max-w-lg leading-tight">
            Simplify Your <span className="text-indigo-400">Financial</span> Management
          </h1>
          <p className="text-lg text-zinc-400 max-w-md">
            Advanced reports, seamless uploads, and automated processing—all in one place.
          </p>
        </div>

        <div className="relative z-10 text-sm text-zinc-500">
          © 2024 Finca AI Inc. All rights reserved.
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-2 lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight">Welcome back</h2>
            <p className="text-muted-foreground">
              Enter your credentials to access your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 rounded-lg bg-destructive/15 text-destructive text-sm font-medium border border-destructive/20 animate-in fade-in slide-in-from-top-2">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="email">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all hover:border-indigo-400 focus:border-indigo-600"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="password">
                    Password
                  </label>
                  <Link to="/forgot-password" className="text-sm text-indigo-600 hover:text-indigo-500 font-medium">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    id="password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all hover:border-indigo-400 focus:border-indigo-600"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-11"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                <>
                  Sign In <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">Don't have an account? </span>
            <Link to="/signup" className="font-semibold text-indigo-600 hover:text-indigo-500 hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
