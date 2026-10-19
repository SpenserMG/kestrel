import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { mockCoffeesInterceptor } from './mock-coffees.interceptor';
import { Coffee } from '../services/coffee.service';

const MOCK_COFFEES: Coffee[] = [
  { roaster: 'Passenger Coffee and Tea', name: 'Ethiopian Yirgacheffe' },
];

describe('mockCoffeesInterceptor', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([mockCoffeesInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('serves the local fixture instead of letting the request reach /api/coffees', async () => {
    const response = firstValueFrom(httpClient.get<Coffee[]>('/api/coffees'));

    httpMock.expectOne('assets/coffees.json').flush(MOCK_COFFEES);

    expect(await response).toEqual(MOCK_COFFEES);
  });

  it('leaves requests for other URLs untouched', async () => {
    const response = firstValueFrom(httpClient.get('/api/something-else'));

    httpMock.expectOne('/api/something-else').flush({ ok: true });

    expect(await response).toEqual({ ok: true });
  });
});
