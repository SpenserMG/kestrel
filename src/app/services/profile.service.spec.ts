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
      fireworksEnabled: true,
    });

    expect(profile.profile()).toEqual({
      displayName: 'Jane',
      favoriteGame: 'minesweeper',
      fireworksEnabled: true,
    });
  });

  it('persists the saved profile to localStorage across instances', () => {
    const first = TestBed.inject(ProfileService);
    first.save({
      displayName: 'Jane',
      favoriteGame: 'none',
      fireworksEnabled: false,
    });
    TestBed.tick();

    TestBed.resetTestingModule();
    const second = TestBed.inject(ProfileService);

    expect(second.profile()?.displayName).toBe('Jane');
  });

  it('defaults fireworksEnabled to true when no profile is saved', () => {
    const profile = TestBed.inject(ProfileService);

    expect(profile.fireworksEnabled()).toBe(true);
  });

  it('reflects the saved profile value for fireworksEnabled', () => {
    const profile = TestBed.inject(ProfileService);

    profile.save({ displayName: 'Jane', favoriteGame: 'none', fireworksEnabled: false });

    expect(profile.fireworksEnabled()).toBe(false);
  });

  it('fills in missing fields for a profile saved under an older shape', () => {
    localStorage.setItem(
      'kestrel.profile',
      JSON.stringify({ displayName: 'Jane', favoriteGame: 'minesweeper', notifyOnHighScores: false }),
    );

    const profile = TestBed.inject(ProfileService);

    expect(profile.profile()).toMatchObject({
      displayName: 'Jane',
      favoriteGame: 'minesweeper',
      fireworksEnabled: true,
    });
  });
});
