import { TestBed } from '@angular/core/testing';
import { render, screen } from '@testing-library/angular';
import { userEvent } from '@testing-library/user-event';
import { vi } from 'vitest';
import { MatDialogRef } from '@angular/material/dialog';
import { ProfileForm } from './profile-form';
import { ProfileService } from '../../services/profile.service';
import { expectNoA11yViolations } from '../../test-utils/axe';

class ProfileFormHarness {
  readonly closeSpy = vi.fn();

  async renderComponent() {
    return render(ProfileForm, {
      providers: [{ provide: MatDialogRef, useValue: { close: this.closeSpy } }],
    });
  }
}

describe('ProfileForm', () => {
  let harness: ProfileFormHarness;

  beforeEach(() => {
    localStorage.clear();
    harness = new ProfileFormHarness();
  });

  it('renders the profile fields', async () => {
    await harness.renderComponent();

    expect(screen.getByRole('textbox', { name: 'Display name' })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Favorite game' })).toBeInTheDocument();
    expect(screen.getByRole('switch', { name: 'Show Effects' })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Theme' })).toBeInTheDocument();
  });

  it('disables Save until the form is valid for a new profile', async () => {
    const user = userEvent.setup();
    await harness.renderComponent();

    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();

    await user.type(screen.getByRole('textbox', { name: 'Display name' }), 'Jane');

    expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled();
  });

  it('shows a required error after leaving display name blank, and keeps Save disabled', async () => {
    const user = userEvent.setup();
    await harness.renderComponent();

    await user.click(screen.getByRole('textbox', { name: 'Display name' }));
    await user.tab();

    expect(await screen.findByText('Display name is required')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();
    expect(harness.closeSpy).not.toHaveBeenCalled();
    expect(TestBed.inject(ProfileService).profile()).toBeNull();
  });

  it('saves the profile and closes the dialog when valid', async () => {
    const user = userEvent.setup();
    await harness.renderComponent();

    await user.type(screen.getByRole('textbox', { name: 'Display name' }), 'Jane');
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(harness.closeSpy).toHaveBeenCalledTimes(1);
    expect(TestBed.inject(ProfileService).profile()?.displayName).toBe('Jane');
  });

  it('keeps Save disabled for an existing profile until a field actually changes', async () => {
    const user = userEvent.setup();
    localStorage.setItem(
      'kestrel.profile',
      JSON.stringify({ displayName: 'Jane', favoriteGame: 'none', showEffects: true }),
    );
    await harness.renderComponent();

    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();

    await user.clear(screen.getByRole('textbox', { name: 'Display name' }));
    await user.type(screen.getByRole('textbox', { name: 'Display name' }), 'Janet');

    expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled();

    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(harness.closeSpy).toHaveBeenCalledTimes(1);
    expect(TestBed.inject(ProfileService).profile()?.displayName).toBe('Janet');
  });

  it('closes without saving when cancelled', async () => {
    const user = userEvent.setup();
    await harness.renderComponent();

    await user.type(screen.getByRole('textbox', { name: 'Display name' }), 'Jane');
    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(harness.closeSpy).toHaveBeenCalledTimes(1);
    expect(TestBed.inject(ProfileService).profile()).toBeNull();
  });

  it('has no accessibility violations', async () => {
    const { container } = await harness.renderComponent();
    await expectNoA11yViolations(container);
  });
});
