import { useState } from "react";
import { useAuthStore } from "../store/authStores";
import { useNavigate, Link } from "react-router-dom";
import { 
  Mail, 
  Lock, 
  User, 
  Briefcase, 
  ArrowRight,
  LogIn,
  UserPlus,
  Handshake,
  Eye,
  EyeOff
} from "lucide-react";
import toast from "react-hot-toast";

const LoginPage = () => {
  const { login, register } = useAuthStore();
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    category: ""
  });

  const categories = [
    "plumbing",
    "electrician",
    "cooking",
    "car cleaning",
    "house cleaning",
    "gardening"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isRegister) {
        if (!form.name || !form.email || !form.password) {
          toast.error("Please fill in all fields");
          setIsLoading(false);
          return;
        }
        if (form.role === "helper" && !form.category) {
          toast.error("Please select a category");
          setIsLoading(false);
          return;
        }
        await register(form);
        toast.success("Registration successful!");
      } else {
        if (!form.email || !form.password) {
          toast.error("Please fill in all fields");
          setIsLoading(false);
          return;
        }
        await login(form);
        toast.success("Login successful!");
      }

      const user = useAuthStore.getState().user;

      if (!user) {
        setIsLoading(false);
        return;
      }

      if (user.role === "user") navigate("/user");
      if (user.role === "helper") navigate("/helper");
      if (user.role === "admin") navigate("/admin");
    } catch (error) {
      toast.error(error.message || "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-base-100 to-base-200 flex justify-center items-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent hover:scale-105 transition-transform duration-200">
            <Handshake className="w-8 h-8 text-primary" />
            HelperHub
          </Link>
        </div>

        {/* Card */}
        <div className="card bg-base-100 shadow-2xl border border-base-300">
          <div className="card-body p-6 sm:p-8">
            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold mb-2">
                {isRegister ? "Create Account" : "Welcome Back"}
              </h2>
              <p className="text-base-content/60 text-sm">
                {isRegister 
                  ? "Join HelperHub to get started" 
                  : "Sign in to your account"}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Field (Register Only) */}
              {isRegister && (
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Full Name</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
                    <input
                      type="text"
                      className="input input-bordered w-full pl-10"
                      placeholder="Enter your name"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      required={isRegister}
                    />
                  </div>
                </div>
              )}

              {/* Email Field */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Email</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
                  <input
                    type="email"
                    className="input input-bordered w-full pl-10"
                    placeholder="Enter your email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Password</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
                  <input
                    type={showPassword ? "text" : "password"}
                    className="input input-bordered w-full pl-10 pr-10"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Role Selection (Register Only) */}
              {isRegister && (
                <>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">I want to</span>
                    </label>
                    <select
                      className="select select-bordered w-full"
                      value={form.role}
                      onChange={(e) =>
                        setForm({ ...form, role: e.target.value, category: "" })
                      }
                    >
                      <option value="user">Book Services (User)</option>
                      <option value="helper">Provide Services (Helper)</option>
                    </select>
                  </div>

                  {/* Category Selection (Helper Only) */}
                  {form.role === "helper" && (
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Service Category</span>
                      </label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
                        <select
                          className="select select-bordered w-full pl-10"
                          value={form.category}
                          onChange={(e) =>
                            setForm({ ...form, category: e.target.value })
                          }
                          required
                        >
                          <option value="">Select a category</option>
                          {categories.map((cat) => (
                            <option key={cat} value={cat} className="capitalize">
                              {cat}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Submit Button */}
              <button 
                type="submit"
                className="btn btn-primary w-full gap-2 mt-6"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    {isRegister ? "Creating Account..." : "Signing In..."}
                  </>
                ) : (
                  <>
                    {isRegister ? (
                      <>
                        <UserPlus className="w-5 h-5" />
                        Create Account
                      </>
                    ) : (
                      <>
                        <LogIn className="w-5 h-5" />
                        Sign In
                      </>
                    )}
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            {/* Toggle Register/Login */}
            <div className="divider text-sm text-base-content/60">OR</div>
            <button
              type="button"
              className="btn btn-ghost btn-sm w-full"
              onClick={() => {
                setIsRegister(!isRegister);
                setForm({
                  name: "",
                  email: "",
                  password: "",
                  role: "user",
                  category: ""
                });
              }}
              disabled={isLoading}
            >
              {isRegister
                ? "Already have an account? Sign In"
                : "Don't have an account? Create One"}
            </button>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link to="/" className="text-sm text-base-content/60 hover:text-primary transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;