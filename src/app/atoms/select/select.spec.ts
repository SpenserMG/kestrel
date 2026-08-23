import { render, screen } from '@testing-library/angular';
import { userEvent } from '@testing-library/user-event';
import { Select, SelectOption } from './select';
import { expectNoA11yViolations } from '../../test-utils/axe';

const FRUIT_OPTIONS: SelectOption[] = [
  { value: 'apple', label: 'Apple' },
  { value: 'pear', label: 'Pear', icon: 'eco' },
];

class SelectHarness {
  async renderComponent() {
    return render(Select, {
      inputs: {
        label: 'Fruit',
        options: FRUIT_OPTIONS,
        value: 'apple',
      },
    });
  }
}

describe('Select', () => {
  let harness: SelectHarness;

  beforeEach(() => {
    harness = new SelectHarness();
  });

  it('renders with an accessible label and the initial value', async () => {
    const { fixture } = await harness.renderComponent();

    // MatSelect resolves its initial selection in a plain `Promise.resolve()`
    // microtask with no signal write/markForCheck backing it, so this app's
    // zoneless change detection needs an explicit nudge to pick it up.
    await Promise.resolve();
    fixture.detectChanges();

    expect(screen.getByRole('combobox', { name: 'Fruit' })).toHaveTextContent('Apple');
  });

  it('shows the selected option\'s icon in the closed trigger', async () => {
    const { fixture, container } = await render(Select, {
      inputs: { label: 'Fruit', options: FRUIT_OPTIONS, value: 'pear' },
    });

    await Promise.resolve();
    fixture.detectChanges();

    const combobox = screen.getByRole('combobox', { name: 'Fruit' });
    expect(combobox).toHaveTextContent('Pear');
    expect(container.querySelector('mat-icon')?.textContent?.trim()).toBe('eco');
  });

  it('opens the panel and updates the value when a different option is chosen', async () => {
    const user = userEvent.setup();
    await harness.renderComponent();
    const combobox = screen.getByRole('combobox', { name: 'Fruit' });

    // MatSelect's open() handler lives on its inner trigger div, not the
    // outer element with role="combobox" — a synthetic click dispatched at
    // the host wouldn't bubble down to it, so target the trigger directly.
    const trigger = combobox.querySelector('.mat-mdc-select-trigger') as HTMLElement;
    await user.click(trigger);
    await user.click(await screen.findByRole('option', { name: 'Pear' }));

    expect(combobox).toHaveTextContent('Pear');
  });

  it('has no accessibility violations', async () => {
    const { container } = await harness.renderComponent();
    await expectNoA11yViolations(container);
  });
});
