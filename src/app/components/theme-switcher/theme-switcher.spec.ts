import { render, screen } from '@testing-library/angular';
import { userEvent } from '@testing-library/user-event';
import { TestBed } from '@angular/core/testing';
import { ThemeSwitcher } from './theme-switcher';
import { ThemeService } from '../../services/theme.service';
import { expectNoA11yViolations } from '../../test-utils/axe';

class ThemeSwitcherHarness {
  async renderComponent() {
    return render(ThemeSwitcher);
  }
}

describe('ThemeSwitcher', () => {
  let harness: ThemeSwitcherHarness;

  beforeEach(() => {
    harness = new ThemeSwitcherHarness();
  });

  it('shows the currently active theme', async () => {
    const { fixture } = await harness.renderComponent();

    // See select.ts — MatSelect's initial-selection microtask needs a nudge
    // to be picked up by this app's zoneless change detection.
    await Promise.resolve();
    fixture.detectChanges();

    expect(screen.getByRole('combobox', { name: 'Theme' })).toHaveTextContent('Light Theme');
  });

  it('switches the active theme when a different option is chosen', async () => {
    const user = userEvent.setup();
    await harness.renderComponent();
    const theme = TestBed.inject(ThemeService);
    const combobox = screen.getByRole('combobox', { name: 'Theme' });
    const trigger = combobox.querySelector('.mat-mdc-select-trigger') as HTMLElement;

    await user.click(trigger);
    await user.click(await screen.findByRole('option', { name: 'Dark Theme' }));

    expect(theme.current()).toBe('dark-theme');
  });

  it('has no accessibility violations', async () => {
    const { container } = await harness.renderComponent();
    await expectNoA11yViolations(container);
  });
});
