import { Component } from '@angular/core';
import { ThemeSwitcher } from '../theme-switcher/theme-switcher';

@Component({
  selector: 'app-header',
  imports: [ThemeSwitcher],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {}
