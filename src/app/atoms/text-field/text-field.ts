import { Component, effect, input, model, output, viewChild } from '@angular/core';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';

export type TextFieldType = 'text' | 'email';

@Component({
  selector: 'app-text-field',
  imports: [MatFormField, MatLabel, MatError, MatInput],
  templateUrl: './text-field.html',
  styleUrl: './text-field.scss',
})
export class TextField {
  readonly label = input.required<string>();
  readonly type = input<TextFieldType>('text');
  readonly multiline = input(false);
  readonly errorMessage = input<string | null>(null);
  readonly value = model.required<string>();
  readonly touch = output<void>();

  // MatFormField only renders its projected <mat-error> once the underlying
  // MatInput reports errorState — which normally comes from a bound
  // NgControl. There's no NgControl here (the atom exposes a plain `value`
  // model instead, to stay consistent with the other atoms), so errorState
  // is bridged in manually from the errorMessage input.
  private readonly matInput = viewChild(MatInput);

  constructor() {
    effect(() => {
      const control = this.matInput();
      if (control) {
        control.errorState = this.errorMessage() !== null;
        // Setting errorState directly doesn't itself prompt MatFormField to
        // re-check it — that normally happens as a side effect of the
        // NgControl-driven updateErrorState() this atom bypasses.
        control.stateChanges.next();
      }
    });
  }

  protected onInput(event: Event): void {
    this.value.set((event.target as HTMLInputElement | HTMLTextAreaElement).value);
  }
}
