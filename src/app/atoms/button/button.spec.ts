import { render, screen } from '@testing-library/angular';
import { userEvent } from '@testing-library/user-event';
import { vi } from 'vitest';
import { Button } from './button';
import { expectNoA11yViolations } from '../../test-utils/axe';

class ButtonHarness {
  async renderComponent(
    overrides: Partial<{
      label: string;
      variant: 'filled' | 'outlined' | 'text';
      disabled: boolean;
      pressed: () => void;
    }> = {},
  ) {
    return render(Button, {
      inputs: {
        label: overrides.label ?? 'Click me',
        variant: overrides.variant,
        disabled: overrides.disabled,
      },
      on: {
        pressed: overrides.pressed,
      },
    });
  }
}

describe('Button', () => {
  let harness: ButtonHarness;

  beforeEach(() => {
    harness = new ButtonHarness();
  });

  it('renders the provided label', async () => {
    await harness.renderComponent({ label: 'Save' });
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('emits pressed when clicked', async () => {
    const user = userEvent.setup();
    const pressed = vi.fn();
    await harness.renderComponent({ pressed });

    await user.click(screen.getByRole('button'));

    expect(pressed).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled input is true', async () => {
    await harness.renderComponent({ disabled: true });
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('has no accessibility violations', async () => {
    const { container } = await harness.renderComponent();
    await expectNoA11yViolations(container);
  });
});
