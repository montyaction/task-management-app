import { Outlet } from "react-router-dom";
import SiteHeader from "./SiteHeader.jsx";
import SiteFooter from "./SiteFooter.jsx";

export default function AppLayout() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-clip text-slate-900 dark:text-slate-100">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-24 -top-20 h-72 w-72 rounded-full bg-sky-300/20 blur-3xl dark:bg-sky-500/15" />
        <div className="absolute -right-20 top-12 h-64 w-64 rounded-full bg-emerald-300/20 blur-3xl dark:bg-emerald-500/10" />
        <div className="absolute bottom-10 left-1/3 h-60 w-60 rounded-full bg-cyan-200/20 blur-3xl dark:bg-cyan-500/10" />
      </div>

      <SiteHeader />
      <main className="flex-1 w-full">
        <div className="mx-auto w-full max-w-7xl px-4 pb-8 pt-5 md:px-8 md:pb-10 md:pt-8">
          <Outlet />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
