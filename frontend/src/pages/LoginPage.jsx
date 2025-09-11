import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../lib/api.js";

export default function LoginPage() {
  const navigate = useNavigate();
  const { setToken, setUser } = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api("/api/auth/login", {
        method: "POST",
        body: { identifier, password }
      });
      setToken(res.token);
      setUser(res.user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="card w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-6 text-center">Sign in</h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="label">Email or Username</label>
            <input
              className="input"
              placeholder="you@example.com or yourname"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label">Password</label>
            <input
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button className="btn w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <p className="text-sm text-center mt-4">
          No account?{" "}
          <Link to="/register" className="text-emerald-600 underline">Create one</Link>
        </p>
      </div>
    </div>
  );
}
