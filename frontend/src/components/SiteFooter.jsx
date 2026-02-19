export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/80 bg-white/65 backdrop-blur">
      <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-6 text-sm text-slate-600 md:grid-cols-3 md:px-8">
        <section>
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-900">Plan Clearly</h2>
          <p>Capture tasks quickly, prioritize by urgency, and keep project momentum visible for your whole team.</p>
        </section>

        <section>
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-900">Move Faster</h2>
          <p>Drag work between columns to reflect reality in real time and keep everyone aligned on next actions.</p>
        </section>

        <section>
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-900">Built For Teams</h2>
          <p>Powered by React, Tailwind CSS, Express, MongoDB, and Zustand with secure authentication and profile tools.</p>
        </section>
      </div>

      <div className="border-t border-white/80 px-4 py-3 text-center text-xs text-slate-500 md:px-8">
        &copy; {year} Task Management Application
      </div>
    </footer>
  );
}
