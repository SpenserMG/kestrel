import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'home', loadComponent: () => import('./pages/home/home-page').then((m) => m.HomePage) },
  { path: 'games', loadComponent: () => import('./pages/games/games-page').then((m) => m.GamesPage) },
  {
    path: 'games/tic-tac-toe',
    loadComponent: () =>
      import('./pages/games/tic-tac-toe/tic-tac-toe-page').then((m) => m.TicTacToePage),
  },
  {
    path: 'games/memory-match',
    loadComponent: () =>
      import('./pages/games/memory-match/memory-match-page').then((m) => m.MemoryMatchPage),
  },
  {
    path: 'games/connect-four',
    loadComponent: () =>
      import('./pages/games/connect-four/connect-four-page').then((m) => m.ConnectFourPage),
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
];
