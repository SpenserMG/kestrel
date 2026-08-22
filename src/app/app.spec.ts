import { render, screen } from '@testing-library/angular';
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
    expect(screen.getByRole('link', { name: 'Home' })).toBeTruthy;
  });

  it('has no accessibility violations', async () => {
    const { container } = await harness.renderComponent();
    await expectNoA11yViolations(container);
  });
});
