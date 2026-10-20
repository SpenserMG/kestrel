import { HttpClient } from '@angular/common/http';
import { inject, InjectionToken, resource, Service } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

// A token (rather than importing `environment` directly at every use site)
// so tests can inject a fake key via a provider override instead of fighting
// a static module import — see mock-countries.interceptor.spec.ts.
export const REST_COUNTRIES_API_KEY = new InjectionToken<string>('REST_COUNTRIES_API_KEY', {
  providedIn: 'root',
  factory: () => environment.restCountriesApiKey,
});

export interface Country {
  commonName: string;
  officialName: string;
  region: string;
  subregion: string;
  population: number;
  areaKm2: number;
  capital: string;
  languages: string;
  currencies: string;
  flagEmoji: string;
  flagSvgUrl: string;
  unMember: boolean;
}

// Shape returned by REST Countries v5 for the fields in RESPONSE_FIELDS below
// (https://restcountries.com/docs/countries) — also the shape the mock
// interceptor's fixture data mirrors, so both sources map through toCountry()
// identically.
export interface RawCountry {
  names: { common: string; official: string };
  region: string;
  subregion: string;
  population: number;
  area: { kilometers: number };
  capitals: { name: string }[];
  languages: { name: string }[];
  currencies: { code: string; name: string; symbol: string }[];
  flag: { emoji: string; url_svg: string };
  classification: { un_member: boolean };
}

export interface CountriesResponse {
  data: {
    objects: RawCountry[];
    meta: { total: number; count: number; limit: number; offset: number; more: boolean };
  };
}

export const COUNTRIES_API_URL = 'https://api.restcountries.com/countries/v5';
export const COUNTRIES_RESPONSE_FIELDS =
  'names.common,names.official,region,subregion,population,area.kilometers,capitals,languages,currencies,flag.emoji,flag.url_svg,classification.un_member';
export const COUNTRIES_PAGE_SIZE = 100;

function toCountry(raw: RawCountry): Country {
  return {
    commonName: raw.names.common,
    officialName: raw.names.official,
    region: raw.region,
    subregion: raw.subregion,
    population: raw.population,
    areaKm2: raw.area.kilometers,
    capital: raw.capitals.map((c) => c.name).join(', '),
    languages: raw.languages.map((l) => l.name).join(', '),
    currencies: raw.currencies.map((c) => `${c.name} (${c.code})`).join(', '),
    flagEmoji: raw.flag.emoji,
    flagSvgUrl: raw.flag.url_svg,
    unMember: raw.classification.un_member,
  };
}

@Service()
export class CountryService {
  private readonly http = inject(HttpClient);
  private readonly apiKey = inject(REST_COUNTRIES_API_KEY);

  // One-shot full-directory load: REST Countries paginates (max 100/page on
  // the free plan), so this loops until meta.more is false and hands back
  // the assembled, flattened list. A plain `resource()` (rather than
  // `httpResource()`) is used because the loader needs to make several
  // sequential requests, not just one.
  readonly countries = resource<Country[], void>({
    loader: async () => {
      const all: RawCountry[] = [];
      let offset = 0;

      for (;;) {
        const response = await firstValueFrom(
          this.http.get<CountriesResponse>(COUNTRIES_API_URL, {
            params: { response_fields: COUNTRIES_RESPONSE_FIELDS, limit: COUNTRIES_PAGE_SIZE, offset },
            headers: { Authorization: `Bearer ${this.apiKey}` },
          }),
        );

        all.push(...response.data.objects);

        if (!response.data.meta.more) {
          break;
        }
        offset += COUNTRIES_PAGE_SIZE;
      }

      return all.map(toCountry);
    },
    defaultValue: [],
  });
}
