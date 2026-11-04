import { render, screen } from '@testing-library/angular';
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
  async renderComponent() {
    return render(TEMPLATE, {
      imports: [Dialog],
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

  it('does not render a close button', async () => {
    await harness.renderComponent();

    expect(screen.queryByRole('button', { name: 'Close dialog' })).not.toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = await harness.renderComponent();
    await expectNoA11yViolations(container);
  });
});
