import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { vi } from 'vitest';
import { CanComponentDeactivate, confirmExitGuard } from './confirm-exit.guard';

const DUMMY_ROUTE = {} as ActivatedRouteSnapshot;
const DUMMY_STATE = {} as RouterStateSnapshot;

function runGuard(component: CanComponentDeactivate) {
  return confirmExitGuard(component, DUMMY_ROUTE, DUMMY_STATE, DUMMY_STATE);
}

describe('confirmExitGuard', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('allows navigation without prompting when there is no unsaved progress', () => {
    const confirmSpy = vi.spyOn(window, 'confirm');

    const result = runGuard({ hasUnsavedProgress: () => false });

    expect(result).toBe(true);
    expect(confirmSpy).not.toHaveBeenCalled();
  });

  it('allows navigation when the user confirms leaving mid-game', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    const result = runGuard({ hasUnsavedProgress: () => true });

    expect(result).toBe(true);
    expect(window.confirm).toHaveBeenCalledWith('Leave this game? Your progress will be lost.');
  });

  it('blocks navigation when the user cancels leaving mid-game', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false);

    const result = runGuard({ hasUnsavedProgress: () => true });

    expect(result).toBe(false);
  });
});
