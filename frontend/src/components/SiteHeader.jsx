import { Link, NavLink } from "react-router-dom";
import { useAuthStore } from "../stores/authStore.js";
import UserAvatar from "./UserAvatar.jsx";

const navLinkClass = ({ isActive }) =>
  `text-sm font-medium transition-colors ${
    isActive ? "text-emerald-600" : "text-slate-600 hover:text-slate-900"
  }`;

export default function SiteHeader() {
  const { token, user, logout } = useAuthStore();

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4 md:px-8">
        <div>
          <Link to={token ? "/dashboard" : "/login"} className="text-lg font-semibold text-slate-900">
            Task Management Application
          </Link>
          <p className="text-xs text-slate-500">Organize work, track progress, and finish on time.</p>
        </div>

        {token ? (
          <div className="flex items-center gap-4">
            <NavLink to="/dashboard" className={navLinkClass}>
              Dashboard
            </NavLink>
            <NavLink to="/profile" className={navLinkClass}>
              Profile
            </NavLink>
            <Link to="/profile" className="flex items-center gap-2 rounded-full border border-slate-200 px-2 py-1 hover:bg-slate-50">
              <UserAvatar user={user} sizeClass="h-8 w-8" textClass="text-xs" />
              <span className="hidden text-sm text-slate-700 md:inline">{user?.username || user?.email}</span>
            </Link>
            <button className="btn-outline" onClick={logout}>
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <NavLink to="/login" className={navLinkClass}>
              Sign in
            </NavLink>
            <Link to="/register" className="btn">
              Create account
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
