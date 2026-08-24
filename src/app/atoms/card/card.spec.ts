import { provideRouter } from '@angular/router';
import { render, screen } from '@testing-library/angular';
import { Card } from './card';
import { expectNoA11yViolations } from '../../test-utils/axe';

class CardHarness {
  async renderComponent(overrides: Partial<{ title: string; link: string }> = {}) {
    return render(Card, {
      inputs: {
        title: overrides.title ?? 'Tic-Tac-Toe',
        link: overrides.link,
      },
      providers: [provideRouter([])],
    });
  }
}

describe('Card', () => {
  let harness: CardHarness;

  beforeEach(() => {
    harness = new CardHarness();
  });

  it('renders the provided title', async () => {
    await harness.renderComponent({ title: 'Hangman' });
    expect(screen.getByText('Hangman')).toBeInTheDocument();
  });

  it('renders as a link to the given route when link is provided', async () => {
    await harness.renderComponent({ link: '/games/tic-tac-toe' });
    expect(screen.getByRole('link')).toHaveAttribute('href', '/games/tic-tac-toe');
  });

  it('does not render a link when no link is provided', async () => {
    await harness.renderComponent();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('projects content into the card body', async () => {
    await render(`<app-card title="Tic-Tac-Toe" link="/games/tic-tac-toe">Body copy</app-card>`, {
      imports: [Card],
      providers: [provideRouter([])],
    });

    expect(screen.getByText('Body copy')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = await harness.renderComponent({ link: '/games/tic-tac-toe' });
    await expectNoA11yViolations(container);
  });
});
