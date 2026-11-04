import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';
import { routes } from './app.routes';
import { mockCoffeesInterceptor } from './interceptors/mock-coffees.interceptor';
import { mockCountriesInterceptor } from './interceptors/mock-countries.interceptor';
import { ThemeService } from './services/theme.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding(), withViewTransitions()),
    provideHttpClient(withFetch(), withInterceptors([mockCoffeesInterceptor, mockCountriesInterceptor])),
    // ThemeService applies its class to the document in a constructor effect, so it
    // must be instantiated eagerly — otherwise the theme stays unapplied until
    // whichever component first injects it (e.g. opening the profile dialog).
    provideAppInitializer(() => void inject(ThemeService)),
  ],
};
