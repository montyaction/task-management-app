export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/80 bg-white/65 backdrop-blur dark:border-slate-800 dark:bg-slate-950/40">
      <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-6 text-sm text-slate-600 dark:text-slate-300 md:grid-cols-3 md:px-8">
        <section>
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-900 dark:text-slate-100">Plan Clearly</h2>
          <p>Capture tasks quickly, prioritize by urgency, and keep project momentum visible for your whole team.</p>
        </section>

        <section>
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-900 dark:text-slate-100">Move Faster</h2>
          <p>Drag work between columns to reflect reality in real time and keep everyone aligned on next actions.</p>
        </section>

        <section>
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-900 dark:text-slate-100">Built For Teams</h2>
          <p>Powered by React, Tailwind CSS, Express, MongoDB, and Zustand with secure authentication and profile tools.</p>
        </section>
      </div>

      <div className="border-t border-white/80 px-4 py-3 text-center text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400 md:px-8">
        &copy; {year} Task Management Application
      </div>
    </footer>
  );
}
