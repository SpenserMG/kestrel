import { Component, computed, inject, signal } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { form, FormField, maxLength, required } from '@angular/forms/signals';
import { Dialog } from '../../atoms/dialog/dialog';
import { TextField } from '../../atoms/text-field/text-field';
import { Toggle } from '../../atoms/toggle/toggle';
import { Select, SelectOption } from '../../atoms/select/select';
import { Button } from '../../atoms/button/button';
import { ThemeSwitcher } from '../theme-switcher/theme-switcher';
import { EMPTY_PROFILE, ProfileData, ProfileService } from '../../services/profile.service';
import { GAMES_CATALOG } from '../../data/games-catalog';

const FAVORITE_GAME_OPTIONS: SelectOption[] = [
  { value: 'none', label: 'No preference' },
  ...GAMES_CATALOG.map((game) => ({ value: game.id, label: game.title, icon: game.icon })),
];

@Component({
  selector: 'app-profile-form',
  imports: [Dialog, TextField, Toggle, Select, Button, ThemeSwitcher, FormField],
  templateUrl: './profile-form.html',
  styleUrl: './profile-form.scss',
})
export class ProfileForm {
  private readonly profileService = inject(ProfileService);
  private readonly dialogRef = inject(MatDialogRef<ProfileForm>);

  protected readonly favoriteGameOptions = FAVORITE_GAME_OPTIONS;

  private readonly hasExistingProfile = this.profileService.profile() !== null;
  private readonly initialProfile: ProfileData = this.profileService.profile() ?? EMPTY_PROFILE;

  private readonly data = signal<ProfileData>(this.initialProfile);

  protected readonly profileForm = form(this.data, (path) => {
    required(path.displayName, { message: 'Display name is required' });
    maxLength(path.displayName, 40, { message: 'Keep it under 40 characters' });
  });

  protected readonly displayNameError = computed(() => this.fieldError(this.profileForm.displayName()));

  private readonly hasChanges = computed(() => {
    const value = this.profileForm().value();
    return (
      value.displayName !== this.initialProfile.displayName ||
      value.favoriteGame !== this.initialProfile.favoriteGame ||
      value.fireworksEnabled !== this.initialProfile.fireworksEnabled
    );
  });

  protected readonly canSave = computed(
    () => this.profileForm().valid() && (!this.hasExistingProfile || this.hasChanges()),
  );

  protected save(): void {
    if (!this.canSave()) {
      return;
    }
    this.profileService.save(this.profileForm().value());
    this.dialogRef.close();
  }

  protected cancel(): void {
    this.dialogRef.close();
  }

  private fieldError(field: { touched(): boolean; errors(): readonly { message?: string }[] }): string | null {
    return field.touched() ? field.errors()[0]?.message ?? null : null;
  }
}
