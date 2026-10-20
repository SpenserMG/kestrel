import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { mockCountriesInterceptor } from './mock-countries.interceptor';
import { CountriesResponse, COUNTRIES_API_URL, REST_COUNTRIES_API_KEY } from '../services/country.service';

describe('mockCountriesInterceptor', () => {
  it('serves paginated mock data when no API key is configured', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([mockCountriesInterceptor])),
        provideHttpClientTesting(),
        { provide: REST_COUNTRIES_API_KEY, useValue: '' },
      ],
    });

    const response = await firstValueFrom(
      TestBed.inject(HttpClient).get<CountriesResponse>(COUNTRIES_API_URL, {
        params: { limit: 2, offset: 1 },
      }),
    );

    expect(response.data.objects).toHaveLength(2);
    expect(response.data.meta).toEqual({ total: 16, count: 2, limit: 2, offset: 1, more: true });
  });

  it('lets a request through to the real API when a key is configured', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([mockCountriesInterceptor])),
        provideHttpClientTesting(),
        { provide: REST_COUNTRIES_API_KEY, useValue: 'rc_live_real_key' },
      ],
    });

    const httpMock = TestBed.inject(HttpTestingController);
    const response = firstValueFrom(
      TestBed.inject(HttpClient).get<CountriesResponse>(COUNTRIES_API_URL, {
        params: { limit: 25, offset: 0 },
      }),
    );

    httpMock.expectOne((req) => req.url === COUNTRIES_API_URL).flush({
      data: { objects: [], meta: { total: 0, count: 0, limit: 25, offset: 0, more: false } },
    });

    await expect(response).resolves.toBeDefined();
    httpMock.verify();
  });

  it('leaves requests for other URLs untouched', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([mockCountriesInterceptor])),
        provideHttpClientTesting(),
        { provide: REST_COUNTRIES_API_KEY, useValue: '' },
      ],
    });

    const httpMock = TestBed.inject(HttpTestingController);
    const response = firstValueFrom(TestBed.inject(HttpClient).get('/api/something-else'));

    httpMock.expectOne('/api/something-else').flush({ ok: true });

    expect(await response).toEqual({ ok: true });
  });
});
