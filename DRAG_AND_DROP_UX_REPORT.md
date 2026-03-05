# Drag-and-Drop Architecture & UI/UX Checklist Report

## Pre-existing Features
- Basic active drag styling on cards (`scale` and reduced `opacity`) was already present.
- Drop target background highlighting for columns on hover (`isOver` state) was already present.
- Sortable list displacement animations were already partially present through `useSortable` transform/transition behavior.
- Empty columns already had a minimum drop area and a visible "Drop tasks here" cue.
- A pointer distance activation constraint (`distance: 6`) already existed to reduce accidental drags.

## Newly Implemented Features
- Added drag handle affordance (`\u22EE\u22EE`) to each card as a movability cue.
- Updated drag activation by input type:
  - Desktop/fine pointer keeps full-card drag activation.
  - Mobile/coarse pointer uses handle-only drag activation to avoid scroll conflicts.
- Added explicit cursor feedback with `cursor-grab` on drag handles and `cursor-grabbing` while dragging.
- Added a lifted drag overlay card with stronger elevation.
- Added a ghost/placeholder look in the source position while an item is in flight.
- Added explicit sortable transition easing/duration.
- Added `DragOverlay` drop animation for smooth settle on release.
- Improved drop-zone visuals with dashed container borders and stronger per-column hover highlight rings/colors.
- Added empty-state cue transition from "Drop tasks here" to "Release to drop" when hovered.
- Added touch/mobile optimization with long-press drag activation.
- Fixed mobile vertical scroll lock in the board by using `touch-action: pan-y` on sortable card wrappers.
- Scoped `touch-action: none` to the drag handle only so handle drag remains reliable without blocking page pan gestures.
- Added explicit drag cancel handling (`onDragCancel`) so Escape cleanly ends drag and clears active drag state.
- Enabled explicit board auto-scroll during drag.
- Added custom screen reader instructions for draggable tasks.
- Added custom drag announcements for lift, over, drop, and cancel events.
- Added an ARIA label to each drag handle (`Drag task <title>`).

## Architectural Notes
- Sensor architecture updated from one `PointerSensor` to `MouseSensor` (`distance: 8`), `TouchSensor` (`delay: 220`, `tolerance: 8`), and `KeyboardSensor` (`sortableKeyboardCoordinates`).
- Added dynamic pointer-mode switching with `matchMedia("(pointer: coarse)")` to enable handle-only drag on touch devices.
- `DndContext` now includes explicit `autoScroll`.
- `DndContext` now coordinates `onDragStart`, `onDragCancel`, and `onDragEnd` to manage active drag state.
- `DndContext` now has an `accessibility` configuration (`screenReaderInstructions` and custom `announcements`).
- Added `DragOverlay` with custom `dropAnimation` (`duration: 220`, cubic-bezier easing).
- No dnd-kit modifiers were added in this pass.
