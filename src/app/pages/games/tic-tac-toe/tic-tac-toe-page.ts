import { Component, computed, inject, signal } from '@angular/core';
import { MatRipple } from '@angular/material/core';
import { Button } from '../../../atoms/button/button';
import { CanComponentDeactivate } from '../../../guards/confirm-exit.guard';
import { GameStatsService } from '../../../services/game-stats.service';

type Player = 'X' | 'O';
type Cell = Player | null;

const WIN_LINES: readonly (readonly [number, number, number])[] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

@Component({
  selector: 'app-tic-tac-toe-page',
  imports: [Button, MatRipple],
  templateUrl: './tic-tac-toe-page.html',
  styleUrl: './tic-tac-toe-page.scss',
})
export class TicTacToePage implements CanComponentDeactivate {
  private readonly gameStats = inject(GameStatsService);

  readonly board = signal<Cell[]>(Array(9).fill(null));
  readonly currentPlayer = signal<Player>('X');
  readonly stats = this.gameStats.ticTacToe;

  readonly winner = computed<Player | null>(() => {
    const board = this.board();
    for (const [a, b, c] of WIN_LINES) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  });

  readonly isDraw = computed(() => !this.winner() && this.board().every((cell) => cell !== null));

  readonly isGameOver = computed(() => this.winner() !== null || this.isDraw());

  selectCell(index: number): void {
    if (this.isGameOver() || this.board()[index]) {
      return;
    }

    const player = this.currentPlayer();
    this.board.update((board) => {
      const next = [...board];
      next[index] = player;
      return next;
    });

    const winner = this.winner();
    if (winner) {
      this.gameStats.recordTicTacToeResult(winner === 'X' ? 'x' : 'o');
    } else if (this.isDraw()) {
      this.gameStats.recordTicTacToeResult('draw');
    } else {
      this.currentPlayer.set(player === 'X' ? 'O' : 'X');
    }
  }

  reset(): void {
    this.board.set(Array(9).fill(null));
    this.currentPlayer.set('X');
  }

  hasUnsavedProgress(): boolean {
    return !this.isGameOver() && this.board().some((cell) => cell !== null);
  }
}
