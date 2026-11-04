import { computed, effect, Service, signal } from '@angular/core';

export interface ProfileData {
  displayName: string;
  favoriteGame: string;
  fireworksEnabled: boolean;
}

export const EMPTY_PROFILE: ProfileData = {
  displayName: '',
  favoriteGame: 'none',
  fireworksEnabled: true,
};

const PROFILE_STORAGE_KEY = 'kestrel.profile';

@Service()
export class ProfileService {
  readonly profile = signal<ProfileData | null>(this.load());

  readonly fireworksEnabled = computed(() => this.profile()?.fireworksEnabled ?? true);

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
      // Spread over EMPTY_PROFILE so a profile saved under an older shape (a
      // field renamed or added since) still fills in every key Signal Forms
      // expects, instead of leaving some fields undefined at runtime.
      return raw ? { ...EMPTY_PROFILE, ...(JSON.parse(raw) as Partial<ProfileData>) } : null;
    } catch {
      return null;
    }
  }
}
