import { render, screen } from '@testing-library/angular';
import { CountryTableAgGrid } from './country-table-ag-grid';
import { Country } from '../../../services/country.service';
import { expectNoA11yViolations } from '../../../test-utils/axe';

const MOCK_COUNTRIES: Country[] = [
  {
    commonName: 'Testland',
    officialName: 'Republic of Testland',
    region: 'Test Region',
    subregion: 'Test Subregion',
    population: 1000,
    areaKm2: 100,
    capital: 'Test City',
    languages: 'Testish',
    currencies: 'Test Dollar (TST)',
    flagEmoji: '🏳️',
    flagSvgUrl: 'https://example.com/flag.svg',
    unMember: true,
  },
];

class CountryTableAgGridHarness {
  async renderComponent(overrides: Partial<{ countries: Country[] }> = {}) {
    const result = await render(CountryTableAgGrid, {
      inputs: { countries: overrides.countries ?? MOCK_COUNTRIES },
    });
    await result.fixture.whenStable();
    result.fixture.detectChanges();
    return result;
  }
}

describe('CountryTableAgGrid', () => {
  let harness: CountryTableAgGridHarness;

  beforeEach(() => {
    harness = new CountryTableAgGridHarness();
  });

  it('renders the grid with a row for each country', async () => {
    await harness.renderComponent();
    expect(await screen.findByText('Testland')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = await harness.renderComponent();
    await expectNoA11yViolations(container);
  });
});
