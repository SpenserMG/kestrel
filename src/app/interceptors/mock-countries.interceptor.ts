import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { of } from 'rxjs';
import { CountriesResponse, COUNTRIES_API_URL, REST_COUNTRIES_API_KEY } from '../services/country.service';
import { MOCK_COUNTRIES } from './mock-countries-data';

// Unlike mock-coffees (which always intercepts), this only steps in when no
// real API key is configured — a fresh clone or a PR build gets realistic
// mock data for free, while a deployed build with a real key (or a key
// pasted locally for testing) hits the real REST Countries API.
export const mockCountriesInterceptor: HttpInterceptorFn = (req, next) => {
  const apiKey = inject(REST_COUNTRIES_API_KEY);

  if (!req.url.startsWith(COUNTRIES_API_URL) || apiKey) {
    return next(req);
  }

  const limit = Number(req.params.get('limit') ?? MOCK_COUNTRIES.length);
  const offset = Number(req.params.get('offset') ?? 0);
  const page = MOCK_COUNTRIES.slice(offset, offset + limit);

  const body: CountriesResponse = {
    data: {
      objects: page,
      meta: {
        total: MOCK_COUNTRIES.length,
        count: page.length,
        limit,
        offset,
        more: offset + limit < MOCK_COUNTRIES.length,
      },
    },
  };

  return of(new HttpResponse({ status: 200, body }));
};
