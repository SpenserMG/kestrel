import { Routes } from '@angular/router';
import { confirmExitGuard } from './guards/confirm-exit.guard';

export const routes: Routes = [
  { path: 'home', loadComponent: () => import('./pages/home/home-page').then((m) => m.HomePage) },
  {
    path: 'games',
    loadComponent: () => import('./pages/games/games-page').then((m) => m.GamesPage),
  },
  {
    path: 'games/tic-tac-toe',
    loadComponent: () =>
      import('./pages/games/tic-tac-toe/tic-tac-toe-page').then((m) => m.TicTacToePage),
    canDeactivate: [confirmExitGuard],
  },
  {
    path: 'games/memory-match',
    loadComponent: () =>
      import('./pages/games/memory-match/memory-match-page').then((m) => m.MemoryMatchPage),
    canDeactivate: [confirmExitGuard],
  },
  {
    path: 'games/connect-four',
    loadComponent: () =>
      import('./pages/games/connect-four/connect-four-page').then((m) => m.ConnectFourPage),
    canDeactivate: [confirmExitGuard],
  },
  {
    path: 'games/minesweeper',
    loadComponent: () =>
      import('./pages/games/minesweeper/minesweeper-page').then((m) => m.MinesweeperPage),
    canDeactivate: [confirmExitGuard],
  },
  {
    path: 'data-tables',
    loadComponent: () => import('./pages/data-tables/data-tables-page').then((m) => m.DataTablesPage),
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
];
