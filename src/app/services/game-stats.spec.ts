import { TestBed } from '@angular/core/testing';
import { GameStats } from './game-stats';

describe('GameStats', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('defaults to zeroed tic-tac-toe stats', () => {
    const gameStats = TestBed.inject(GameStats);

    expect(gameStats.ticTacToe()).toEqual({ xWins: 0, oWins: 0, draws: 0 });
  });

  it('increments the matching counter when a result is recorded', () => {
    const gameStats = TestBed.inject(GameStats);

    gameStats.recordTicTacToeResult('x');
    gameStats.recordTicTacToeResult('x');
    gameStats.recordTicTacToeResult('o');
    gameStats.recordTicTacToeResult('draw');

    expect(gameStats.ticTacToe()).toEqual({ xWins: 2, oWins: 1, draws: 1 });
  });

  it('persists stats to localStorage across instances', () => {
    const first = TestBed.inject(GameStats);
    first.recordTicTacToeResult('x');
    TestBed.tick();

    TestBed.resetTestingModule();
    const second = TestBed.inject(GameStats);

    expect(second.ticTacToe()).toEqual({ xWins: 1, oWins: 0, draws: 0 });
  });
});
