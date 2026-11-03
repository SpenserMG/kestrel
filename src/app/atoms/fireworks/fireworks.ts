import { Component, DestroyRef, effect, inject, input, signal } from '@angular/core';

interface Burst {
  id: number;
  leftPercent: number;
  topPercent: number;
  delayMs: number;
  color: string;
}

const PARTICLE_COUNT = 10;
const BURST_COUNT = 4;
const DISPLAY_DURATION_MS = 1400;
const BURST_COLOR_VARS = [
  '--mat-sys-primary',
  '--mat-sys-tertiary',
  '--mat-sys-secondary',
  '--mat-sys-error',
];

function createBursts(): Burst[] {
  return Array.from({ length: BURST_COUNT }, (_, id) => ({
    id,
    leftPercent: 15 + Math.random() * 70,
    topPercent: 15 + Math.random() * 50,
    delayMs: Math.random() * 300,
    color: `var(${BURST_COLOR_VARS[Math.floor(Math.random() * BURST_COLOR_VARS.length)]})`,
  }));
}

@Component({
  selector: 'app-fireworks',
  imports: [],
  templateUrl: './fireworks.html',
  styleUrl: './fireworks.scss',
})
export class Fireworks {
  readonly active = input(false);

  protected readonly particleAngles = Array.from(
    { length: PARTICLE_COUNT },
    (_, i) => (360 / PARTICLE_COUNT) * i,
  );

  protected readonly visible = signal(false);
  protected readonly bursts = signal<Burst[]>([]);

  private readonly destroyRef = inject(DestroyRef);
  private hideHandle: ReturnType<typeof setTimeout> | undefined;

  constructor() {
    effect(() => {
      if (this.active()) {
        this.bursts.set(createBursts());
        this.visible.set(true);
        this.scheduleHide();
      } else {
        this.visible.set(false);
        this.clearHide();
      }
    });

    this.destroyRef.onDestroy(() => this.clearHide());
  }

  private scheduleHide(): void {
    this.clearHide();
    this.hideHandle = setTimeout(() => this.visible.set(false), DISPLAY_DURATION_MS);
  }

  private clearHide(): void {
    if (this.hideHandle) {
      clearTimeout(this.hideHandle);
      this.hideHandle = undefined;
    }
  }
}
