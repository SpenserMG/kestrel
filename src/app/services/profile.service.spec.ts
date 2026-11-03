import { TestBed } from '@angular/core/testing';
import { ProfileService } from './profile.service';

describe('ProfileService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('defaults to no saved profile', () => {
    const profile = TestBed.inject(ProfileService);

    expect(profile.profile()).toBeNull();
  });

  it('saves a profile', () => {
    const profile = TestBed.inject(ProfileService);

    profile.save({
      displayName: 'Jane',
      favoriteGame: 'minesweeper',
      notifyOnHighScores: true,
    });

    expect(profile.profile()).toEqual({
      displayName: 'Jane',
      favoriteGame: 'minesweeper',
      notifyOnHighScores: true,
    });
  });

  it('persists the saved profile to localStorage across instances', () => {
    const first = TestBed.inject(ProfileService);
    first.save({
      displayName: 'Jane',
      favoriteGame: 'none',
      notifyOnHighScores: false,
    });
    TestBed.tick();

    TestBed.resetTestingModule();
    const second = TestBed.inject(ProfileService);

    expect(second.profile()?.displayName).toBe('Jane');
  });
});
