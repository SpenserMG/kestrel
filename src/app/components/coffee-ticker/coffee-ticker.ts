import { Component, signal } from '@angular/core';
import { IconButton } from '../../atoms/icon-button/icon-button';

const COFFEES: readonly string[] = [
  'Passenger Coffee and Tea',
  'Necessary Coffee Roasters',
  'Commonplace Coffee',
  'Espresso a Mano',
  'Olympia Coffee',
  'Press House Coffee',
  'Mechanic Coffee',
  'Onyx Coffee',
  'La Prima Coffee',
  'Hyperion Coffee',
  'Square One'
];

@Component({
  selector: 'app-coffee-ticker',
  imports: [IconButton],
  templateUrl: './coffee-ticker.html',
  styleUrl: './coffee-ticker.scss',
})
export class CoffeeTicker {
  readonly coffees = COFFEES;
  readonly isPaused = signal(false);

  togglePause(): void {
    this.isPaused.update((paused) => !paused);
  }
}
