import { render, screen } from '@testing-library/angular';
import { userEvent } from '@testing-library/user-event';
import { vi } from 'vitest';
import { MatDialogRef } from '@angular/material/dialog';
import { Dialog } from './dialog';
import { expectNoA11yViolations } from '../../test-utils/axe';

const TEMPLATE = `
  <app-dialog title="Edit profile">
    <p>Dialog body</p>
    <div appDialogActions>
      <button>Save</button>
    </div>
  </app-dialog>
`;

class DialogHarness {
  readonly closeSpy = vi.fn();

  async renderComponent() {
    return render(TEMPLATE, {
      imports: [Dialog],
      providers: [{ provide: MatDialogRef, useValue: { close: this.closeSpy } }],
    });
  }
}

describe('Dialog', () => {
  let harness: DialogHarness;

  beforeEach(() => {
    harness = new DialogHarness();
  });

  it('renders the title and projected content', async () => {
    await harness.renderComponent();

    expect(screen.getByText('Edit profile')).toBeInTheDocument();
    expect(screen.getByText('Dialog body')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('closes the dialog when the close button is clicked', async () => {
    const user = userEvent.setup();
    await harness.renderComponent();

    await user.click(screen.getByRole('button', { name: 'Close dialog' }));

    expect(harness.closeSpy).toHaveBeenCalledTimes(1);
  });

  it('has no accessibility violations', async () => {
    const { container } = await harness.renderComponent();
    await expectNoA11yViolations(container);
  });
});
