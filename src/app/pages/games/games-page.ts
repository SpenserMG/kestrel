import { Component, computed, inject } from '@angular/core';
import { Card } from '../../atoms/card/card';
import { Divider } from '../../atoms/divider/divider';
import { GAMES_CATALOG } from '../../data/games-catalog';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-games-page',
  imports: [Card, Divider],
  templateUrl: './games-page.html',
  styleUrl: './games-page.scss',
})
export class GamesPage {
  private readonly profileService = inject(ProfileService);

  protected readonly games = GAMES_CATALOG;

  protected readonly favoriteGame = computed(() =>
    this.games.find((game) => game.id === this.profileService.profile()?.favoriteGame),
  );
}
