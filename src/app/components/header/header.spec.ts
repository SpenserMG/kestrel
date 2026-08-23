import { render, screen } from '@testing-library/angular';
import { Header } from './header';
import { expectNoA11yViolations } from '../../test-utils/axe';

class HeaderHarness {
  async renderComponent() {
    return render(Header);
  }
}

describe('Header', () => {
  let harness: HeaderHarness;

  beforeEach(() => {
    harness = new HeaderHarness();
  });

  it('renders the theme switcher', async () => {
    await harness.renderComponent();
    expect(screen.getByRole('combobox', { name: 'Theme' })).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = await harness.renderComponent();
    await expectNoA11yViolations(container);
  });
});
