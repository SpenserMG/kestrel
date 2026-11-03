import { effect, Service, signal } from '@angular/core';

export interface ProfileData {
  displayName: string;
  favoriteGame: string;
  notifyOnHighScores: boolean;
}

export const EMPTY_PROFILE: ProfileData = {
  displayName: '',
  favoriteGame: 'none',
  notifyOnHighScores: false,
};

const PROFILE_STORAGE_KEY = 'kestrel.profile';

@Service()
export class ProfileService {
  readonly profile = signal<ProfileData | null>(this.load());

  constructor() {
    effect(() => {
      const current = this.profile();
      if (current) {
        localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(current));
      }
    });
  }

  save(data: ProfileData): void {
    this.profile.set(data);
  }

  private load(): ProfileData | null {
    try {
      const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
      return raw ? (JSON.parse(raw) as ProfileData) : null;
    } catch {
      return null;
    }
  }
}
