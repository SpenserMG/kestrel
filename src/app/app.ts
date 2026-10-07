import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatListItem, MatListItemIcon, MatNavList } from '@angular/material/list';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import { RouterLink, RouterOutlet } from '@angular/router';
import { map } from 'rxjs';
import { Icon } from './atoms/icon/icon';
import { IconButton } from './atoms/icon-button/icon-button';
import { Header } from './components/header/header';

// Matches Tailwind's `sm` breakpoint (640px) so the layout switch lines up with the app's other responsive behavior.
const PHONE_QUERY = '(max-width: 639.98px)';

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
  private readonly breakpointObserver = inject(BreakpointObserver);

  readonly navCollapsed = signal(false);

  private readonly isPhone = toSignal(
    this.breakpointObserver.observe(PHONE_QUERY).pipe(map((state) => state.matches)),
    { initialValue: false },
  );

  // On phone, an expanded nav overlays the full viewport instead of squeezing
  // the content into a leftover sliver.
  protected readonly isFullWidthOverlay = computed(() => this.isPhone() && !this.navCollapsed());

  readonly sidenavMode = computed(() => (this.isFullWidthOverlay() ? 'over' : 'side'));

  // Drives both the sidenav's own width and mat-sidenav-content's margin, so
  // the content area resizes in lockstep with the nav instead of relying on
  // MatDrawerContainer's own margin calculation (which only re-measures on
  // open/close toggles, not on width changes like this collapse/expand).
  readonly navWidth = computed(() => {
    if (this.isFullWidthOverlay()) {
      return '100%';
    }
    return this.navCollapsed() ? '3.5rem' : '16rem';
  });

  // 'over' mode floats the sidenav above the content, so no margin should be reserved for it.
  readonly contentMargin = computed(() => (this.sidenavMode() === 'over' ? '0' : this.navWidth()));

  toggleNav(): void {
    this.navCollapsed.update((collapsed) => !collapsed);
  }
}
