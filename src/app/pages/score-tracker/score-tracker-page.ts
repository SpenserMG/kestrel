import { Component, computed, signal } from '@angular/core';
import { Button } from '../../atoms/button/button';
import { CanComponentDeactivate } from '../../guards/confirm-exit.guard';

const STORAGE_KEY = 'kestrel.score-tracker';
const INITIAL_ROWS = 2;
const INITIAL_COLUMNS = 4;

interface StoredState {
  cells: string[][];
}

function createEmptyGrid(rows: number, columns: number): string[][] {
  return Array.from({ length: rows }, () => Array.from({ length: columns }, () => ''));
}

function loadStoredCells(): string[][] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredState).cells : null;
  } catch {
    return null;
  }
}

function hasAnyValue(line: string[]): boolean {
  return line.some((cell) => cell.trim() !== '');
}

@Component({
  selector: 'app-score-tracker-page',
  imports: [Button],
  templateUrl: './score-tracker-page.html',
  styleUrl: './score-tracker-page.scss',
})
export class ScoreTrackerPage implements CanComponentDeactivate {
  readonly cells = signal<string[][]>(
    loadStoredCells() ?? createEmptyGrid(INITIAL_ROWS, INITIAL_COLUMNS),
  );
  readonly hasUnsavedChanges = signal(false);

  readonly rowCount = computed(() => this.cells().length);
  readonly columnCount = computed(() => this.cells()[0]?.length ?? 0);

  updateCell(row: number, column: number, event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.cells.update((cells) => {
      const next = cells.map((r) => [...r]);
      next[row][column] = value;
      return next;
    });
    this.hasUnsavedChanges.set(true);
  }

  addRow(): void {
    this.cells.update((cells) => [...cells, Array.from({ length: this.columnCount() }, () => '')]);
    this.hasUnsavedChanges.set(true);
  }

  addColumn(): void {
    this.cells.update((cells) => cells.map((row) => [...row, '']));
    this.hasUnsavedChanges.set(true);
  }

  removeRow(): void {
    if (this.rowCount() <= 1) {
      return;
    }
    const lastRow = this.cells()[this.rowCount() - 1];
    if (hasAnyValue(lastRow) && !confirm('This row has values in it. Remove it anyway?')) {
      return;
    }
    this.cells.update((cells) => cells.slice(0, -1));
    this.hasUnsavedChanges.set(true);
  }

  removeColumn(): void {
    if (this.columnCount() <= 1) {
      return;
    }
    const lastColumnIndex = this.columnCount() - 1;
    const lastColumn = this.cells().map((row) => row[lastColumnIndex]);
    if (hasAnyValue(lastColumn) && !confirm('This column has values in it. Remove it anyway?')) {
      return;
    }
    this.cells.update((cells) => cells.map((row) => row.slice(0, -1)));
    this.hasUnsavedChanges.set(true);
  }

  clearTable(): void {
    if (!confirm('Clear the entire table? This cannot be undone.')) {
      return;
    }
    this.cells.set(createEmptyGrid(INITIAL_ROWS, INITIAL_COLUMNS));
    this.hasUnsavedChanges.set(true);
  }

  save(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ cells: this.cells() } satisfies StoredState));
      this.hasUnsavedChanges.set(false);
    } catch {
      // Storage may be unavailable (e.g. private browsing); edits still work for the session.
    }
  }

  hasUnsavedProgress(): boolean {
    return this.hasUnsavedChanges();
  }
}
