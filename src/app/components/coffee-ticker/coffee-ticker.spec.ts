import { render, screen } from '@testing-library/angular';
import { userEvent } from '@testing-library/user-event';
import { CoffeeTicker } from './coffee-ticker';
import { expectNoA11yViolations } from '../../test-utils/axe';

class CoffeeTickerHarness {
  async renderComponent() {
    return render(CoffeeTicker);
  }
}

describe('CoffeeTicker', () => {
  let harness: CoffeeTickerHarness;

  beforeEach(() => {
    harness = new CoffeeTickerHarness();
  });

  it('renders the fixed label', async () => {
    await harness.renderComponent();
    expect(screen.getByText('Coffee you should try')).toBeInTheDocument();
  });

  it('lists every coffee for assistive technology', async () => {
    await harness.renderComponent();
    expect(screen.getByRole('list')).toHaveTextContent('Ethiopian Yirgacheffe');
    expect(screen.getByRole('list')).toHaveTextContent('Panama Geisha');
  });

  it('pauses and resumes scrolling when the toggle is pressed', async () => {
    const user = userEvent.setup();
    await harness.renderComponent();

    const toggle = screen.getByRole('button', { name: 'Pause scrolling coffee list' });
    await user.click(toggle);

    expect(screen.getByRole('button', { name: 'Resume scrolling coffee list' })).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = await harness.renderComponent();
    await expectNoA11yViolations(container);
  });
});
