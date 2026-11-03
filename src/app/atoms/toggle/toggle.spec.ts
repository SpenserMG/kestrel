import { render, screen } from '@testing-library/angular';
import { userEvent } from '@testing-library/user-event';
import { Toggle } from './toggle';
import { expectNoA11yViolations } from '../../test-utils/axe';

class ToggleHarness {
  async renderComponent(overrides: Partial<{ label: string; checked: boolean }> = {}) {
    return render(Toggle, {
      inputs: {
        label: overrides.label ?? 'Notify me',
        checked: overrides.checked ?? false,
      },
    });
  }
}

describe('Toggle', () => {
  let harness: ToggleHarness;

  beforeEach(() => {
    harness = new ToggleHarness();
  });

  it('renders with an accessible label reflecting the initial state', async () => {
    await harness.renderComponent({ label: 'Notify me', checked: false });
    expect(screen.getByRole('switch', { name: 'Notify me' })).not.toBeChecked();
  });

  it('switches on when clicked', async () => {
    const user = userEvent.setup();
    await harness.renderComponent({ checked: false });

    await user.click(screen.getByRole('switch', { name: 'Notify me' }));

    expect(screen.getByRole('switch', { name: 'Notify me' })).toBeChecked();
  });

  it('has no accessibility violations', async () => {
    const { container } = await harness.renderComponent();
    await expectNoA11yViolations(container);
  });
});
