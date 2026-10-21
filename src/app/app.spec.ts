import { BreakpointObserver } from '@angular/cdk/layout';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { render, screen } from '@testing-library/angular';
import { userEvent } from '@testing-library/user-event';
import { of } from 'rxjs';
import { App } from './app';
import { routes } from './app.routes';
import { expectNoA11yViolations } from './test-utils/axe';

class AppHarness {
  async renderComponent(overrides: Partial<{ isPhone: boolean }> = {}) {
    const isPhone = overrides.isPhone ?? false;

    return render(App, {
      providers: [
        provideRouter(routes),
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: BreakpointObserver,
          useValue: { observe: () => of({ matches: isPhone, breakpoints: {} }) },
        },
      ],
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

  it('starts with the side nav collapsed and expands when the toggle is pressed', async () => {
    const user = userEvent.setup();
    await harness.renderComponent();

    expect(screen.getByText('Home')).toHaveClass('sr-only');

    await user.click(screen.getByRole('button', { name: 'Expand navigation' }));

    expect(screen.getByRole('button', { name: 'Collapse navigation' })).toBeInTheDocument();
    expect(screen.getByText('Home')).not.toHaveClass('sr-only');
  });

  it('resizes the content margin to match the collapsed/expanded nav width', async () => {
    const user = userEvent.setup();
    const { container } = await harness.renderComponent();
    const content = container.querySelector('mat-sidenav-content') as HTMLElement;

    expect(content.style.marginLeft).toBe('3.5rem');

    await user.click(screen.getByRole('button', { name: 'Expand navigation' }));

    expect(content.style.marginLeft).toBe('16rem');
  });

  it('overlays the sidenav at full width without squeezing content on a phone-sized screen', async () => {
    const { container } = await harness.renderComponent({ isPhone: true });
    const sidenav = container.querySelector('mat-sidenav') as HTMLElement;
    const content = container.querySelector('mat-sidenav-content') as HTMLElement;

    expect(sidenav).toHaveClass('mat-drawer-side');
    expect(sidenav.style.getPropertyValue('--mat-sidenav-container-width')).toBe('3.5rem');
    expect(content.style.marginLeft).toBe('3.5rem');
  });

  it('overlays the phone-width nav at full width once expanded', async () => {
    const user = userEvent.setup();
    const { container } = await harness.renderComponent({ isPhone: true });
    const sidenav = container.querySelector('mat-sidenav') as HTMLElement;
    const content = container.querySelector('mat-sidenav-content') as HTMLElement;

    await user.click(screen.getByRole('button', { name: 'Expand navigation' }));

    expect(sidenav).toHaveClass('mat-drawer-over');
    expect(sidenav.style.getPropertyValue('--mat-sidenav-container-width')).toBe('100%');
    expect(content.style.marginLeft).toBe('0px');
  });

  it('has no accessibility violations', async () => {
    const { container } = await harness.renderComponent();
    await expectNoA11yViolations(container);
  });
});
