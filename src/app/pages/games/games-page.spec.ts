import { provideRouter } from '@angular/router';
import { render, screen } from '@testing-library/angular';
import { GamesPage } from './games-page';
import { expectNoA11yViolations } from '../../test-utils/axe';

class GamesPageHarness {
  async renderComponent() {
    return render(GamesPage, {
      providers: [provideRouter([])],
    });
  }
}

describe('GamesPage', () => {
  let harness: GamesPageHarness;

  beforeEach(() => {
    harness = new GamesPageHarness();
  });

  it('renders a tile linking to tic-tac-toe', async () => {
    await harness.renderComponent();

    expect(screen.getByText('Tic-Tac-Toe')).toBeInTheDocument();
    expect(screen.getByText('Simple 2-player tic-tac-toe')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Tic-Tac-Toe/ })).toHaveAttribute(
      'href',
      '/games/tic-tac-toe',
    );
  });

  it('renders a tile linking to memory match', async () => {
    await harness.renderComponent();

    expect(screen.getByText('Memory Match')).toBeInTheDocument();
    expect(screen.getByText('Flip cards to find matching pairs')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Memory Match/ })).toHaveAttribute(
      'href',
      '/games/memory-match',
    );
  });

  it('renders a tile linking to connect four', async () => {
    await harness.renderComponent();

    expect(screen.getByText('Connect Four')).toBeInTheDocument();
    expect(screen.getByText('Drop pieces, get four in a row')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Connect Four/ })).toHaveAttribute(
      'href',
      '/games/connect-four',
    );
  });

  it('renders a tile linking to minesweeper', async () => {
    await harness.renderComponent();

    expect(screen.getByText('Minesweeper')).toBeInTheDocument();
    expect(screen.getByText('Clear the board without hitting a mine')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Minesweeper/ })).toHaveAttribute(
      'href',
      '/games/minesweeper',
    );
  });

  it('has no accessibility violations', async () => {
    const { container } = await harness.renderComponent();
    await expectNoA11yViolations(container);
  });
});
