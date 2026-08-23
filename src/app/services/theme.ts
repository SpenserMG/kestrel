import { DOCUMENT } from '@angular/common';
import { effect, inject, Service, signal } from '@angular/core';

export type ThemeName = 'light-theme' | 'dark-theme';

const DEFAULT_THEME: ThemeName = 'light-theme';
const THEME_CLASSES: ThemeName[] = ['light-theme', 'dark-theme'];

@Service()
export class Theme {
  private readonly document = inject(DOCUMENT);

  readonly current = signal<ThemeName>(DEFAULT_THEME);

  constructor() {
    effect(() => {
      const root = this.document.documentElement;
      root.classList.remove(...THEME_CLASSES);
      root.classList.add(this.current());
    });
  }

  setTheme(theme: ThemeName): void {
    this.current.set(theme);
  }
}
