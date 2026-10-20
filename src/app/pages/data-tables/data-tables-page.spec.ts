import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { render, screen } from '@testing-library/angular';
import { userEvent } from '@testing-library/user-event';
import { DataTablesPage } from './data-tables-page';
import { CountriesResponse, COUNTRIES_API_URL } from '../../services/country.service';
import { expectNoA11yViolations } from '../../test-utils/axe';

const MOCK_RESPONSE: CountriesResponse = {
  data: {
    objects: [
      {
        names: { common: 'Testland', official: 'Republic of Testland' },
        region: 'Test Region',
        subregion: 'Test Subregion',
        population: 1000,
        area: { kilometers: 100 },
        capitals: [{ name: 'Test City' }],
        languages: [{ name: 'Testish' }],
        currencies: [{ code: 'TST', name: 'Test Dollar', symbol: 'T$' }],
        flag: { emoji: '🏳️', url_svg: 'https://example.com/flag.svg' },
        classification: { un_member: true },
      },
    ],
    meta: { total: 1, count: 1, limit: 100, offset: 0, more: false },
  },
};

class DataTablesPageHarness {
  async renderComponent() {
    const result = await render(DataTablesPage, {
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    const httpMock = TestBed.inject(HttpTestingController);
    httpMock.expectOne((req) => req.url === COUNTRIES_API_URL).flush(MOCK_RESPONSE);
    await result.fixture.whenStable();
    result.fixture.detectChanges();

    return result;
  }
}

describe('DataTablesPage', () => {
  let harness: DataTablesPageHarness;
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    harness = new DataTablesPageHarness();
    user = userEvent.setup();
  });

  afterEach(() => {
    TestBed.inject(HttpTestingController).verify();
  });

  it('renders the page heading', async () => {
    await harness.renderComponent();
    expect(screen.getByRole('heading', { level: 1, name: 'Data Tables' })).toBeInTheDocument();
  });

  it('defaults to the Angular Material implementation', async () => {
    await harness.renderComponent();
    expect(screen.getByText('Testland')).toBeInTheDocument();
  });

  it('switches to TanStack Table when selected from the dropdown', async () => {
    const { fixture } = await harness.renderComponent();

    const combobox = screen.getByRole('combobox', { name: 'Table implementation' });
    const trigger = combobox.querySelector('.mat-mdc-select-trigger') as HTMLElement;
    await user.click(trigger);
    await user.click(await screen.findByRole('option', { name: 'TanStack Table' }));
    fixture.detectChanges();

    expect(screen.getByText('Testland')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Name/ })).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = await harness.renderComponent();
    await expectNoA11yViolations(container);
  });
});
