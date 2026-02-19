import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore.js";
import UserAvatar from "../components/UserAvatar.jsx";

const getInitialForm = (user) => ({
  username: user?.username || "",
  email: user?.email || "",
  avatarUrl: user?.avatarUrl || ""
});

const formatJoinedDate = (value) => {
  if (!value) return "Unknown";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown";
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
};

export default function ProfilePage() {
  const navigate = useNavigate();
  const { token, user, isLoading, fetchProfile, updateProfile } = useAuthStore();
  const [form, setForm] = useState(() => getInitialForm(user));
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const loadProfile = async () => {
      const result = await fetchProfile();
      if (!result.success) {
        setError(result.error);
      } else {
        setError("");
      }
    };
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, navigate]);

  useEffect(() => {
    setForm(getInitialForm(user));
  }, [user]);

  const joinedOn = useMemo(() => formatJoinedDate(user?.createdAt), [user?.createdAt]);
  const isSaveDisabled = isLoading || !form.username.trim() || !form.email.trim();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const result = await updateProfile({
      username: form.username.trim(),
      email: form.email.trim(),
      avatarUrl: form.avatarUrl.trim()
    });

    if (!result.success) {
      setError(result.error);
      return;
    }

    setSuccess("Profile updated successfully.");
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900">Your Profile</h1>
        <p className="text-sm text-slate-600">Manage your account details and avatar used across the app.</p>
      </header>

      <div className="grid gap-6 md:grid-cols-[280px_1fr]">
        <section className="card">
          <div className="flex flex-col items-center gap-3 text-center">
            <UserAvatar user={{ ...user, avatarUrl: form.avatarUrl }} sizeClass="h-24 w-24" textClass="text-2xl" />
            <div>
              <p className="font-semibold text-slate-900">{user?.username || "User"}</p>
              <p className="text-sm text-slate-600">{user?.email}</p>
            </div>
          </div>

          <div className="mt-6 space-y-3 text-sm">
            <div>
              <p className="text-slate-500">User ID</p>
              <p className="font-medium text-slate-900 break-all">{user?.id || "N/A"}</p>
            </div>
            <div>
              <p className="text-slate-500">Member Since</p>
              <p className="font-medium text-slate-900">{joinedOn}</p>
            </div>
          </div>
        </section>

        <section className="card">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Account Details</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="label">Username</label>
              <input
                className="input"
                name="username"
                value={form.username}
                onChange={handleChange}
                autoComplete="username"
                required
              />
            </div>

            <div>
              <label className="label">Email</label>
              <input
                className="input"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </div>

            <div>
              <label className="label">Avatar URL</label>
              <input
                className="input"
                type="url"
                name="avatarUrl"
                value={form.avatarUrl}
                onChange={handleChange}
                placeholder="https://example.com/avatar.jpg"
              />
              <p className="mt-1 text-xs text-slate-500">Use a public http/https image URL.</p>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}
            {success && <p className="text-sm text-emerald-700">{success}</p>}

            <div className="flex flex-wrap gap-2">
              <button className="btn" type="submit" disabled={isSaveDisabled}>
                {isLoading ? "Saving..." : "Save changes"}
              </button>
              <button
                className="btn-outline"
                type="button"
                onClick={() => setForm(getInitialForm(user))}
                disabled={isLoading}
              >
                Reset
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
