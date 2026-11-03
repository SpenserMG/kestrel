import { Component, computed, inject } from '@angular/core';
import { CoffeeTicker } from '../../components/coffee-ticker/coffee-ticker';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-home-page',
  imports: [CoffeeTicker],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage {
  private readonly profileService = inject(ProfileService);

  protected readonly greeting = computed(() => {
    const displayName = this.profileService.profile()?.displayName;
    return displayName ? `welcome, ${displayName}!` : 'welcome!';
  });
}
