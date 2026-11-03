import { Component, computed, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IconButton } from '../../atoms/icon-button/icon-button';
import { ProfileForm } from '../profile-form/profile-form';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-profile-button',
  imports: [IconButton],
  templateUrl: './profile-button.html',
  styleUrl: './profile-button.scss',
})
export class ProfileButton {
  private readonly dialog = inject(MatDialog);
  private readonly profileService = inject(ProfileService);

  protected readonly displayName = computed(() => this.profileService.profile()?.displayName ?? '');
  protected readonly label = computed(() =>
    this.displayName() ? `Edit profile for ${this.displayName()}` : 'Edit profile',
  );

  protected openProfile(): void {
    this.dialog.open(ProfileForm);
  }
}
