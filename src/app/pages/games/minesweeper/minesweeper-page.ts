import { Component, computed, DestroyRef, effect, inject, signal } from '@angular/core';
import { MatRipple } from '@angular/material/core';
import { Button } from '../../../atoms/button/button';
import { Icon } from '../../../atoms/icon/icon';
import { Select, SelectOption } from '../../../atoms/select/select';
import { CanComponentDeactivate } from '../../../guards/confirm-exit.guard';
import { GameStatsService, MinesweeperDifficulty } from '../../../services/game-stats.service';

interface MinesweeperCell {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  adjacentMines: number;
}

interface DifficultyConfig {
  label: string;
  rows: number;
  cols: number;
  mines: number;
}

const DIFFICULTIES: Record<MinesweeperDifficulty, DifficultyConfig> = {
  beginner: { label: 'Beginner (9x9, 10 mines)', rows: 9, cols: 9, mines: 10 },
  intermediate: { label: 'Intermediate (16x16, 40 mines)', rows: 16, cols: 16, mines: 40 },
  expert: { label: 'Expert (16x30, 99 mines)', rows: 16, cols: 30, mines: 99 },
};

const DIFFICULTY_OPTIONS: SelectOption[] = (
  Object.entries(DIFFICULTIES) as [MinesweeperDifficulty, DifficultyConfig][]
).map(([value, config]) => ({ value, label: config.label }));

function createEmptyBoard(rows: number, cols: number): MinesweeperCell[][] {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({
      isMine: false,
      isRevealed: false,
      isFlagged: false,
      adjacentMines: 0,
    })),
  );
}

function countAdjacentMines(board: MinesweeperCell[][], row: number, col: number): number {
  let count = 0;
  for (let dRow = -1; dRow <= 1; dRow++) {
    for (let dCol = -1; dCol <= 1; dCol++) {
      if (dRow === 0 && dCol === 0) {
        continue;
      }
      const r = row + dRow;
      const c = col + dCol;
      if (r >= 0 && r < board.length && c >= 0 && c < board[0].length && board[r][c].isMine) {
        count++;
      }
    }
  }
  return count;
}

// The clicked cell and its neighbors are kept mine-free so the first click
// of a game is never an instant loss, matching standard Minesweeper feel.
function placeMines(
  board: MinesweeperCell[][],
  mineCount: number,
  safeRow: number,
  safeCol: number,
): void {
  const rows = board.length;
  const cols = board[0].length;
  const isSafe = (r: number, c: number) => Math.abs(r - safeRow) <= 1 && Math.abs(c - safeCol) <= 1;

  let placed = 0;
  while (placed < mineCount) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);
    if (board[r][c].isMine || isSafe(r, c)) {
      continue;
    }
    board[r][c].isMine = true;
    placed++;
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!board[r][c].isMine) {
        board[r][c].adjacentMines = countAdjacentMines(board, r, c);
      }
    }
  }
}

// Flood-fills outward from the clicked cell through connected zero-adjacency
// cells, revealing their non-zero border — the classic Minesweeper "open up
// a region" behavior.
function revealCell(board: MinesweeperCell[][], row: number, col: number): void {
  const rows = board.length;
  const cols = board[0].length;
  const stack: [number, number][] = [[row, col]];

  while (stack.length > 0) {
    const [r, c] = stack.pop()!;
    const cell = board[r][c];
    if (cell.isRevealed || cell.isFlagged) {
      continue;
    }
    cell.isRevealed = true;

    if (cell.adjacentMines === 0 && !cell.isMine) {
      for (let dRow = -1; dRow <= 1; dRow++) {
        for (let dCol = -1; dCol <= 1; dCol++) {
          if (dRow === 0 && dCol === 0) {
            continue;
          }
          const nr = r + dRow;
          const nc = c + dCol;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !board[nr][nc].isRevealed) {
            stack.push([nr, nc]);
          }
        }
      }
    }
  }
}

