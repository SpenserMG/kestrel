import { render, screen } from '@testing-library/angular';
import { userEvent } from '@testing-library/user-event';
import { vi } from 'vitest';
import { IconButton } from './icon-button';
import { expectNoA11yViolations } from '../../test-utils/axe';

class IconButtonHarness {
  async renderComponent(
    overrides: Partial<{
      icon: string;
      label: string;
      disabled: boolean;
      pressed: () => void;
    }> = {},
  ) {
    return render(IconButton, {
      inputs: {
        icon: overrides.icon ?? 'menu',
        label: overrides.label ?? 'Toggle navigation',
        disabled: overrides.disabled,
      },
      on: {
        pressed: overrides.pressed,
      },
    });
  }
}

describe('IconButton', () => {
  let harness: IconButtonHarness;

  beforeEach(() => {
    harness = new IconButtonHarness();
  });

  it('renders an accessible button with the provided label', async () => {
    await harness.renderComponent({ label: 'Collapse navigation' });
    expect(screen.getByRole('button', { name: 'Collapse navigation' })).toBeInTheDocument();
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
