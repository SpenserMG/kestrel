import {
  afterNextRender,
  ChangeDetectorRef,
  Component,
  computed,
  inject,
  input,
  model,
} from '@angular/core';
import { MatOption } from '@angular/material/core';
import { MatSelect, MatSelectTrigger } from '@angular/material/select';
import { MatFormField, MatFormFieldAppearance } from '@angular/material/form-field';
import { Icon } from '../icon/icon';

export interface SelectOption {
  value: string;
  label: string;
  icon?: string;
}

@Component({
  selector: 'app-select',
  imports: [MatFormField, MatSelect, MatSelectTrigger, MatOption, Icon],
  templateUrl: './select.html',
  styleUrl: './select.scss',
})
export class Select {
  readonly label = input.required<string>();
  readonly options = input.required<SelectOption[]>();
  readonly value = model.required<string>();
  readonly appearance = input<MatFormFieldAppearance>('fill');

  // MatSelect's default closed-state trigger only ever renders the selected
  // option's plain text (viewValue) — it can't show the icon. A projected
  // <mat-select-trigger> is Material's supported way to override that
  // closed-state display with our own icon+label markup.
  protected readonly selectedOption = computed(() =>
    this.options().find((option) => option.value === this.value()),
  );

  constructor() {
    // MatSelect resolves its initial selection inside a bare
    // `Promise.resolve().then()` with no signal write or `markForCheck()` of
    // its own, so in a zoneless app that update can go unnoticed and leave
    // the trigger showing blank until something unrelated triggers a tick.
    const cdr = inject(ChangeDetectorRef);
    afterNextRender(() => {
      queueMicrotask(() => cdr.markForCheck());
    });
  }
}
