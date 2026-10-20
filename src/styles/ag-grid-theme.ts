import { iconSetMaterial, themeQuartz } from 'ag-grid-community';

// Generated via AG Grid's theme builder against this app's dark/light M3
// values, then hand-converted from literal hex to the live --mat-sys-*
// tokens so this stays in sync if the palette is ever regenerated — same
// rule as every other styled surface in this app. A single theme (rather
// than separate light/dark objects swapped in TS) works because these CSS
// custom properties already re-resolve on their own whenever
// .light-theme/.dark-theme toggles on <html>; `browserColorScheme: 'inherit'`
// lets AG Grid's native color-scheme hint (scrollbars, form controls) follow
// the same `color-scheme` declaration set on those two classes.
export const agGridTheme = themeQuartz.withPart(iconSetMaterial).withParams({
  accentColor: 'var(--mat-sys-primary)',
  backgroundColor: 'var(--mat-sys-surface)',
  browserColorScheme: 'inherit',
  chromeBackgroundColor: 'var(--mat-sys-primary)',
  fontFamily: 'inherit',
  foregroundColor: 'var(--mat-sys-on-surface)',
  headerBackgroundColor: 'var(--mat-sys-surface)',
});
