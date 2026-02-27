# Release Notes

This file centralizes all tagged releases for the project.

## Release Index

| Version | Date | Tag Target Commit |
| --- | --- | --- |
| `v1.2.1` | 2026-02-27 | `8d4f907` |
| `v1.2.0` | 2026-02-26 | `0a50984` |
| `v1.1.0` | 2026-02-20 | `d17980c` |
| `v1.0.0` | 2026-02-19 | `b984c13` |
| `v0.3.0` | 2025-11-22 | `ea9cd06` |
| `v0.2.0` | 2025-09-14 | `0de4462` |
| `v0.1.0` | 2025-09-11 | `d4aff11` |

## v1.2.1 (2026-02-27)

### Added

- Backend ESLint flat config (`backend/eslint.config.js`) compatible with ESLint v9.
- GitHub Actions workflow (`.github/workflows/ci.yml`) for install, lint, test-if-present, and frontend build.

### Changed

- Aligned backend and frontend package versions to `1.2.1`, including lockfile metadata.
- Updated governance documentation in README, CHANGELOG, and LEARNING journal.

### Fixed

- Restored backend lint command operability under ESLint v9.

## v1.2.0 (2026-02-26)

### Added

- Docker-based backend deployment artifacts and Render runtime configuration.
- `docker-compose.yml` for local backend orchestration.
- Backend root welcome page at `/`.

### Changed

- Hardened backend startup flow with env validation and graceful shutdown handling.
- Improved health endpoint to return DB state, uptime, and degraded semantics.
- Tuned local Docker Compose workflow for nodemon-based development.
- Disabled automatic MongoDB index creation in production.

### Removed

- Removed temporary `user.routes.js` placeholders after consolidating profile handling.

### Performance

- Reduced production DB overhead by disabling `autoIndex`.

### Security

- Added Helmet, API rate limiting, and explicit CORS allowlist validation.
- Added backend Node runtime constraint (`22.x`).

## v1.1.0 (2026-02-20)

### Added

- App-wide theme modes (`light`, `dark`, `system`) with persisted preference.
- Improved drag-and-drop accessibility and UX (keyboard support, overlay, cancel flow, touch activation, screen reader announcements).
- `DRAG_AND_DROP_UX_REPORT.md`.

### Changed

- Expanded dark-mode styling coverage across the app.
- Improved drop-zone feedback and drag affordances.

### Fixed

- Restored full-card drag behavior while keeping drag-handle affordance.
- Fixed stale active-drag cleanup via drag cancel handling.

### Performance

- Smoothed DnD interaction with tuned animation timing and reduced jitter.

## v1.0.0 (2026-02-19)

### Added

- Persistent Kanban ordering with task `position` and bulk reorder API.
- Profile APIs and dedicated profile page with avatar support.
- Starter task seeding for new users.
- Shared application shell (`AppLayout`) with reusable header/footer.
- dnd-kit dependencies for React 18 compatibility.

### Changed

- Migrated drag-and-drop implementation to dnd-kit.
- Refreshed login, registration, dashboard, and profile UI/UX.
- Updated task action flow to select-first interactions for touch ergonomics.

### Fixed

- Fixed registration redirect regression and stabilized auth redirects.
- Strengthened profile input normalization and validation.

### Refactored

- Centralized auth session persistence lifecycle in store helpers.

### Performance

- Added optimistic reorder updates with refetch fallback on failure.
- Reduced rerenders with memoization and callback stabilization.

## v0.3.0 (2025-11-22)

### Added

- `uiStore` for centralized modal/editing UI state.
- Route-change UI reset component.

### Changed

- Moved UI reset responsibility into logout flow.

### Fixed

- Resolved stale modal/editing state leakage across routes and sessions.

### Refactored

- Migrated frontend state from Context API to Zustand stores.
- Replaced fetch utility with centralized Axios client and interceptor.

### Removed

- Removed deprecated `AuthContext.jsx` and `api.js`.

### Performance

- Reduced state churn via store-driven global state and lazy auth initialization.

## v0.2.0 (2025-09-14)

### Added

- Board model and protected board CRUD API (`/api/boards`).
- Backend Postman collection for API testing.
- Conventional commit template and expanded commit guidance.

### Refactored

- Renamed backend auth middleware to `auth.middleware.js`.
- Improved backend error logging output.
- Cleaned task controller formatting and response wording.

## v0.1.0 (2025-09-11)

### Added

- Initial monorepo bootstrap with backend and frontend applications.
- JWT authentication, protected task CRUD API, and base auth/dashboard screens.
- Core backend architecture layers (routes, controllers, models, middleware, DB config, token utility).
- Initial repository documentation and ignore rules.
