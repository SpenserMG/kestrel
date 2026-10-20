import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { render, screen } from '@testing-library/angular';
import { userEvent } from '@testing-library/user-event';
import { CoffeeTicker } from './coffee-ticker';
import { Coffee } from '../../services/coffee.service';
import { expectNoA11yViolations } from '../../test-utils/axe';

const MOCK_COFFEES: Coffee[] = [
  { roaster: 'Passenger Coffee and Tea', name: 'Ethiopian Yirgacheffe' },
  { roaster: 'Olympia Coffee', name: 'Panama Geisha' },
];

class CoffeeTickerHarness {
  async renderComponent() {
    const result = await render(CoffeeTicker, {
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    const httpMock = TestBed.inject(HttpTestingController);
    httpMock.expectOne('/api/coffees').flush(MOCK_COFFEES);
    await result.fixture.whenStable();
    result.fixture.detectChanges();

    return result;
  }
}

describe('CoffeeTicker', () => {
  let harness: CoffeeTickerHarness;

  beforeEach(() => {
    harness = new CoffeeTickerHarness();
  });

  afterEach(() => {
    TestBed.inject(HttpTestingController).verify();
  });

  it('renders the fixed label', async () => {
    await harness.renderComponent();
    expect(screen.getByText('Coffees')).toBeInTheDocument();
  });

  it('lists every coffee for assistive technology', async () => {
    await harness.renderComponent();
    expect(screen.getByRole('list')).toHaveTextContent('Ethiopian Yirgacheffe');
    expect(screen.getByRole('list')).toHaveTextContent('Panama Geisha');
  });

  it('pauses and resumes scrolling when the toggle is pressed', async () => {
    const user = userEvent.setup();
    await harness.renderComponent();

    const toggle = screen.getByRole('button', { name: 'Pause scrolling coffee list' });
    await user.click(toggle);

    expect(
      screen.getByRole('button', { name: 'Resume scrolling coffee list' }),
    ).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = await harness.renderComponent();
    await expectNoA11yViolations(container);
  });
});
