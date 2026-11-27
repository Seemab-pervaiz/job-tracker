import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import AuthLayout from "../components/AuthLayout";

const inputClass =
  "w-full bg-[#111927] border border-[#1f293d] rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-[#854d0e] focus:border-[#854d0e] transition shadow-inner";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(name, email, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start organising your job search in minutes."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="text-amber-500 hover:text-amber-400 font-semibold transition ml-1">
            Login
          </Link>
        </>
      }
    >
      {error && (
        <div className="bg-red-950/40 border border-red-800/50 text-red-400 text-sm rounded-xl p-3 mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2">
            Name
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2">
            Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className={`${inputClass} pr-11`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-200 transition cursor-pointer"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-linear-to-r from-[#854d0e] to-[#603014] hover:from-[#92400e] hover:to-[#78350f] text-white font-semibold rounded-xl py-3.5 flex items-center justify-center gap-2 shadow-lg shadow-[#140803]/50 active:scale-[0.99] disabled:opacity-60 transition duration-150 cursor-pointer border border-white/10"
        >
          {loading && <Loader2 className="animate-spin" size={18} />}
          {loading ? "Creating account..." : "Register"}
        </button>
      </form>
    </AuthLayout>
  );
}
