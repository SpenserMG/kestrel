import { render, screen } from '@testing-library/angular';
import { CountryTableMaterial } from './country-table-material';
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

class CountryTableMaterialHarness {
  async renderComponent(overrides: Partial<{ countries: Country[] }> = {}) {
    return render(CountryTableMaterial, {
      inputs: { countries: overrides.countries ?? MOCK_COUNTRIES },
    });
  }
}

describe('CountryTableMaterial', () => {
  let harness: CountryTableMaterialHarness;

  beforeEach(() => {
    harness = new CountryTableMaterialHarness();
  });

  it('renders a row for each country', async () => {
    await harness.renderComponent();

    expect(screen.getByText('Testland')).toBeInTheDocument();
    expect(screen.getByText('Test Region')).toBeInTheDocument();
    expect(screen.getByText('1,000')).toBeInTheDocument();
  });

  it('renders UN membership as Yes/No text', async () => {
    await harness.renderComponent();
    expect(screen.getByText('Yes')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = await harness.renderComponent();
    await expectNoA11yViolations(container);
  });
});
