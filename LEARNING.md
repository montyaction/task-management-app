# Developer Learning Journal

## Project Evolution Snapshot

- Active development window: **September 11, 2025 -> February 26, 2026**.
- Total visible history analyzed: **38 commits** across local and remote refs.
- Delivery branch reality: `develop` is the functional integration branch and is currently **ahead of `origin/develop` by 1 commit**.
- Topical branches (`feature/board-crud`, `refactor/frontend-zustand-state-and-api-client`) are fully absorbed into `develop` and now serve as historical checkpoints.
- Branch governance gap observed: local `main` remains at the initial commit while `origin/main` has two additional docs/security-related commits not yet reconciled into `develop`.

## Key Concepts Learned

- **State architecture maturity matters early.** Migrating from Context + ad-hoc local state to Zustand stores reduced coupling and made auth/task/UI behavior more predictable.
- **Drag-and-drop is a systems problem, not just a UI interaction.** Persisted ordering required coordinated schema changes (`position`), API design (`bulk reorder`), optimistic UI strategy, and reconciliation fallback.
- **Security and operability are product features.** Adding Helmet, rate limiting, CORS allowlist control, env validation, and graceful shutdown significantly improved production readiness.
- **UX consistency is a state-management concern.** Route-aware UI resets prevented stale modal/editing state leaks that users experience as random behavior.
- **Docs are part of architecture.** README and architecture artifacts became increasingly important once deployment/runtime complexity grew.

## Technical Challenges Faced

- **React 18 drag-and-drop reliability:** Legacy drag patterns were fragile under modern runtime behavior. Migrating to dnd-kit solved compatibility and maintenance concerns.
- **Task reorder correctness across columns:** Moving tasks between statuses required deterministic index recalculation for both source and destination groups.
- **Session and UI teardown:** Logging out needed to clear auth/session state and transient UI state together to avoid cross-session artifacts.
- **Deployment hardening on Render:** Runtime assumptions (Node version, missing env vars, shutdown behavior, health signaling) had to be made explicit.
- **Responsive interaction design:** Desktop-first task actions had to be redesigned for small screens and touch interactions without losing discoverability.

## Mistakes and Lessons Learned

- A redirect regression (`navigator` typo) highlighted the need for route-level guards and basic smoke checks after auth flow edits.
- Temporary placeholder routes (`user.routes.js`) were introduced and removed quickly; lesson: avoid committing exploratory API stubs without a clear integration plan.
- Documentation drift appeared during rapid iteration (for example, historical references to older DnD tooling after migration); lesson: documentation updates should be part of done criteria.
- Branch divergence (`main` vs `develop`/`origin/main`) exposed release-management risk; lesson: enforce a regular merge/tag/release cadence.

## Architecture Decisions and Why They Were Taken

- **Monorepo split (`backend/`, `frontend/`)** was kept to simplify cross-layer feature work and synchronized release changes.
- **Zustand stores by domain (`auth`, `task`, `ui`, `board`)** were chosen to keep business state local to concern boundaries without Redux-level ceremony.
- **Axios client abstraction with interceptor** centralized token propagation and removed repetitive request plumbing.
- **Bulk reorder endpoint** was chosen over many single-task updates to reduce API chatter and maintain ordering consistency.
- **`/api/health` with DB state and uptime** enabled meaningful platform health checks instead of superficial process liveness.
- **Docker + Render blueprint** was adopted to align local and hosted runtime expectations and reduce deployment drift.

## Performance Optimizations Implemented

- Introduced optimistic local reorder (`applyTaskReorder`) before persistence to make drag interactions feel immediate.
- Added board/card memoization and callback stabilization to reduce unnecessary rerenders under frequent drag events.
- Tuned dnd-kit behavior with improved sensors, collision handling, drag overlay animation, and auto-scroll.
- Reduced production DB overhead by disabling automatic index creation in production mode.

## Tools and Libraries Explored

- **Frontend:** Zustand, Axios, dnd-kit (`core/sortable/utilities`), React Router v6, Tailwind CSS, Vite.
- **Backend:** Express, Mongoose, JWT, bcrypt, Helmet, express-rate-limit, Morgan, CORS.
- **Ops:** Docker, Docker Compose, Render Blueprint (`render.yaml`), Postman collection for endpoint verification.

## Best Practices Discovered

- Keep auth/session persistence logic centralized to avoid token drift between memory, storage, and HTTP headers.
- Treat drag-and-drop as a data consistency workflow, not only a visual interaction.
- Validate critical environment variables at startup; fail fast rather than degrade unpredictably.
- Capture operational concerns (health checks, signal handling, runtime pinning) in code and config, not only in docs.
- Use conventional commit discipline to make historical reconstruction and release documentation straightforward.

