import { render } from '@testing-library/angular';
import { vi } from 'vitest';
import { Fireworks } from './fireworks';
import { expectNoA11yViolations } from '../../test-utils/axe';

class FireworksHarness {
  async renderComponent(overrides: Partial<{ active: boolean }> = {}) {
    return render(Fireworks, {
      inputs: {
        active: overrides.active ?? false,
      },
    });
  }
}

describe('Fireworks', () => {
  let harness: FireworksHarness;

  beforeEach(() => {
    harness = new FireworksHarness();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders nothing when inactive', async () => {
    const { container } = await harness.renderComponent({ active: false });
    expect(container.querySelector('.fireworks')).not.toBeInTheDocument();
  });

  it('renders particle bursts when activated', async () => {
    const { container } = await harness.renderComponent({ active: true });
    expect(container.querySelector('.fireworks')).toBeInTheDocument();
    expect(container.querySelectorAll('.particle').length).toBeGreaterThan(0);
  });

  it('hides itself again after the display duration', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const { container, fixture } = await harness.renderComponent({ active: true });

    vi.advanceTimersByTime(1400);
    fixture.detectChanges();

    expect(container.querySelector('.fireworks')).not.toBeInTheDocument();
  });

  it('has no accessibility violations while showing', async () => {
    const { container } = await harness.renderComponent({ active: true });
    await expectNoA11yViolations(container);
  });
});
