import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore.js";

const highlights = [
  "Create structured task boards in minutes.",
  "Prioritize high-impact work with confidence.",
  "Keep your project delivery status always visible."
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { register, isLoading, token } = useAuthStore();

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const userData = { username, email, password };

    const result = await register(userData);

    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
      <section className="surface fade-up mx-auto w-full max-w-md p-6 sm:p-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Create account</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Start organizing work in a focused, collaborative flow.</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="label" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              className="input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </div>

          <div>
            <label className="label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div>
            <label className="label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
              minLength={6}
            />
            <p className="field-hint">Use at least 6 characters.</p>
          </div>

          {error && <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-500/40 dark:bg-rose-950/45 dark:text-rose-200">{error}</p>}

          <button className="btn w-full" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create account"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-600 dark:text-slate-300">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-sky-700 hover:text-sky-800 dark:text-sky-300 dark:hover:text-sky-200">
            Sign in
          </Link>
        </p>
      </section>

      <section className="surface fade-up hidden p-7 lg:flex lg:flex-col lg:justify-between xl:p-10">
        <div>
          <p className="badge border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/40 dark:bg-emerald-500/20 dark:text-emerald-100">Get Started</p>
          <h2 className="mt-5 max-w-lg text-4xl font-bold text-slate-900 dark:text-slate-100">Build a calmer workflow for your projects.</h2>
          <p className="mt-4 max-w-xl text-base text-slate-600 dark:text-slate-300">
            Set up your account and bring planning, execution, and delivery into one streamlined dashboard.
          </p>
        </div>

        <ul className="mt-8 space-y-3">
          {highlights.map((item) => (
            <li key={item} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
              <span className="mt-1 h-2.5 w-2.5 rounded-full bg-sky-500" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
