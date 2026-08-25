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

export type ConnectFourResult = 'red' | 'yellow' | 'draw';

export interface ConnectFourStats {
  redWins: number;
  yellowWins: number;
  draws: number;
}

const TIC_TAC_TOE_STORAGE_KEY = 'kestrel.tic-tac-toe-stats';
const MEMORY_MATCH_STORAGE_KEY = 'kestrel.memory-match-stats';
const CONNECT_FOUR_STORAGE_KEY = 'kestrel.connect-four-stats';
const EMPTY_TIC_TAC_TOE_STATS: TicTacToeStats = { xWins: 0, oWins: 0, draws: 0 };
const EMPTY_MEMORY_MATCH_STATS: MemoryMatchStats = { bestMoves: {} };
const EMPTY_CONNECT_FOUR_STATS: ConnectFourStats = { redWins: 0, yellowWins: 0, draws: 0 };

@Service()
export class GameStats {
  readonly ticTacToe = signal<TicTacToeStats>(this.loadTicTacToe());
  readonly memoryMatch = signal<MemoryMatchStats>(this.loadMemoryMatch());
  readonly connectFour = signal<ConnectFourStats>(this.loadConnectFour());

  constructor() {
    effect(() => {
      localStorage.setItem(TIC_TAC_TOE_STORAGE_KEY, JSON.stringify(this.ticTacToe()));
    });
    effect(() => {
      localStorage.setItem(MEMORY_MATCH_STORAGE_KEY, JSON.stringify(this.memoryMatch()));
    });
    effect(() => {
      localStorage.setItem(CONNECT_FOUR_STORAGE_KEY, JSON.stringify(this.connectFour()));
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

  recordConnectFourResult(result: ConnectFourResult): void {
    this.connectFour.update((stats) => ({
      redWins: stats.redWins + (result === 'red' ? 1 : 0),
      yellowWins: stats.yellowWins + (result === 'yellow' ? 1 : 0),
      draws: stats.draws + (result === 'draw' ? 1 : 0),
    }));
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

  private loadConnectFour(): ConnectFourStats {
    try {
      const raw = localStorage.getItem(CONNECT_FOUR_STORAGE_KEY);
      return raw ? (JSON.parse(raw) as ConnectFourStats) : EMPTY_CONNECT_FOUR_STATS;
    } catch {
      return EMPTY_CONNECT_FOUR_STATS;
    }
  }
}
