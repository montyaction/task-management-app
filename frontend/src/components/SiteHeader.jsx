import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuthStore } from "../stores/authStore.js";
import UserAvatar from "./UserAvatar.jsx";

const navLinkClass = ({ isActive }) =>
  `rounded-full px-3 py-1.5 text-sm font-semibold transition ${
    isActive
      ? "bg-sky-100 text-sky-700 shadow-[inset_0_0_0_1px_rgba(14,165,233,0.2)]"
      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
  }`;

const mobileNavLinkClass = ({ isActive }) =>
  `block rounded-xl px-3 py-2 text-sm font-semibold transition ${
    isActive
      ? "bg-sky-100 text-sky-700 shadow-[inset_0_0_0_1px_rgba(14,165,233,0.22)]"
      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
  }`;

export default function SiteHeader() {
  const { token, user, logout } = useAuthStore();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const identity = user?.username || user?.email || "Account";
  const email = user?.email || "";

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname, token]);

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/80 bg-white/75 backdrop-blur-xl">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8">
        <div className="flex items-center justify-between gap-3 py-3">
          <Link to={token ? "/dashboard" : "/login"} className="min-w-0">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-sky-700">Task Flow</p>
            <p className="truncate text-lg font-bold text-slate-900">Task Management Application</p>
            <p className="hidden text-xs text-slate-500 sm:block">Focus on clear priorities and smooth delivery.</p>
          </Link>

          {token ? (
            <>
              <Link
                to="/profile"
                className="inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-white/90 transition hover:border-slate-300 hover:bg-white md:hidden"
                aria-label="Open profile"
              >
                <UserAvatar user={user} sizeClass="h-8 w-8" textClass="text-xs" />
              </Link>

              <button
                className="btn-outline px-2.5 py-1 md:hidden"
                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                type="button"
                aria-expanded={isMobileMenuOpen}
                aria-label="Toggle navigation menu"
              >
                {isMobileMenuOpen ? "Close" : "Menu"}
              </button>

              <div className="hidden flex-wrap items-center justify-end gap-2 md:flex">
                <nav className="flex items-center gap-1 rounded-full border border-slate-200/80 bg-slate-100/85 p-1">
                  <NavLink to="/dashboard" className={navLinkClass}>
                    Dashboard
                  </NavLink>
                  <NavLink to="/profile" className={navLinkClass}>
                    Profile
                  </NavLink>
                </nav>

                <Link
                  to="/profile"
                  className="inline-flex max-w-[190px] items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-2 py-1 transition hover:border-slate-300 hover:bg-white"
                >
                  <UserAvatar user={user} sizeClass="h-8 w-8" textClass="text-xs" />
                  <span className="hidden truncate text-sm font-medium text-slate-700 md:inline">{identity}</span>
                </Link>

                <button className="btn-outline" onClick={handleLogout}>
                  Log out
                </button>
              </div>
            </>
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

        {token && isMobileMenuOpen && (
          <div className="pb-3 md:hidden">
            <div className="surface rounded-2xl p-3">
              <div className="mb-3 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2">
                <UserAvatar user={user} sizeClass="h-8 w-8" textClass="text-xs" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-800">{identity}</p>
                  {email && <p className="truncate text-xs text-slate-500">{email}</p>}
                </div>
              </div>

              <nav className="space-y-1">
                <NavLink
                  to="/dashboard"
                  className={mobileNavLinkClass}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </NavLink>
                <NavLink
                  to="/profile"
                  className={mobileNavLinkClass}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Profile
                </NavLink>
              </nav>

              <button className="btn-outline mt-3 w-full justify-center" onClick={handleLogout}>
                Log out
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
