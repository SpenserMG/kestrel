import { render, screen } from '@testing-library/angular';
import { userEvent } from '@testing-library/user-event';
import { provideRouter } from '@angular/router';
import { expectNoA11yViolations } from './test-utils/axe';
import { App } from './app';
import { routes } from './app.routes';

class AppHarness {
  async renderComponent() {
    return render(App, {
      providers: [provideRouter(routes)],
    });
  }
}

describe('App', () => {
  let harness: AppHarness;

  beforeEach(() => {
    harness = new AppHarness();
  });

  it('renders a Home nav link in the side nav', async () => {
    await harness.renderComponent();
    expect(screen.getByRole('link', { name: 'Home' })).toBeTruthy();
  });

  it('visually collapses the side nav labels when the toggle is pressed', async () => {
    const user = userEvent.setup();
    await harness.renderComponent();

    expect(screen.getByText('Home')).not.toHaveClass('sr-only');

    await user.click(screen.getByRole('button', { name: 'Collapse navigation' }));

    expect(screen.getByRole('button', { name: 'Expand navigation' })).toBeInTheDocument();
    expect(screen.getByText('Home')).toHaveClass('sr-only');
  });

  it('resizes the content margin to match the collapsed/expanded nav width', async () => {
    const user = userEvent.setup();
    const { container } = await harness.renderComponent();
    const content = container.querySelector('mat-sidenav-content') as HTMLElement;

    expect(content.style.marginLeft).toBe('16rem');

    await user.click(screen.getByRole('button', { name: 'Collapse navigation' }));

    expect(content.style.marginLeft).toBe('3.5rem');
  });

  it('has no accessibility violations', async () => {
    const { container } = await harness.renderComponent();
    await expectNoA11yViolations(container);
  });
});
