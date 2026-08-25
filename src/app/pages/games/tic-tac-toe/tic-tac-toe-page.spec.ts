import { render, screen } from '@testing-library/angular';
import { userEvent } from '@testing-library/user-event';
import { TicTacToePage } from './tic-tac-toe-page';
import { expectNoA11yViolations } from '../../../test-utils/axe';

class TicTacToePageHarness {
  async renderComponent() {
    return render(TicTacToePage);
  }

  cell(index: number) {
    return screen.getByRole('button', { name: new RegExp(`^Cell ${index + 1},`) });
  }
}

describe('TicTacToePage', () => {
  let harness: TicTacToePageHarness;
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    localStorage.clear();
    harness = new TicTacToePageHarness();
    user = userEvent.setup();
  });

  it("starts with X's turn and an empty board", async () => {
    await harness.renderComponent();

    expect(screen.getByText("X's turn")).toBeInTheDocument();
    expect(harness.cell(0)).toHaveTextContent('');
  });

  it('alternates players and marks the board on click', async () => {
    await harness.renderComponent();

    await user.click(harness.cell(0));
    expect(harness.cell(0)).toHaveTextContent('X');
    expect(screen.getByText("O's turn")).toBeInTheDocument();

    await user.click(harness.cell(1));
    expect(harness.cell(1)).toHaveTextContent('O');
    expect(screen.getByText("X's turn")).toBeInTheDocument();
  });

  it('declares a winner and disables the board once a line is complete', async () => {
    await harness.renderComponent();

    // X: 0, 1, 2 | O: 3, 4
    await user.click(harness.cell(0));
    await user.click(harness.cell(3));
    await user.click(harness.cell(1));
    await user.click(harness.cell(4));
    await user.click(harness.cell(2));

    expect(screen.getByText('X wins!')).toBeInTheDocument();
    expect(harness.cell(5)).toBeDisabled();
  });

  it('declares a draw when the board fills with no winner', async () => {
    await harness.renderComponent();

    // X O X / X O O / O X X -> draw
    const order = [0, 1, 2, 4, 3, 5, 7, 6, 8];
    for (const index of order) {
      await user.click(harness.cell(index));
    }

    expect(screen.getByText("It's a draw!")).toBeInTheDocument();
  });

  it('resets the board when New game is pressed', async () => {
    await harness.renderComponent();

    await user.click(harness.cell(0));
    await user.click(screen.getByRole('button', { name: 'New game' }));

    expect(harness.cell(0)).toHaveTextContent('');
    expect(screen.getByText("X's turn")).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = await harness.renderComponent();
    await expectNoA11yViolations(container);
  });
});
