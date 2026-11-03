import { Component, input, model, output } from '@angular/core';
import { MatSlideToggle, MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-toggle',
  imports: [MatSlideToggle],
  templateUrl: './toggle.html',
  styleUrl: './toggle.scss',
})
export class Toggle {
  readonly label = input.required<string>();
  readonly checked = model.required<boolean>();
  readonly touch = output<void>();

  protected onChange(event: MatSlideToggleChange): void {
    this.checked.set(event.checked);
  }
}
