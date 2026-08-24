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
    expect(screen.getByText('Two players, one board, no server required.')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/games/tic-tac-toe');
  });

  it('has no accessibility violations', async () => {
    const { container } = await harness.renderComponent();
    await expectNoA11yViolations(container);
  });
});
