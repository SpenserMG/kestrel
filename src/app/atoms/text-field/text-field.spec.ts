import { render, screen } from '@testing-library/angular';
import { userEvent } from '@testing-library/user-event';
import { TextField } from './text-field';
import { expectNoA11yViolations } from '../../test-utils/axe';

class TextFieldHarness {
  async renderComponent(
    overrides: Partial<{
      label: string;
      value: string;
      multiline: boolean;
      errorMessage: string | null;
    }> = {},
  ) {
    return render(TextField, {
      inputs: {
        label: overrides.label ?? 'Display name',
        value: overrides.value ?? '',
        multiline: overrides.multiline,
        errorMessage: overrides.errorMessage,
      },
    });
  }
}

describe('TextField', () => {
  let harness: TextFieldHarness;

  beforeEach(() => {
    harness = new TextFieldHarness();
  });

  it('renders an accessible textbox with the provided label and value', async () => {
    await harness.renderComponent({ label: 'Display name', value: 'Jane' });
    expect(screen.getByRole('textbox', { name: 'Display name' })).toHaveValue('Jane');
  });

  it('updates the value as the user types', async () => {
    const user = userEvent.setup();
    await harness.renderComponent({ value: '' });

    await user.type(screen.getByRole('textbox', { name: 'Display name' }), 'Jane');

    expect(screen.getByRole('textbox', { name: 'Display name' })).toHaveValue('Jane');
  });

  it('renders a multiline textbox when multiline is true', async () => {
    await harness.renderComponent({ label: 'Bio', multiline: true });
    expect(screen.getByRole('textbox', { name: 'Bio' }).tagName).toBe('TEXTAREA');
  });

  it('shows the provided error message', async () => {
    await harness.renderComponent({ errorMessage: 'Display name is required' });
    expect(await screen.findByText('Display name is required')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = await harness.renderComponent();
    await expectNoA11yViolations(container);
  });
});
