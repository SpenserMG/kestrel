import { render } from '@testing-library/angular';
import { Icon } from './icon';
import { expectNoA11yViolations } from '../../test-utils/axe';

class IconHarness {
  async renderComponent(overrides: Partial<{ name: string }> = {}) {
    return render(Icon, {
      inputs: {
        name: overrides.name ?? 'home',
      },
    });
  }
}

describe('Icon', () => {
  let harness: IconHarness;

  beforeEach(() => {
    harness = new IconHarness();
  });

  it('renders the provided icon name', async () => {
    const { container } = await harness.renderComponent({ name: 'menu' });
    expect(container.querySelector('mat-icon')?.textContent?.trim()).toBe('menu');
  });

  it('has no accessibility violations', async () => {
    const { container } = await harness.renderComponent();
    await expectNoA11yViolations(container);
  });
});
