import { render, screen } from '@testing-library/angular';
import { expectNoA11yViolations } from '../../test-utils/axe';
import { HomePage } from './home-page';

class HomePageHarness {
  async renderComponent() {
    return render(HomePage);
  }
}

describe('HomePage', () => {
  let harness: HomePageHarness;

  beforeEach(() => {
    harness = new HomePageHarness();
  });

  it('renders the welcome message', async () => {
    await harness.renderComponent();
    expect(screen.getByText('Welcome to Kestrel')).toBeTruthy;
  });

  it('has no accessibility violations', async () => {
    const { container } = await harness.renderComponent();
    await expectNoA11yViolations(container);
  });
});
