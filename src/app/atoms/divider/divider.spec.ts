import { render, screen } from '@testing-library/angular';
import { Divider } from './divider';
import { expectNoA11yViolations } from '../../test-utils/axe';

class DividerHarness {
  async renderComponent() {
    return render(Divider);
  }
}

describe('Divider', () => {
  let harness: DividerHarness;

  beforeEach(() => {
    harness = new DividerHarness();
  });

  it('renders a separator', async () => {
    await harness.renderComponent();
    expect(screen.getByRole('separator')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = await harness.renderComponent();
    await expectNoA11yViolations(container);
  });
});
