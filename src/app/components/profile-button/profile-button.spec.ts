import { TestBed } from '@angular/core/testing';
import { render, screen } from '@testing-library/angular';
import { userEvent } from '@testing-library/user-event';
import { ProfileButton } from './profile-button';
import { ProfileService } from '../../services/profile.service';
import { expectNoA11yViolations } from '../../test-utils/axe';

class ProfileButtonHarness {
  async renderComponent() {
    return render(ProfileButton);
  }
}

describe('ProfileButton', () => {
  let harness: ProfileButtonHarness;

  beforeEach(() => {
    localStorage.clear();
    harness = new ProfileButtonHarness();
  });

  it('shows a generic label and no name when no profile is saved', async () => {
    await harness.renderComponent();

    expect(screen.getByRole('button', { name: 'Edit profile' })).toBeInTheDocument();
  });

  it('updates the button label, without showing the name in the header, once a profile exists', async () => {
    await harness.renderComponent();
    const profileService = TestBed.inject(ProfileService);

    profileService.save({
      displayName: 'Jane',
      favoriteGame: 'none',
      notifyOnHighScores: false,
    });

    expect(await screen.findByRole('button', { name: 'Edit profile for Jane' })).toBeInTheDocument();
    expect(screen.queryByText('Jane')).not.toBeInTheDocument();
  });

  it('opens the profile dialog when clicked', async () => {
    const user = userEvent.setup();
    await harness.renderComponent();

    await user.click(screen.getByRole('button', { name: 'Edit profile' }));

    expect(await screen.findByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Edit profile')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Display name' })).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = await harness.renderComponent();
    await expectNoA11yViolations(container);
  });
});
