import { render, screen } from '@testing-library/angular';
import { provideRouter } from '@angular/router';
import { Header } from './header';
import { expectNoA11yViolations } from '../../test-utils/axe';
import { routes } from '../../app.routes';

class HeaderHarness {
  async renderComponent() {
    return render(Header, {
      providers: [provideRouter(routes)],
    });
  }
}

describe('Header', () => {
  let harness: HeaderHarness;

  beforeEach(() => {
    harness = new HeaderHarness();
  });

  it('renders the theme switcher', async () => {
    await harness.renderComponent();
    expect(screen.getByRole('combobox', { name: 'Theme' })).toBeInTheDocument();
  });

  it('links the logo to the home page', async () => {
    await harness.renderComponent();
    expect(screen.getByRole('link', { name: 'Go to home page' })).toHaveAttribute(
      'href',
      '/home',
    );
  });

  it('has no accessibility violations', async () => {
    const { container } = await harness.renderComponent();
    await expectNoA11yViolations(container);
  });
});
