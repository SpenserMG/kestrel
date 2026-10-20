// Default (development) environment. The real key for production is never
// committed here — environment.prod.ts is overwritten at CI build time from
// a GitHub Actions secret (see .github/workflows/deploy.yml) and swapped in
// via angular.json's fileReplacements. For local testing against the real
// API, paste your own key below temporarily — never commit that change.
export const environment = {
  restCountriesApiKey: '',
};
