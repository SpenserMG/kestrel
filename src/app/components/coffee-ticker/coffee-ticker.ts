import { Component, inject, signal } from '@angular/core';
import { IconButton } from '../../atoms/icon-button/icon-button';
import { CoffeeService } from '../../services/coffee.service';

@Component({
  selector: 'app-coffee-ticker',
  imports: [IconButton],
  templateUrl: './coffee-ticker.html',
  styleUrl: './coffee-ticker.scss',
})
export class CoffeeTicker {
  private readonly coffeeService = inject(CoffeeService);

  readonly coffees = this.coffeeService.coffees.value;
  readonly isPaused = signal(false);

  togglePause(): void {
    this.isPaused.update((paused) => !paused);
  }
}
