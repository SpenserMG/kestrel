import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  beforeEach(() => {
    document.documentElement.className = '';
    localStorage.clear();
  });

  it('defaults to light-theme and applies it to the document root', () => {
    const theme = TestBed.inject(ThemeService);
    TestBed.tick();

    expect(theme.current()).toBe('light-theme');
    expect(document.documentElement.classList.contains('light-theme')).toBe(true);
  });

  it('switches the document root class when setTheme is called', () => {
    const theme = TestBed.inject(ThemeService);

    theme.setTheme('dark-theme');
    TestBed.tick();

    expect(theme.current()).toBe('dark-theme');
    expect(document.documentElement.classList.contains('dark-theme')).toBe(true);
    expect(document.documentElement.classList.contains('light-theme')).toBe(false);
  });

  it('persists the selected theme to localStorage', () => {
    const theme = TestBed.inject(ThemeService);

    theme.setTheme('dark-theme');

    expect(localStorage.getItem('kestrel-theme')).toBe('dark-theme');
  });

  it('restores the previously stored theme on init', () => {
    localStorage.setItem('kestrel-theme', 'dark-theme');

    const theme = TestBed.inject(ThemeService);
    TestBed.tick();

    expect(theme.current()).toBe('dark-theme');
    expect(document.documentElement.classList.contains('dark-theme')).toBe(true);
  });

  it('falls back to the default theme when localStorage holds an invalid value', () => {
    localStorage.setItem('kestrel-theme', 'not-a-real-theme');

    const theme = TestBed.inject(ThemeService);
    TestBed.tick();

    expect(theme.current()).toBe('light-theme');
  });
});
