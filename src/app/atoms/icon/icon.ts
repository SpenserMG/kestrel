import { Component, computed, inject, input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import {
  Anchor,
  Birdhouse,
  Bomb,
  Cake,
  ChevronLeft,
  ChevronRight,
  Diamond,
  Dices,
  FileSpreadsheet,
  Flag,
  Flower2,
  Gamepad2,
  Grid2X2Plus,
  Grid3x2,
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
  Table,
  Timer,
  Trophy,
  Umbrella,
  UserCircle,
  X,
  Zap,
} from 'lucide-static';

const ICONS: Record<string, string> = {
  anchor: Anchor,
  birdhouse: Birdhouse,
  bomb: Bomb,
  cake: Cake,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  diamond: Diamond,
  dices: Dices,
  flag: Flag,
  'flower-2': Flower2,
  'file-spreadsheet': FileSpreadsheet,
  'gamepad-2': Gamepad2,
  'grid-2x2-plus': Grid2X2Plus,
  'grid-3x2': Grid3x2,
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
  table: Table,
  timer: Timer,
  trophy: Trophy,
  umbrella: Umbrella,
  'user-circle': UserCircle,
  x: X,
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
    // Scoped to the opening <svg> tag only — some icons (e.g. Pause) have
    // their own width/height on inner shapes like <rect> that must stay.
    const sized = markup
      .replace(/^(\s*<svg\b[^>]*)>/, (_match, openTag) =>
        `${openTag.replace(/\s(width|height)="[^"]*"/g, '')}>`,
      )
      .replace(/stroke-width="[^"]*"/, `stroke-width="${this.strokeWidth()}"`);
    return this.sanitizer.bypassSecurityTrustHtml(sized);
  });
}
