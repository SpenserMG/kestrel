import { computed, effect, Service, signal } from '@angular/core';

export interface ProfileData {
  displayName: string;
  favoriteGame: string;
  showEffects: boolean;
}

export const EMPTY_PROFILE: ProfileData = {
  displayName: '',
  favoriteGame: 'none',
  showEffects: false,
};

const PROFILE_STORAGE_KEY = 'kestrel.profile';

// Falls back to EMPTY_PROFILE's default per-field, not just when the whole
// record is missing, so a profile saved under an older shape (a field
// renamed, removed, or retyped since) can't leave a field with the wrong
// type and break the form.
function normalizeProfile(raw: unknown): ProfileData {
  const data = raw && typeof raw === 'object' ? (raw as Partial<ProfileData>) : {};
  return {
    displayName: typeof data.displayName === 'string' ? data.displayName : EMPTY_PROFILE.displayName,
    favoriteGame: typeof data.favoriteGame === 'string' ? data.favoriteGame : EMPTY_PROFILE.favoriteGame,
    showEffects: typeof data.showEffects === 'boolean' ? data.showEffects : EMPTY_PROFILE.showEffects,
  };
}

@Service()
export class ProfileService {
  readonly profile = signal<ProfileData | null>(this.load());

  readonly showEffects = computed(() => this.profile()?.showEffects ?? EMPTY_PROFILE.showEffects);

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
      return raw ? normalizeProfile(JSON.parse(raw)) : null;
    } catch {
      return null;
    }
  }
}
