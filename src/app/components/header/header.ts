import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProfileButton } from '../profile-button/profile-button';

@Component({
  selector: 'app-header',
  imports: [RouterLink, ProfileButton],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {}
