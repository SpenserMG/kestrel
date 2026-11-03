import { Component, inject, input } from '@angular/core';
import { MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { IconButton } from '../icon-button/icon-button';

@Component({
  selector: 'app-dialog',
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, IconButton],
  templateUrl: './dialog.html',
  styleUrl: './dialog.scss',
})
export class Dialog {
  readonly title = input.required<string>();
  private readonly dialogRef = inject(MatDialogRef, { optional: true });

  protected close(): void {
    this.dialogRef?.close();
  }
}
