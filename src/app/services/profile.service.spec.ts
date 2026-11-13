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
      showEffects: true,
    });

    expect(profile.profile()).toEqual({
      displayName: 'Jane',
      favoriteGame: 'minesweeper',
      showEffects: true,
    });
  });

  it('persists the saved profile to localStorage across instances', () => {
    const first = TestBed.inject(ProfileService);
    first.save({
      displayName: 'Jane',
      favoriteGame: 'none',
      showEffects: false,
    });
    TestBed.tick();

    TestBed.resetTestingModule();
    const second = TestBed.inject(ProfileService);

    expect(second.profile()?.displayName).toBe('Jane');
  });

  it('defaults showEffects to false when no profile is saved', () => {
    const profile = TestBed.inject(ProfileService);

    expect(profile.showEffects()).toBe(false);
  });

  it('reflects the saved profile value for showEffects', () => {
    const profile = TestBed.inject(ProfileService);

    profile.save({ displayName: 'Jane', favoriteGame: 'none', showEffects: true });

    expect(profile.showEffects()).toBe(true);
  });

  it('falls back to defaults for fields missing from an older saved shape', () => {
    localStorage.setItem(
      'kestrel.profile',
      JSON.stringify({ displayName: 'Jane', favoriteGame: 'minesweeper', notifyOnHighScores: false }),
    );

    const profile = TestBed.inject(ProfileService);

    expect(profile.profile()).toMatchObject({
      displayName: 'Jane',
      favoriteGame: 'minesweeper',
      showEffects: false,
    });
  });

  it('falls back to defaults for fields with an unexpected type', () => {
    localStorage.setItem(
      'kestrel.profile',
      JSON.stringify({ displayName: 42, favoriteGame: null, showEffects: 'yes' }),
    );

    const profile = TestBed.inject(ProfileService);

    expect(profile.profile()).toEqual({
      displayName: '',
      favoriteGame: 'none',
      showEffects: false,
    });
  });

  it('falls back to defaults entirely when the saved value is not an object', () => {
    localStorage.setItem('kestrel.profile', JSON.stringify('not a profile'));

    const profile = TestBed.inject(ProfileService);

    expect(profile.profile()).toEqual({
      displayName: '',
      favoriteGame: 'none',
      showEffects: false,
    });
  });
});
