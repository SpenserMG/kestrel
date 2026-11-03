export interface GameCatalogEntry {
  id: string;
  title: string;
  link: string;
  description: string;
  icon: string;
}

export const GAMES_CATALOG: readonly GameCatalogEntry[] = [
  {
    id: 'tic-tac-toe',
    title: 'Tic-Tac-Toe',
    link: '/games/tic-tac-toe',
    description: 'Simple 2-player tic-tac-toe',
    icon: 'gamepad-2',
  },
  {
    id: 'memory-match',
    title: 'Memory Match',
    link: '/games/memory-match',
    description: 'Flip cards to find matching pairs',
    icon: 'gamepad-2',
  },
  {
    id: 'connect-four',
    title: 'Connect Four',
    link: '/games/connect-four',
    description: 'Drop pieces, get four in a row',
    icon: 'gamepad-2',
  },
  {
    id: 'minesweeper',
    title: 'Minesweeper',
    link: '/games/minesweeper',
    description: 'Clear the board without hitting a mine',
    icon: 'bomb',
  },
];
