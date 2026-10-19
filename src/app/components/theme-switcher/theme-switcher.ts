import { Component, inject, input } from '@angular/core';
import { MatFormFieldAppearance } from '@angular/material/form-field';
import { Select, SelectOption } from '../../atoms/select/select';
import { Theme, ThemeName } from '../../services/theme';

const THEME_OPTIONS: SelectOption[] = [
  { value: 'light-theme', label: 'Light Theme', icon: 'sun' },
  { value: 'dark-theme', label: 'Dark Theme', icon: 'moon' },
];

@Component({
  selector: 'app-theme-switcher',
  imports: [Select],
  templateUrl: './theme-switcher.html',
  styleUrl: './theme-switcher.scss',
})
export class ThemeSwitcher {
  protected readonly theme = inject(Theme);
  protected readonly options = THEME_OPTIONS;
  readonly appearance = input<MatFormFieldAppearance>('fill');

  protected onValueChange(value: string): void {
    this.theme.setTheme(value as ThemeName);
  }
}
