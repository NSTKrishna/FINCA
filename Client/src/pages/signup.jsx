import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "../api/apis";
import { Loader2, Mail, Lock, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    console.log("Signup data:", formData);
    setIsLoading(true);
    setError("");
    try {
      const response = await authAPI.signup(formData);
      console.log("Signup successful:", response.data);
      navigate("/login");
    }
    catch (err) {
      console.log("Signup error:", err);
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setIsLoading(false);
    }

  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Right Side - Visual & Branding (Swapped for variety or consistent with login) */}
      {/* Let's keep the split screen mainly consistent but maybe swap sides or keep it same. 
          Standard often keeps visual on left. Let's stick to Left for Visual to be consistent. */}

      {/* Left Side - Visual & Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-muted text-white overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 via-teal-500/20 to-blue-500/20" />

        {/* Decorative circles */}
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-green-500/30 rounded-full blur-3xl opacity-50" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/30 rounded-full blur-3xl opacity-50" />

        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2 text-white">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-600">
              <span className="font-mono text-lg font-bold">F</span>
            </div>
            <span className="text-2xl font-bold tracking-tight">FINCA.AI</span>
          </Link>
        </div>

        <div className="relative z-10 space-y-6">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl max-w-lg leading-tight">
            Start Your <span className="text-green-400">Journey</span> Today
          </h1>
          <p className="text-lg text-zinc-400 max-w-md">
            Join thousands of users managing their financial documents with AI-powered intelligence.
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
            <h2 className="text-3xl font-bold tracking-tight">Create an account</h2>
            <p className="text-muted-foreground">
              Enter your details to get started
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
                <label className="text-sm font-medium leading-none" htmlFor="name">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all hover:border-green-400 focus:border-green-600"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none" htmlFor="email">
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
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all hover:border-green-400 focus:border-green-600"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none" htmlFor="password">
                    Password
                  </label>
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
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all hover:border-green-400 focus:border-green-600"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none" htmlFor="confirmPassword">
                    Confirm
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <input
                      id="confirmPassword"
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all hover:border-green-400 focus:border-green-600"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 hover:bg-green-700 text-white h-11"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Sign Up <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">Already have an account? </span>
            <Link to="/login" className="font-semibold text-green-600 hover:text-green-500 hover:underline">
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
