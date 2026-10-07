import { DOCUMENT } from '@angular/common';
import { effect, inject, Service, signal } from '@angular/core';

export type ThemeName = 'light-theme' | 'dark-theme';

const DEFAULT_THEME: ThemeName = 'light-theme';
const THEME_CLASSES: ThemeName[] = ['light-theme', 'dark-theme'];
const STORAGE_KEY = 'kestrel-theme';

function isThemeName(value: string | null): value is ThemeName {
  return THEME_CLASSES.includes(value as ThemeName);
}

@Service()
export class Theme {
  private readonly document = inject(DOCUMENT);

  readonly current = signal<ThemeName>(this.readStoredTheme() ?? DEFAULT_THEME);

  constructor() {
    effect(() => {
      const root = this.document.documentElement;
      root.classList.remove(...THEME_CLASSES);
      root.classList.add(this.current());
    });
  }

  setTheme(theme: ThemeName): void {
    this.current.set(theme);
    this.storeTheme(theme);
  }

  private readStoredTheme(): ThemeName | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return isThemeName(stored) ? stored : null;
    } catch {
      return null;
    }
  }

  private storeTheme(theme: ThemeName): void {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Storage may be unavailable (e.g. private browsing); theme still applies for the session.
    }
  }
}
