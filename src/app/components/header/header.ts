import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ThemeSwitcher } from '../theme-switcher/theme-switcher';
import { ProfileButton } from '../profile-button/profile-button';

@Component({
  selector: 'app-header',
  imports: [RouterLink, ThemeSwitcher, ProfileButton],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {}
