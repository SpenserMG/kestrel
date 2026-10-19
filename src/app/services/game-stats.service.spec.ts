import { TestBed } from '@angular/core/testing';
import { GameStatsService } from './game-stats.service';

describe('GameStatsService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('defaults to zeroed tic-tac-toe stats', () => {
    const gameStats = TestBed.inject(GameStatsService);

    expect(gameStats.ticTacToe()).toEqual({ xWins: 0, oWins: 0, draws: 0 });
  });

  it('increments the matching counter when a result is recorded', () => {
    const gameStats = TestBed.inject(GameStatsService);

    gameStats.recordTicTacToeResult('x');
    gameStats.recordTicTacToeResult('x');
    gameStats.recordTicTacToeResult('o');
    gameStats.recordTicTacToeResult('draw');

    expect(gameStats.ticTacToe()).toEqual({ xWins: 2, oWins: 1, draws: 1 });
  });

  it('persists stats to localStorage across instances', () => {
    const first = TestBed.inject(GameStatsService);
    first.recordTicTacToeResult('x');
    TestBed.tick();

    TestBed.resetTestingModule();
    const second = TestBed.inject(GameStatsService);

    expect(second.ticTacToe()).toEqual({ xWins: 1, oWins: 0, draws: 0 });
  });

  it('defaults to no memory match best moves', () => {
    const gameStats = TestBed.inject(GameStatsService);

    expect(gameStats.memoryMatch()).toEqual({ bestMoves: {} });
  });

  it('records a memory match win as the best score for its difficulty', () => {
    const gameStats = TestBed.inject(GameStatsService);

    gameStats.recordMemoryMatchWin('easy', 12);

    expect(gameStats.memoryMatch()).toEqual({ bestMoves: { easy: 12 } });
  });

  it('only keeps the lower move count as the best score', () => {
    const gameStats = TestBed.inject(GameStatsService);

    gameStats.recordMemoryMatchWin('easy', 12);
    gameStats.recordMemoryMatchWin('easy', 20);
    gameStats.recordMemoryMatchWin('easy', 8);

    expect(gameStats.memoryMatch()).toEqual({ bestMoves: { easy: 8 } });
  });

  it('tracks best moves independently per difficulty', () => {
    const gameStats = TestBed.inject(GameStatsService);

    gameStats.recordMemoryMatchWin('easy', 10);
    gameStats.recordMemoryMatchWin('hard', 30);

    expect(gameStats.memoryMatch()).toEqual({ bestMoves: { easy: 10, hard: 30 } });
  });

  it('defaults to zeroed connect four stats', () => {
    const gameStats = TestBed.inject(GameStatsService);

    expect(gameStats.connectFour()).toEqual({ redWins: 0, yellowWins: 0, draws: 0 });
  });

  it('increments the matching counter when a connect four result is recorded', () => {
    const gameStats = TestBed.inject(GameStatsService);

    gameStats.recordConnectFourResult('red');
    gameStats.recordConnectFourResult('red');
    gameStats.recordConnectFourResult('yellow');
    gameStats.recordConnectFourResult('draw');

    expect(gameStats.connectFour()).toEqual({ redWins: 2, yellowWins: 1, draws: 1 });
  });
});
