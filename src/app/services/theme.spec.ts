import { TestBed } from '@angular/core/testing';
import { Theme } from './theme';

describe('Theme', () => {
  beforeEach(() => {
    document.documentElement.className = '';
  });

  it('defaults to light-theme and applies it to the document root', () => {
    const theme = TestBed.inject(Theme);
    TestBed.tick();

    expect(theme.current()).toBe('light-theme');
    expect(document.documentElement.classList.contains('light-theme')).toBe(true);
  });

  it('switches the document root class when setTheme is called', () => {
    const theme = TestBed.inject(Theme);

    theme.setTheme('dark-theme');
    TestBed.tick();

    expect(theme.current()).toBe('dark-theme');
    expect(document.documentElement.classList.contains('dark-theme')).toBe(true);
    expect(document.documentElement.classList.contains('light-theme')).toBe(false);
  });
});
