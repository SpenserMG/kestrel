import { effect, Service, signal } from '@angular/core';

export type TicTacToeResult = 'x' | 'o' | 'draw';

export interface TicTacToeStats {
  xWins: number;
  oWins: number;
  draws: number;
}

const STORAGE_KEY = 'kestrel.tic-tac-toe-stats';
const EMPTY_STATS: TicTacToeStats = { xWins: 0, oWins: 0, draws: 0 };

@Service()
export class GameStats {
  readonly ticTacToe = signal<TicTacToeStats>(this.load());

  constructor() {
    effect(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.ticTacToe()));
    });
  }

  recordTicTacToeResult(result: TicTacToeResult): void {
    this.ticTacToe.update((stats) => ({
      xWins: stats.xWins + (result === 'x' ? 1 : 0),
      oWins: stats.oWins + (result === 'o' ? 1 : 0),
      draws: stats.draws + (result === 'draw' ? 1 : 0),
    }));
  }

  private load(): TicTacToeStats {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as TicTacToeStats) : EMPTY_STATS;
    } catch {
      return EMPTY_STATS;
    }
  }
}
