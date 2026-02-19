import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore.js";

const highlights = [
  "Track what needs attention now.",
  "Drag tasks smoothly across the board.",
  "Keep priorities visible for the entire team."
];

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading, token } = useAuthStore();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const credentials = { identifier, password };

    const result = await login(credentials);
    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
      <section className="surface fade-up hidden p-7 lg:flex lg:flex-col lg:justify-between xl:p-10">
        <div>
          <p className="badge border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-400/40 dark:bg-sky-500/20 dark:text-sky-100">Welcome Back</p>
          <h1 className="mt-5 max-w-lg text-4xl font-bold text-slate-900 dark:text-slate-100">Keep your team focused with one clear workflow.</h1>
          <p className="mt-4 max-w-xl text-base text-slate-600 dark:text-slate-300">
            Sign in to review pending work, rebalance priorities, and ship progress with confidence.
          </p>
        </div>

        <ul className="mt-8 space-y-3">
          {highlights.map((item) => (
            <li key={item} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
              <span className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-500" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="surface fade-up mx-auto w-full max-w-md p-6 sm:p-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Sign in</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Use your email or username to continue.</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="label" htmlFor="identifier">
              Email or Username
            </label>
            <input
              id="identifier"
              className="input"
              placeholder="you@example.com or yourname"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              autoComplete="username"
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
              autoComplete="current-password"
              required
            />
          </div>

          {error && <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-500/40 dark:bg-rose-950/45 dark:text-rose-200">{error}</p>}

          <button className="btn w-full" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-600 dark:text-slate-300">
          No account?{" "}
          <Link to="/register" className="font-semibold text-sky-700 hover:text-sky-800 dark:text-sky-300 dark:hover:text-sky-200">
            Create one
          </Link>
        </p>
      </section>
    </div>
  );
}
