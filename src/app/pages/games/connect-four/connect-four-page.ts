import { Component, computed, inject, signal } from '@angular/core';
import { MatRipple } from '@angular/material/core';
import { Button } from '../../../atoms/button/button';
import { GameStats } from '../../../services/game-stats';

type Player = 'red' | 'yellow';
type Cell = Player | null;

const ROWS = 6;
const COLS = 7;

// Only forward-facing directions are needed: scanning every cell as a
// potential run-start means each direction's mirror (left, up, up-left,
// up-right) gets covered when the loop reaches that run's actual start.
const DIRECTIONS: readonly (readonly [number, number])[] = [
  [0, 1],
  [1, 0],
  [1, 1],
  [1, -1],
];

function createEmptyBoard(): Cell[][] {
  return Array.from({ length: ROWS }, () => Array<Cell>(COLS).fill(null));
}

function computeWinner(board: Cell[][]): Player | null {
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const player = board[row][col];
      if (!player) {
        continue;
      }

      for (const [dRow, dCol] of DIRECTIONS) {
        let count = 1;
        let r = row + dRow;
        let c = col + dCol;
        while (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === player) {
          count++;
          r += dRow;
          c += dCol;
        }
        if (count >= 4) {
          return player;
        }
      }
    }
  }

  return null;
}

@Component({
  selector: 'app-connect-four-page',
  imports: [Button, MatRipple],
  templateUrl: './connect-four-page.html',
  styleUrl: './connect-four-page.scss',
})
export class ConnectFourPage {
  private readonly gameStats = inject(GameStats);

  readonly columns = Array.from({ length: COLS }, (_, i) => i);
  readonly rows = Array.from({ length: ROWS }, (_, i) => i);

  readonly board = signal<Cell[][]>(createEmptyBoard());
  readonly currentPlayer = signal<Player>('red');
  readonly stats = this.gameStats.connectFour;

  readonly winner = computed(() => computeWinner(this.board()));
  readonly isDraw = computed(
    () => !this.winner() && this.board().every((row) => row.every((cell) => cell !== null)),
  );
  readonly isGameOver = computed(() => this.winner() !== null || this.isDraw());

  isColumnFull(col: number): boolean {
    return this.board()[0][col] !== null;
  }

  dropPiece(col: number): void {
    if (this.isGameOver() || this.isColumnFull(col)) {
      return;
    }

    let targetRow = -1;
    for (let row = ROWS - 1; row >= 0; row--) {
      if (this.board()[row][col] === null) {
        targetRow = row;
        break;
      }
    }
    if (targetRow === -1) {
      return;
    }

    const player = this.currentPlayer();
    this.board.update((board) => {
      const next = board.map((row) => [...row]);
      next[targetRow][col] = player;
      return next;
    });

    const winner = this.winner();
    if (winner) {
      this.gameStats.recordConnectFourResult(winner);
    } else if (this.isDraw()) {
      this.gameStats.recordConnectFourResult('draw');
    } else {
      this.currentPlayer.set(player === 'red' ? 'yellow' : 'red');
    }
  }

  reset(): void {
    this.board.set(createEmptyBoard());
    this.currentPlayer.set('red');
  }
}
