## [1.3.0](https://github.com/montyaction/task-management-app/compare/v1.2.1...v1.3.0) (2026-03-02)

### Features

* **frontend:** add reusable skeletons and polished empty task state ([f52c137](https://github.com/montyaction/task-management-app/commit/f52c13773f7e3ae9d04333d9418122fcec55dc3e))
* **tasks:** add due dates and overdue-only filtering ([6c3e24f](https://github.com/montyaction/task-management-app/commit/6c3e24f11cabaeb958ae4b83c084ce4a153a3a38))

# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Historical versions below were reconstructed from commit milestones because release tags were not present.

## [Unreleased]

### Added
- Added Semantic Release configuration (`.releaserc.json`) to automate SemVer bumping and tag creation from Conventional Commits.
- Added release automation workflow (`.github/workflows/release.yml`) for automatic version/tag/release generation on `develop`.
- Added task due-date support (`dueDate`) across task create/update flows and persistence layer.
- Added overdue task highlighting in task cards, including an explicit `Overdue` badge.
- Added dashboard-level **Show Overdue Only** filter for quick triage.
- Added reusable frontend `Skeleton` component for shimmer-based loading placeholders.
- Added dashboard empty-state card with CTA (`Create Your First Task`) for first-time users.

### Changed
- Standardized automated release behavior to align backend/frontend versions and update `CHANGELOG.md` in release commits.
- Updated dashboard drag-and-drop behavior to be disabled when overdue-only filtering is active, preventing ambiguous reorder operations on partial task lists.
- Added task due-date indexing (`user_id + dueDate`) to improve due-date-based query performance.
- Replaced dashboard task-board loading placeholders with production-style skeleton shimmer UI across all columns.

### Documentation
- Consolidated release notes into a single file: `docs/releases/RELEASE_NOTES.md`.
- Updated implementation docs for due dates and overdue filtering behavior.
- Updated architecture, README, and learning journal notes for loading-state and empty-state UX improvements.

## [1.2.1] - 2026-02-27

### Added
- Added backend ESLint flat config (`backend/eslint.config.js`) compatible with ESLint v9.
- Added a GitHub Actions workflow (`.github/workflows/ci.yml`) that installs dependencies, runs lint, executes tests when present, and builds the frontend.

### Changed
- Aligned `backend/package.json` and `frontend/package.json` versions to `1.2.1` (including lockfile metadata) to match release history.
- Reworked `README.md` into a production-ready guide with full setup, API endpoint catalog, deployment options, environment contracts, and contribution workflow.

### Fixed
- Restored backend lint command operability under ESLint v9 by adding the required flat config file.

### Documentation
- Added `ARCHITECTURE.md` as a system-level architecture draft covering frontend/backend flow, state layers, and deployment notes.
- Added `LEARNING.md` to capture architecture decisions, delivery challenges, and operational lessons.

## [1.2.0] - 2026-02-26

### Added
- Added Docker-based backend deployment artifacts (`backend/Dockerfile`, `.dockerignore`) and switched Render configuration to container runtime.
- Added `docker-compose.yml` for local backend container orchestration.
- Added a static backend root welcome page served from `backend/src/public/index.html` for service verification at `/`.

### Changed
- Hardened backend startup and runtime reliability with required environment validation, controlled startup failure handling, and graceful shutdown for process/error signals.
- Upgraded health endpoint to return database state, uptime, and degraded status semantics when DB is not ready.
- Updated local Compose workflow to mount backend source and run `nodemon` for faster development feedback.
- Updated MongoDB connection behavior to disable `autoIndex` in production.

### Removed
- Removed temporary `user.routes.js` placeholder endpoints after consolidating profile handling under authenticated auth routes.

### Performance
- Reduced production database overhead by disabling automatic index creation (`autoIndex`) outside development.

### Security
- Added `helmet` for default security headers.
- Added API throttling with `express-rate-limit`.
- Replaced single-origin CORS config with explicit allowlist validation (supports comma-separated client origins).
- Added explicit backend Node runtime constraint (`22.x`) to reduce deployment environment drift.

## [1.1.0] - 2026-02-20

### Added
- Added app-wide theme modes (`light`, `dark`, `system`) with persisted preference and first-paint theme hydration to avoid flash mismatch.
- Added advanced drag-and-drop UX/accessibility features: keyboard support, drag overlay, drag cancel handling, touch long-press activation, and screen-reader announcements.
- Added `DRAG_AND_DROP_UX_REPORT.md` documenting drag-and-drop architecture and UX checklist decisions.

### Changed
- Expanded dark-mode styling across layout, cards, forms, header/footer, and dashboard surfaces.
- Enhanced drop-zone feedback and drag affordances for clearer status changes during board interactions.

### Fixed
- Restored full-card drag behavior while preserving drag-handle affordance.
- Fixed stale active-drag cleanup paths by handling explicit drag cancel events.

### Performance
- Smoothed DnD interaction through tuned animation timing, auto-scroll behavior, and reduced visual jitter during drag transitions.

## [1.0.0] - 2026-02-19

### Added
- Added persisted Kanban ordering via task `position` support plus bulk reorder API (`PUT /api/tasks/reorder/bulk`).
- Added end-to-end profile management with avatar support (`GET/PUT /api/auth/profile`) and a dedicated profile page.
- Added starter task seeding during registration to improve first-use onboarding.
- Added shared application shell (`AppLayout`) with reusable header/footer and improved responsive navigation.
- Added modern drag-and-drop dependencies (`@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`) for React 18 compatibility.

### Changed
- Migrated frontend drag-and-drop implementation from legacy patterns to dnd-kit.
- Refreshed UI/UX across login, registration, dashboard, and profile views with improved layout hierarchy and mobile behavior.
- Updated task action flow to select-first interactions, improving edit/delete ergonomics on touch devices.

### Fixed
- Fixed registration redirect logic regression (`navigator` typo), then stabilized auth redirects using route-level guards.
- Strengthened auth/profile input normalization and validation (trimmed identifiers, canonicalized email, avatar URL protocol validation, uniqueness checks).

### Refactored
- Refactored auth session persistence into centralized store helpers for token/user lifecycle and API header sync.

### Performance
- Added optimistic local task reorder updates with fallback refetch on persistence failure for faster drag response.
- Reduced avoidable rerenders with targeted memoization and callback stabilization in board/card interactions.

## [0.3.0] - 2025-11-22

### Added
- Added `uiStore` (Zustand) to centralize modal and task-editing UI state.
- Added route-change UI reset component to clear transient UI state during navigation.

### Changed
- Moved UI reset responsibility into auth logout flow for consistent session teardown behavior.

### Fixed
- Resolved stale modal/editing state leakage between routes and user sessions.

### Refactored
- Migrated frontend state management from Context API to Zustand stores (`authStore`, `taskStore`, `boardStore`).
- Replaced fetch-based API utility with centralized Axios client and auth header interceptor.

### Removed
- Removed deprecated `frontend/src/context/AuthContext.jsx` and `frontend/src/lib/api.js` after store/client migration.

### Performance
- Reduced component-level state churn through store-driven global state and lazy auth initialization from local storage.

## [0.2.0] - 2025-09-14

### Added
- Added board domain support with Mongoose model plus protected CRUD endpoints under `/api/boards`.
- Added backend Postman collection for API validation and manual testing.
- Added conventional commit template (`.gitmessage.txt`) and expanded commit category guidance in project docs.

### Refactored
- Renamed backend auth middleware file to `auth.middleware.js` for clearer intent and consistent imports.
- Improved backend error logging with stack output for faster diagnosis.
- Cleaned task controller formatting and response wording for readability and consistency.

## [0.1.0] - 2025-09-11

### Added
- Bootstrapped monorepo with Node/Express/MongoDB backend and React/Vite/Tailwind frontend.
- Implemented initial JWT authentication flow, protected task CRUD API, and base dashboard/login/register screens.
- Added core backend layers: route modules, controllers, models, auth middleware, error handler, DB config, and token utility.
- Added initial project documentation and ignore rules.
