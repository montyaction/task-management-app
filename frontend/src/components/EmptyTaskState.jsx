import { memo } from "react";

function EmptyTaskState({ onCreateClick }) {
  return (
    <section className="surface fade-up px-6 py-10 text-center sm:px-10 sm:py-14">
      <div className="mx-auto max-w-xl">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-100 via-cyan-100 to-emerald-100 text-sky-700 shadow-sm dark:border-sky-500/40 dark:from-sky-500/20 dark:via-cyan-500/15 dark:to-emerald-500/20 dark:text-sky-200">
          <span className="text-xl font-bold">+</span>
        </div>

        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 sm:text-3xl">
          Your task board is ready
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-sm text-slate-600 dark:text-slate-300 sm:text-base">
          Start by adding your first task to organize priorities, track progress, and keep your workflow moving.
        </p>

        <button type="button" className="btn mt-6 px-5 py-2.5 text-sm" onClick={onCreateClick}>
          Create Your First Task
        </button>
      </div>
    </section>
  );
}

export default memo(EmptyTaskState);
