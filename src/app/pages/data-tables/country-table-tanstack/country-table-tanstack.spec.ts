import { render, screen } from '@testing-library/angular';
import { userEvent } from '@testing-library/user-event';
import { CountryTableTanstack } from './country-table-tanstack';
import { Country } from '../../../services/country.service';
import { expectNoA11yViolations } from '../../../test-utils/axe';

const MOCK_COUNTRIES: Country[] = [
  {
    commonName: 'Bravoland',
    officialName: 'Bravoland',
    region: 'Test Region',
    subregion: 'Test Subregion',
    population: 2000,
    areaKm2: 200,
    capital: 'Bravo City',
    languages: 'Testish',
    currencies: 'Test Dollar (TST)',
    flagEmoji: '🏳️',
    flagSvgUrl: 'https://example.com/flag.svg',
    unMember: true,
  },
  {
    commonName: 'Alphaland',
    officialName: 'Alphaland',
    region: 'Test Region',
    subregion: 'Test Subregion',
    population: 1000,
    areaKm2: 100,
    capital: 'Alpha City',
    languages: 'Testish',
    currencies: 'Test Dollar (TST)',
    flagEmoji: '🏳️',
    flagSvgUrl: 'https://example.com/flag.svg',
    unMember: false,
  },
];

class CountryTableTanstackHarness {
  async renderComponent(overrides: Partial<{ countries: Country[] }> = {}) {
    return render(CountryTableTanstack, {
      inputs: { countries: overrides.countries ?? MOCK_COUNTRIES },
    });
  }
}

describe('CountryTableTanstack', () => {
  let harness: CountryTableTanstackHarness;
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    harness = new CountryTableTanstackHarness();
    user = userEvent.setup();
  });

  it('renders a row for each country in the original order', async () => {
    await harness.renderComponent();

    const rows = screen.getAllByRole('row');
    // row 0 is the header
    expect(rows[1]).toHaveTextContent('Bravoland');
    expect(rows[2]).toHaveTextContent('Alphaland');
  });

  it('sorts rows when a sortable column header is clicked', async () => {
    await harness.renderComponent();

    await user.click(screen.getByRole('button', { name: /Name/ }));

    const rows = screen.getAllByRole('row');
    expect(rows[1]).toHaveTextContent('Alphaland');
    expect(rows[2]).toHaveTextContent('Bravoland');
  });

  it('formats population with thousands separators', async () => {
    await harness.renderComponent();
    expect(screen.getByText('2,000')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = await harness.renderComponent();
    await expectNoA11yViolations(container);
  });
});
