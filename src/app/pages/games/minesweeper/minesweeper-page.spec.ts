import { render, screen } from '@testing-library/angular';
import { userEvent } from '@testing-library/user-event';
import { MinesweeperPage } from './minesweeper-page';
import { expectNoA11yViolations } from '../../../test-utils/axe';

function cell(adjacentMines: number, isMine = false) {
  return { isMine, isRevealed: false, isFlagged: false, adjacentMines };
}

class MinesweeperPageHarness {
  async renderComponent() {
    return render(MinesweeperPage);
  }

  cellButton(row: number, col: number) {
    return screen.getByRole('button', {
      name: new RegExp(`^Row ${row + 1}, column ${col + 1},`),
    });
  }

  cellButtons() {
    return screen.getAllByRole('button', { name: /^Row \d+, column \d+,/ });
  }
}

describe('MinesweeperPage', () => {
  let harness: MinesweeperPageHarness;
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    localStorage.clear();
    harness = new MinesweeperPageHarness();
    user = userEvent.setup();
  });

  it('renders a 9x9 board for the default (beginner) difficulty', async () => {
    await harness.renderComponent();
    expect(harness.cellButtons()).toHaveLength(81);
  });

  it('renders a 16x16 board after switching to intermediate difficulty', async () => {
    const { fixture } = await harness.renderComponent();
    fixture.componentInstance.selectDifficulty('intermediate');
    fixture.detectChanges();

    expect(harness.cellButtons()).toHaveLength(256);
  });

  it('reveals a connected empty region and declares a win once every safe cell is revealed', async () => {
    const { fixture } = await harness.renderComponent();
    const page = fixture.componentInstance;
    page.board.set([
      [cell(0), cell(0), cell(0)],
      [cell(0), cell(1), cell(1)],
      [cell(0), cell(1), cell(0, true)],
    ]);
    fixture.detectChanges();

    await user.click(harness.cellButton(0, 0));
    fixture.detectChanges();

    expect(page.isWon()).toBe(true);
    expect(screen.getByText(/You win!/)).toBeInTheDocument();
    expect(harness.cellButton(1, 1)).toBeDisabled();
  });

  it('declares a loss and disables the board when a mine is revealed', async () => {
    const { fixture } = await harness.renderComponent();
    const page = fixture.componentInstance;
    page.board.set([
      [cell(0, true), cell(1)],
      [cell(1), cell(1)],
    ]);
    fixture.detectChanges();

    await user.click(harness.cellButton(0, 0));
    fixture.detectChanges();

    expect(page.isLost()).toBe(true);
    expect(screen.getByText(/Boom/)).toBeInTheDocument();
    expect(harness.cellButton(1, 1)).toBeDisabled();
  });

  it('flags a cell instead of revealing it when flag mode is enabled, excluding it from the mines-remaining count', async () => {
    await harness.renderComponent();

    expect(screen.getByText('Mines remaining: 10')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Flagging: Off' }));
    await user.click(harness.cellButton(0, 0));

    expect(harness.cellButton(0, 0)).toHaveAccessibleName(/flagged/);
    expect(screen.getByText('Mines remaining: 9')).toBeInTheDocument();
  });

  it('resets the board when New game is pressed', async () => {
    const { fixture } = await harness.renderComponent();
    const page = fixture.componentInstance;
    page.board.set([
      [cell(0), cell(0)],
      [cell(0), cell(0, true)],
    ]);
    fixture.detectChanges();

    await user.click(harness.cellButton(0, 0));
    await user.click(screen.getByRole('button', { name: 'New game' }));
    fixture.detectChanges();

    expect(page.elapsedSeconds()).toBe(0);
    expect(harness.cellButtons()).toHaveLength(81);
  });

  it('reports unsaved progress once a cell is revealed, and none once the game ends', async () => {
    const { fixture } = await harness.renderComponent();
    const page = fixture.componentInstance;
    page.board.set([
      [cell(1), cell(0, true), cell(1)],
      [cell(2), cell(2), cell(2)],
      [cell(1), cell(0, true), cell(1)],
    ]);
    fixture.detectChanges();

    expect(page.hasUnsavedProgress()).toBe(false);

    await user.click(harness.cellButton(0, 0));
    fixture.detectChanges();

    expect(page.hasUnsavedProgress()).toBe(true);
    expect(page.isGameOver()).toBe(false);

    const revealedBoard = page
      .board()
      .map((row) => row.map((boardCell) => ({ ...boardCell, isRevealed: !boardCell.isMine })));
    page.board.set(revealedBoard);
    fixture.detectChanges();

    expect(page.isWon()).toBe(true);
    expect(page.hasUnsavedProgress()).toBe(false);
  });

  it('has no accessibility violations', async () => {
    const { container } = await harness.renderComponent();
    await expectNoA11yViolations(container);
  });
});
