export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-6 text-sm text-slate-600 md:grid-cols-3 md:px-8">
        <div>
          <h2 className="mb-2 font-semibold text-slate-900">About This App</h2>
          <p>
            This task manager gives teams one place to plan work, move tasks across a Kanban workflow, and stay aligned
            on delivery.
          </p>
        </div>

        <div>
          <h2 className="mb-2 font-semibold text-slate-900">What You Can Do</h2>
          <p>Register securely, create and edit tasks, drag items between columns, and keep priorities visible.</p>
        </div>

        <div>
          <h2 className="mb-2 font-semibold text-slate-900">Tech Stack</h2>
          <p>Built with React, Vite, Tailwind CSS, Node.js, Express, MongoDB, and Zustand state management.</p>
        </div>
      </div>

      <div className="border-t border-slate-200 px-4 py-3 text-center text-xs text-slate-500 md:px-8">
        &copy; {year} Task Management Application. All rights reserved.
      </div>
    </footer>
  );
}

