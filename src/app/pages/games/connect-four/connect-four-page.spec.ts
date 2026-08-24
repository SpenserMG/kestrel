import { render, screen } from '@testing-library/angular';
import { userEvent } from '@testing-library/user-event';
import { ConnectFourPage } from './connect-four-page';
import { expectNoA11yViolations } from '../../../test-utils/axe';

class ConnectFourPageHarness {
  async renderComponent() {
    return render(ConnectFourPage);
  }

  columnButton(column: number) {
    return screen.getByRole('button', { name: `Drop piece in column ${column}` });
  }
}

describe('ConnectFourPage', () => {
  let harness: ConnectFourPageHarness;
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    localStorage.clear();
    harness = new ConnectFourPageHarness();
    user = userEvent.setup();
  });

  it("starts with Red's turn and 7 open columns", async () => {
    await harness.renderComponent();

    expect(screen.getByText("Red's turn")).toBeInTheDocument();
    for (let column = 1; column <= 7; column++) {
      expect(harness.columnButton(column)).toBeEnabled();
    }
  });

  it('alternates players and drops pieces to the bottom of a column', async () => {
    await harness.renderComponent();

    await user.click(harness.columnButton(1));
    expect(screen.getByText("Yellow's turn")).toBeInTheDocument();

    await user.click(harness.columnButton(1));
    expect(screen.getByText("Red's turn")).toBeInTheDocument();
  });

  it('disables a column once it fills with 6 pieces', async () => {
    await harness.renderComponent();

    for (let i = 0; i < 6; i++) {
      await user.click(harness.columnButton(1));
    }

    expect(harness.columnButton(1)).toBeDisabled();
  });

  it('declares a vertical winner and disables the board', async () => {
    await harness.renderComponent();

    // Red drops 4-in-a-column in column 1, Yellow drops in column 2 between turns.
    await user.click(harness.columnButton(1)); // red
    await user.click(harness.columnButton(2)); // yellow
    await user.click(harness.columnButton(1)); // red
    await user.click(harness.columnButton(2)); // yellow
    await user.click(harness.columnButton(1)); // red
    await user.click(harness.columnButton(2)); // yellow
    await user.click(harness.columnButton(1)); // red - 4 in a row vertically

    expect(screen.getByText('Red wins!')).toBeInTheDocument();
    expect(harness.columnButton(3)).toBeDisabled();
  });

  it('resets the board when New game is pressed', async () => {
    await harness.renderComponent();

    await user.click(harness.columnButton(1));
    await user.click(screen.getByRole('button', { name: 'New game' }));

    expect(screen.getByText("Red's turn")).toBeInTheDocument();
    expect(harness.columnButton(1)).toBeEnabled();
  });

  it('has no accessibility violations', async () => {
    const { container } = await harness.renderComponent();
    await expectNoA11yViolations(container);
  });
});
