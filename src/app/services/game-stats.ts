import { effect, Service, signal } from '@angular/core';

export type TicTacToeResult = 'x' | 'o' | 'draw';

export interface TicTacToeStats {
  xWins: number;
  oWins: number;
  draws: number;
}

export type MemoryMatchDifficulty = 'easy' | 'medium' | 'hard';

export interface MemoryMatchStats {
  bestMoves: Partial<Record<MemoryMatchDifficulty, number>>;
}

const TIC_TAC_TOE_STORAGE_KEY = 'kestrel.tic-tac-toe-stats';
const MEMORY_MATCH_STORAGE_KEY = 'kestrel.memory-match-stats';
const EMPTY_TIC_TAC_TOE_STATS: TicTacToeStats = { xWins: 0, oWins: 0, draws: 0 };
const EMPTY_MEMORY_MATCH_STATS: MemoryMatchStats = { bestMoves: {} };

@Service()
export class GameStats {
  readonly ticTacToe = signal<TicTacToeStats>(this.loadTicTacToe());
  readonly memoryMatch = signal<MemoryMatchStats>(this.loadMemoryMatch());

  constructor() {
    effect(() => {
      localStorage.setItem(TIC_TAC_TOE_STORAGE_KEY, JSON.stringify(this.ticTacToe()));
    });
    effect(() => {
      localStorage.setItem(MEMORY_MATCH_STORAGE_KEY, JSON.stringify(this.memoryMatch()));
    });
  }

  recordTicTacToeResult(result: TicTacToeResult): void {
    this.ticTacToe.update((stats) => ({
      xWins: stats.xWins + (result === 'x' ? 1 : 0),
      oWins: stats.oWins + (result === 'o' ? 1 : 0),
      draws: stats.draws + (result === 'draw' ? 1 : 0),
    }));
  }

  recordMemoryMatchWin(difficulty: MemoryMatchDifficulty, moves: number): void {
    this.memoryMatch.update((stats) => {
      const currentBest = stats.bestMoves[difficulty];
      if (currentBest !== undefined && currentBest <= moves) {
        return stats;
      }
      return { bestMoves: { ...stats.bestMoves, [difficulty]: moves } };
    });
  }

  private loadTicTacToe(): TicTacToeStats {
    try {
      const raw = localStorage.getItem(TIC_TAC_TOE_STORAGE_KEY);
      return raw ? (JSON.parse(raw) as TicTacToeStats) : EMPTY_TIC_TAC_TOE_STATS;
    } catch {
      return EMPTY_TIC_TAC_TOE_STATS;
    }
  }

  private loadMemoryMatch(): MemoryMatchStats {
    try {
      const raw = localStorage.getItem(MEMORY_MATCH_STORAGE_KEY);
      return raw ? (JSON.parse(raw) as MemoryMatchStats) : EMPTY_MEMORY_MATCH_STATS;
    } catch {
      return EMPTY_MEMORY_MATCH_STATS;
    }
  }
}
