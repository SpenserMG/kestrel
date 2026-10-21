import { CanDeactivateFn } from '@angular/router';

export interface CanComponentDeactivate {
  hasUnsavedProgress(): boolean;
}

// Centralized here (rather than each page calling confirm() itself) so the
// confirmation UX — currently a native dialog — can change in one place
// later (e.g. to a MatDialog) without touching every page that uses it.
// Generic wording since this guards both game pages (unfinished play) and
// non-game pages like the score tracker (unsaved edits).
export const confirmExitGuard: CanDeactivateFn<CanComponentDeactivate> = (component) => {
  if (!component.hasUnsavedProgress()) {
    return true;
  }

  return confirm('Leave this page? Your changes will be lost.');
};