@Component({
  selector: 'app-minesweeper-page',
  imports: [Button, Icon, MatRipple, Select],
  templateUrl: './minesweeper-page.html',
  styleUrl: './minesweeper-page.scss',
})
export class MinesweeperPage implements CanComponentDeactivate {
  private readonly gameStats = inject(GameStatsService);
  private readonly destroyRef = inject(DestroyRef);

  private timerHandle: ReturnType<typeof setInterval> | undefined;

  readonly difficultyOptions = DIFFICULTY_OPTIONS;
  readonly difficulty = signal<MinesweeperDifficulty>('beginner');
  readonly board = signal<MinesweeperCell[][]>(createEmptyBoard(9, 9));
  readonly elapsedSeconds = signal(0);
  readonly flagMode = signal(false);
  readonly stats = this.gameStats.minesweeper;

  readonly minesRemaining = computed(() => {
    const config = DIFFICULTIES[this.difficulty()];
    const flagged = this.board()
      .flat()
      .filter((cell) => cell.isFlagged).length;
    return config.mines - flagged;
  });

  readonly isWon = computed(() =>
    this.board()
      .flat()
      .every((cell) => cell.isMine || cell.isRevealed),
  );

  readonly isLost = computed(() =>
    this.board()
      .flat()
      .some((cell) => cell.isMine && cell.isRevealed),
  );

  readonly isGameOver = computed(() => this.isWon() || this.isLost());

  constructor() {
    effect(() => {
      if (!this.isGameOver()) {
        return;
      }
      this.stopTimer();
      if (this.isWon()) {
        this.gameStats.recordMinesweeperWin(this.difficulty(), this.elapsedSeconds());
      }
    });

    this.destroyRef.onDestroy(() => this.stopTimer());
  }

  selectDifficulty(value: string): void {
    this.difficulty.set(value as MinesweeperDifficulty);
    this.newGame();
  }

  newGame(): void {
    const config = DIFFICULTIES[this.difficulty()];
    this.board.set(createEmptyBoard(config.rows, config.cols));
    this.elapsedSeconds.set(0);
    this.flagMode.set(false);
    this.stopTimer();
  }

  toggleFlagMode(): void {
    this.flagMode.update((enabled) => !enabled);
  }

  selectCell(row: number, col: number): void {
    if (this.isGameOver() || this.board()[row][col].isRevealed) {
      return;
    }

    if (this.flagMode()) {
      this.toggleFlag(row, col);
      return;
    }

    if (this.board()[row][col].isFlagged) {
      return;
    }

    this.startTimer();

    const board = this.board().map((boardRow) => boardRow.map((cell) => ({ ...cell })));
    const hasMines = board.flat().some((cell) => cell.isMine);
    if (!hasMines) {
      placeMines(board, DIFFICULTIES[this.difficulty()].mines, row, col);
    }
    revealCell(board, row, col);
    this.board.set(board);
  }

  toggleFlag(row: number, col: number, event?: Event): void {
    event?.preventDefault();
    if (this.isGameOver() || this.board()[row][col].isRevealed) {
      return;
    }

    const board = this.board().map((boardRow) => boardRow.map((cell) => ({ ...cell })));
    board[row][col].isFlagged = !board[row][col].isFlagged;
    this.board.set(board);
  }

  hasUnsavedProgress(): boolean {
    return (
      !this.isGameOver() &&
      this.board()
        .flat()
        .some((cell) => cell.isRevealed || cell.isFlagged)
    );
  }

  private startTimer(): void {
    if (this.timerHandle) {
      return;
    }
    this.timerHandle = setInterval(
      () => this.elapsedSeconds.update((seconds) => seconds + 1),
      1000,
    );
  }

  private stopTimer(): void {
    if (this.timerHandle) {
      clearInterval(this.timerHandle);
      this.timerHandle = undefined;
    }
  }
}
