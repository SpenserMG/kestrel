import { Component, input, output } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { Icon } from '../icon/icon';

@Component({
  selector: 'app-icon-button',
  imports: [MatIconButton, Icon],
  templateUrl: './icon-button.html',
  styleUrl: './icon-button.scss',
})
export class IconButton {
  readonly icon = input.required<string>();
  readonly label = input.required<string>();
  readonly disabled = input(false);
  readonly pressed = output<void>();
}
