import { CanDeactivateFn } from '@angular/router';

export interface CanComponentDeactivate {
  hasUnsavedProgress(): boolean;
}

// Centralized here (rather than each page calling confirm() itself) so the
// confirmation UX — currently a native dialog — can change in one place
// later (e.g. to a MatDialog) without touching every game page.
export const confirmExitGuard: CanDeactivateFn<CanComponentDeactivate> = (component) => {
  if (!component.hasUnsavedProgress()) {
    return true;
  }

  return confirm('Leave this game? Your progress will be lost.');
};
