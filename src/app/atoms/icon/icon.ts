import { Component, computed, inject, input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import {
  Anchor,
  Bomb,
  Cake,
  ChevronLeft,
  ChevronRight,
  Diamond,
  Flag,
  Flower2,
  Gamepad2,
  Heart,
  HelpCircle,
  Home,
  Leaf,
  Menu,
  Moon,
  Pause,
  PawPrint,
  Play,
  Rocket,
  Star,
  Sun,
  Timer,
  Umbrella,
  Zap,
} from 'lucide-static';

const ICONS: Record<string, string> = {
  anchor: Anchor,
  bomb: Bomb,
  cake: Cake,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  diamond: Diamond,
  flag: Flag,
  'flower-2': Flower2,
  'gamepad-2': Gamepad2,
  heart: Heart,
  'help-circle': HelpCircle,
  home: Home,
  leaf: Leaf,
  menu: Menu,
  moon: Moon,
  pause: Pause,
  'paw-print': PawPrint,
  play: Play,
  rocket: Rocket,
  star: Star,
  sun: Sun,
  timer: Timer,
  umbrella: Umbrella,
  zap: Zap,
};

export type IconName = keyof typeof ICONS;

@Component({
  selector: 'app-icon',
  templateUrl: './icon.html',
  styleUrl: './icon.scss',
  host: {
    'aria-hidden': 'true',
  },
})
export class Icon {
  private readonly sanitizer = inject(DomSanitizer);
  readonly name = input.required<string>();
  readonly strokeWidth = input<number>(2);

  protected readonly svg = computed<SafeHtml>(() => {
    const markup = ICONS[this.name()];
    if (!markup) {
      throw new Error(`Unknown icon name: "${this.name()}"`);
    }
    // Drop the library's hardcoded 24x24 width/height attributes so size is
    // fully controlled by CSS (see icon.scss) instead of fighting attribute
    // specificity at every call site that needs a different icon size.
    const sized = markup
      .replace(/\s(width|height)="[^"]*"/g, '')
      .replace(/stroke-width="[^"]*"/, `stroke-width="${this.strokeWidth()}"`);
    return this.sanitizer.bypassSecurityTrustHtml(sized);
  });
}
