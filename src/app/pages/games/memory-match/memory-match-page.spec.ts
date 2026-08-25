import { render, screen } from '@testing-library/angular';
import { userEvent } from '@testing-library/user-event';
import { vi } from 'vitest';
import { MemoryMatchPage } from './memory-match-page';
import { expectNoA11yViolations } from '../../../test-utils/axe';

class MemoryMatchPageHarness {
  async renderComponent() {
    return render(MemoryMatchPage);
  }

  cellButtons() {
    return screen.getAllByRole('button', { name: /^Card \d+,/ });
  }
}

describe('MemoryMatchPage', () => {
  let harness: MemoryMatchPageHarness;
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    localStorage.clear();
    harness = new MemoryMatchPageHarness();
    user = userEvent.setup();
  });

  it('renders a 12-cell board for the default (easy) difficulty', async () => {
    await harness.renderComponent();
    expect(harness.cellButtons()).toHaveLength(12);
  });

  it('renders a 16-cell board after switching to medium difficulty', async () => {
    const { fixture } = await harness.renderComponent();
    fixture.componentInstance.selectDifficulty('medium');
    fixture.detectChanges();

    expect(harness.cellButtons()).toHaveLength(16);
  });

  it('marks a matching pair as matched and disabled', async () => {
    const { fixture } = await harness.renderComponent();
    const page = fixture.componentInstance;
    page.cards.set([
      { id: 0, symbol: 'star' },
      { id: 1, symbol: 'star' },
    ]);
    fixture.detectChanges();

    const [first, second] = harness.cellButtons();
    await user.click(first);
    await user.click(second);
    fixture.detectChanges();

    expect(first).toBeDisabled();
    expect(second).toBeDisabled();
    expect(screen.getByText('Solved in 1 moves!')).toBeInTheDocument();
  });

  it('flips a mismatched pair back face-down after a delay', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const { fixture } = await harness.renderComponent();
    const page = fixture.componentInstance;
    page.cards.set([
      { id: 0, symbol: 'star' },
      { id: 1, symbol: 'pets' },
    ]);
    fixture.detectChanges();

    const [first, second] = harness.cellButtons();
    await user.click(first);
    await user.click(second);
    fixture.detectChanges();

    expect(page.flippedIndices()).toEqual([0, 1]);
    expect(page.isResolving()).toBe(true);

    vi.advanceTimersByTime(800);
    fixture.detectChanges();

    expect(page.flippedIndices()).toEqual([]);
    expect(page.isResolving()).toBe(false);
    vi.useRealTimers();
  });

  it('resets the board when New game is pressed', async () => {
    const { fixture } = await harness.renderComponent();
    const page = fixture.componentInstance;
    page.cards.set([
      { id: 0, symbol: 'star' },
      { id: 1, symbol: 'star' },
    ]);
    fixture.detectChanges();

    const [first, second] = harness.cellButtons();
    await user.click(first);
    await user.click(second);
    fixture.detectChanges();

    await user.click(screen.getByRole('button', { name: 'New game' }));
    fixture.detectChanges();

    expect(page.moves()).toBe(0);
    expect(page.matchedIds().size).toBe(0);
    expect(harness.cellButtons()).toHaveLength(12);
  });

  it('has no accessibility violations', async () => {
    const { container } = await harness.renderComponent();
    await expectNoA11yViolations(container);
  });
});
