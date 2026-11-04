import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { render, screen } from '@testing-library/angular';
import { expectNoA11yViolations } from '../../test-utils/axe';
import { HomePage } from './home-page';
import { ProfileService } from '../../services/profile.service';

class HomePageHarness {
  async renderComponent() {
    return render(HomePage, {
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
  }
}

describe('HomePage', () => {
  let harness: HomePageHarness;

  beforeEach(() => {
    localStorage.clear();
    harness = new HomePageHarness();
  });

  it('renders a generic welcome message when no profile is saved', async () => {
    await harness.renderComponent();
    expect(screen.getByText('welcome!')).toBeTruthy();
  });

  it('greets the saved display name when a profile exists', async () => {
    await harness.renderComponent();
    const profileService = TestBed.inject(ProfileService);

    profileService.save({ displayName: 'Jane', favoriteGame: 'none', fireworksEnabled: true });

    expect(await screen.findByText('welcome, Jane!')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = await harness.renderComponent();
    await expectNoA11yViolations(container);
  });
});
