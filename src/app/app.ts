import { Component, computed, signal } from '@angular/core';
import { MatListItem, MatListItemIcon, MatNavList } from '@angular/material/list';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Icon } from './atoms/icon/icon';
import { IconButton } from './atoms/icon-button/icon-button';
import { Header } from './components/header/header';

@Component({
  imports: [
    MatSidenavContainer,
    MatSidenav,
    MatSidenavContent,
    MatNavList,
    MatListItem,
    MatListItemIcon,
    RouterLink,
    RouterOutlet,
    Icon,
    IconButton,
    Header,
  ],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  readonly navCollapsed = signal(false);

  // Drives both the sidenav's own width and mat-sidenav-content's margin, so
  // the content area resizes in lockstep with the nav instead of relying on
  // MatDrawerContainer's own margin calculation (which only re-measures on
  // open/close toggles, not on width changes like this collapse/expand).
  readonly navWidth = computed(() => (this.navCollapsed() ? '3.5rem' : '16rem'));

  toggleNav(): void {
    this.navCollapsed.update((collapsed) => !collapsed);
  }
}
