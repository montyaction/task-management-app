import { memo } from "react";
import Skeleton from "./Skeleton.jsx";

const COLUMN_KEYS = ["to-do", "in-progress", "completed"];

function TaskBoardSkeleton() {
  return (
    <div
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
      role="status"
      aria-live="polite"
      aria-label="Loading tasks"
    >
      {COLUMN_KEYS.map((columnKey) => (
        <section key={columnKey} className="surface p-3 sm:p-4">
          <div className="mb-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-2.5 w-2.5 rounded-full" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-5 w-9 rounded-full" />
            </div>
            {columnKey === "to-do" ? <Skeleton className="h-7 w-14" /> : null}
          </div>

          <Skeleton className="mb-3 h-3 w-40" />

          <div className="min-h-[170px] space-y-2 rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-2.5 dark:border-slate-700 dark:bg-slate-900/40">
            <div className="rounded-2xl border border-slate-200/90 bg-white px-4 py-3.5 dark:border-slate-700 dark:bg-slate-900">
              <Skeleton className="h-4 w-3/5" />
              <Skeleton className="mt-2 h-3 w-full" />
              <Skeleton className="mt-1.5 h-3 w-4/5" />
              <div className="mt-4 flex items-center justify-between">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-5 w-14 rounded-full" />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200/90 bg-white px-4 py-3.5 dark:border-slate-700 dark:bg-slate-900">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="mt-2 h-3 w-5/6" />
              <Skeleton className="mt-1.5 h-3 w-2/3" />
              <div className="mt-4 flex items-center justify-between">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}

export default memo(TaskBoardSkeleton);