## What Should Improve in the Next Version

1. Introduce a tagged release process (`main`/`develop` convergence, SemVer tags, release notes tied to tags) instead of inferred versions.
2. Add automated test coverage for auth, profile updates, task reorder invariants, and route guards (unit + API integration + basic E2E).
3. Reconcile API/client contract mismatches around boards (for example, list endpoint expectations in `boardStore` vs implemented routes).
4. Add request validation layer (schema-based) for backend payloads to reduce controller-level validation repetition.
5. Expand security posture with token expiry strategy, refresh flows, and stricter input validation/policy rules.
6. Keep docs synchronized with implementation by adding a doc review checklist to PR workflow.

## Release Governance Baseline (2026-02-27)

### Challenges Faced

- Backend lint tooling broke after moving to ESLint v9 because the project had no flat config (`eslint.config.js`).
- Release metadata drift appeared between package versions (`1.0.0`) and changelog history (`1.2.0`).
- CI verification was manual because there was no repository workflow under `.github/workflows/`.

### Architecture and Process Decisions

- Adopted a backend ESLint flat config to match current ESLint runtime expectations and keep linting executable in local and CI environments.
- Added one CI workflow that validates both workspaces in a single pipeline run to keep monorepo checks coherent.
- Aligned backend/frontend package versions to `1.2.1` and recorded the governance update in changelog entries to restore semantic version traceability.

### Lessons Learned

- Release history, package manifests, and automation must be updated together; treating them separately causes governance drift.
- CI should execute the same commands used by contributors locally (`npm ci`, lint, test-if-present, build) to reduce integration surprises.
- Documentation updates are part of maintenance work, not follow-up tasks, especially when release or workflow behavior changes.

## Automatic Versioning Enablement (2026-03-01)

### Challenges Faced

- Manual tag/version/changelog updates introduced release timing errors and inconsistent metadata between packages.
- Monorepo release needed a single project version while keeping both workspace manifests in sync.

### Architecture Decisions

- Added Semantic Release config with Conventional Commits rules to compute SemVer bumps automatically.
- Automated backend/frontend version alignment in release prepare step using `npm version --no-git-tag-version`.
- Added a dedicated GitHub Actions release workflow on `develop` to create tags, GitHub releases, and changelog updates.

### Lessons Learned

- Release automation should codify team rules (`feat`/`fix`/`BREAKING`) so version bumps are deterministic.
- Keeping release logic in code (`.releaserc.json`) is more reliable than ad-hoc manual commands.

## Due Date + Overdue Highlight Rollout (2026-03-01)

### Challenges Faced

- Date-only input from HTML forms (`YYYY-MM-DD`) needed strict parsing to avoid timezone-related drift and invalid calendar values.
- Overdue filtering introduced a UX/data-consistency edge case where drag-and-drop reorder in a filtered subset could generate incorrect global positions.
- Card-level overdue visuals needed to stay noticeable without breaking existing priority/status affordances.

### Architecture Decisions

- Added `dueDate: Date | null` to the task model and controller-level parsing/validation for both create and update flows.
- Added shared frontend date helpers (`frontend/src/lib/taskDates.js`) to keep date formatting and overdue detection logic centralized.
- Disabled drag-and-drop interactions while **Show Overdue Only** filter is active to preserve ordering integrity.

### Lessons Learned

- Treat date-only values as explicit domain data, not generic timestamps, and validate them early at API boundaries.
- UI filters that show partial datasets can conflict with reorder semantics; disabling reorder in filtered mode is safer than implicit remapping.
- Small visual indicators (badge + border tone + due-date text color) improve overdue discoverability without adding dashboard clutter.

## Loading + Empty State UX Polish (2026-03-01)

### Challenges Faced

- The dashboard used basic loading placeholders that did not match production-level feedback expectations during task fetch cycles.
- Empty boards had no dedicated first-use guidance, creating a weak onboarding moment for new users.
- UX polish needed to stay consistent with existing Tailwind theme tokens and support both light and dark modes.

### Architecture Decisions

- Introduced a reusable `Skeleton` component as a shared UI primitive for shimmer placeholders.
- Added a dedicated `TaskBoardSkeleton` layout to mirror the real board structure during loading, reducing visual layout shift.
- Added `EmptyTaskState` with a clear CTA (`Create Your First Task`) and integrated it only when task count is zero and loading is complete.

### Lessons Learned

- Reusable loading primitives reduce duplication and keep future loading-state updates consistent across pages.
- Empty-state design is part of product flow, not just fallback UI; a contextual CTA improves first-action conversion.
- Theme-aware shimmer and reduced-motion support should be built into the base style utility, not bolted on per component.
