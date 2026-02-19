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
  const hasChanges = useMemo(
    () =>
      form.username.trim() !== (user?.username || "") ||
      form.email.trim() !== (user?.email || "") ||
      form.avatarUrl.trim() !== (user?.avatarUrl || ""),
    [form.avatarUrl, form.email, form.username, user?.avatarUrl, user?.email, user?.username]
  );

  const isSaveDisabled = isLoading || !form.username.trim() || !form.email.trim() || !hasChanges;

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
    <div className="space-y-5">
      <header className="surface fade-up p-5 sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-700 dark:text-sky-300">Account</p>
        <h1 className="mt-1 text-3xl font-bold text-slate-900 dark:text-slate-100">Your Profile</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Manage your account details and avatar used across the app.</p>
      </header>

      <div className="grid gap-5 lg:grid-cols-[290px_1fr]">
        <section className="surface fade-up p-5">
          <div className="flex flex-col items-center gap-3 text-center">
            <UserAvatar user={{ ...user, avatarUrl: form.avatarUrl }} sizeClass="h-24 w-24" textClass="text-2xl" />
            <div>
              <p className="font-semibold text-slate-900 dark:text-slate-100">{form.username || user?.username || "User"}</p>
              <p className="text-sm text-slate-600 dark:text-slate-300">{form.email || user?.email}</p>
            </div>
          </div>

          <div className="mt-6 space-y-3 text-sm">
            <div>
              <p className="text-slate-500 dark:text-slate-400">User ID</p>
              <p className="font-medium text-slate-900 break-all dark:text-slate-100">{user?.id || "N/A"}</p>
            </div>
            <div>
              <p className="text-slate-500 dark:text-slate-400">Member Since</p>
              <p className="font-medium text-slate-900 dark:text-slate-100">{joinedOn}</p>
            </div>
          </div>
        </section>

        <section className="surface fade-up p-5">
          <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">Account Details</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="label" htmlFor="profile-username">
                Username
              </label>
              <input
                id="profile-username"
                className="input"
                name="username"
                value={form.username}
                onChange={handleChange}
                autoComplete="username"
                required
              />
            </div>

            <div>
              <label className="label" htmlFor="profile-email">
                Email
              </label>
              <input
                id="profile-email"
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
              <label className="label" htmlFor="profile-avatar-url">
                Avatar URL
              </label>
              <input
                id="profile-avatar-url"
                className="input"
                type="url"
                name="avatarUrl"
                value={form.avatarUrl}
                onChange={handleChange}
                placeholder="https://example.com/avatar.jpg"
              />
              <p className="field-hint">Use a public http/https image URL.</p>
            </div>

            {error && <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-500/40 dark:bg-rose-950/45 dark:text-rose-200">{error}</p>}
            {success && <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:border-emerald-500/40 dark:bg-emerald-950/45 dark:text-emerald-200">{success}</p>}

            <div className="flex flex-wrap gap-2">
              <button className="btn" type="submit" disabled={isSaveDisabled}>
                {isLoading ? "Saving..." : "Save changes"}
              </button>
              <button
                className="btn-outline"
                type="button"
                onClick={() => setForm(getInitialForm(user))}
                disabled={isLoading || !hasChanges}
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
