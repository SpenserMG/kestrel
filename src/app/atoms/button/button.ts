import { Component, input, output } from '@angular/core';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-button',
  imports: [MatButton],
  templateUrl: './button.html',
  styleUrl: './button.scss',
})
export class Button {
  readonly variant = input<'filled' | 'outlined' | 'text'>('filled');
  readonly disabled = input(false);
  readonly label = input.required<string>();
  readonly pressed = output<void>();
}
