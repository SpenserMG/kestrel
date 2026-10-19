import { render } from '@testing-library/angular';
import { Icon } from './icon';
import { expectNoA11yViolations } from '../../test-utils/axe';

class IconHarness {
  async renderComponent(overrides: Partial<{ name: string; strokeWidth: number }> = {}) {
    return render(Icon, {
      inputs: {
        name: overrides.name ?? 'home',
        ...(overrides.strokeWidth !== undefined ? { strokeWidth: overrides.strokeWidth } : {}),
      },
    });
  }
}

describe('Icon', () => {
  let harness: IconHarness;

  beforeEach(() => {
    harness = new IconHarness();
  });

  it('renders the svg for the provided icon name', async () => {
    const { container } = await harness.renderComponent({ name: 'menu' });
    expect(container.querySelector('svg.lucide-menu')).toBeInTheDocument();
  });

  it('is hidden from assistive tech, since icons are always paired with visible or labelled text', async () => {
    const { fixture } = await harness.renderComponent();
    expect(fixture.nativeElement).toHaveAttribute('aria-hidden', 'true');
  });

  it('throws for an unknown icon name', async () => {
    await expect(harness.renderComponent({ name: 'not-a-real-icon' })).rejects.toThrow();
  });

  it('defaults to a stroke width of 2', async () => {
    const { container } = await harness.renderComponent();
    expect(container.querySelector('svg')).toHaveAttribute('stroke-width', '2');
  });

  it('applies a custom stroke width', async () => {
    const { container } = await harness.renderComponent({ strokeWidth: 1.5 });
    expect(container.querySelector('svg')).toHaveAttribute('stroke-width', '1.5');
  });

  it('has no accessibility violations', async () => {
    const { container } = await harness.renderComponent();
    await expectNoA11yViolations(container);
  });
});
