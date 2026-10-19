import { HttpClient, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

// Pretends /api/coffees is a real backend so CoffeeService can be written
// against a normal endpoint, while actually serving the local JSON fixture —
// no server needed for this to work. The fixture URL never matches
// COFFEES_API_URL, so the re-issued request passes straight through this
// same interceptor without recursing.
const COFFEES_API_URL = '/api/coffees';
const COFFEES_FIXTURE_URL = 'assets/coffees.json';

export const mockCoffeesInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url !== COFFEES_API_URL) {
    return next(req);
  }

  return inject(HttpClient).get(COFFEES_FIXTURE_URL, { observe: 'response' });
};
