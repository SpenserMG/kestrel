---
name: new-game
description: Scaffold a new game in Kestrel under src/app/pages/games — the 4-file `*-page` component with board state and a win/draw/game-over model, GameStatsService wiring for persisted stats, the confirmExitGuard for mid-game navigation, its lazy route, and a games-page entry point. Use whenever the user asks to add a new game (e.g. "add a Battleship game", "create a new game page").
---

# New game

A game is a page (see the `new-page` skill for the base pattern) plus three things every game in this app has: persisted stats via `GameStatsService`, a `CanDeactivate` guard so leaving mid-game prompts the user, and a board/state model with a clear "is it over" signal. Follow these steps in order. CLAUDE.md is the source of truth for conventions; this skill is the procedure.

## 1. Pin down the inputs

Before writing files, settle (ask only if it can't be inferred from the request):

- **Name** → class `<Name>Page`, file/folder `<kebab-name>-page`, selector `app-<kebab-name>-page`, route `games/<kebab-name>`.
- **Board shape** → a flat array (tic-tac-toe), a grid (connect four), a deck of cards (memory match), or something else. This drives the signal type.
- **End conditions** → what counts as a win, a draw, and is there more than one "player" (two-player turn-based vs. single-player-against-a-clock/board)?
- **Stats worth tracking** → win/loss/draw counts per player, or a best-score-per-mode like memory match's best-moves-per-difficulty. This becomes a new slice of `GameStatsService`.
- **Variants** (optional) → e.g. difficulty levels (see memory match's `app-select` + `MemoryMatchDifficulty`). Skip if the game has none.
- **Entry point** → always `GamesPage` for a new game.

## 2. Add a stats slice to `GameStatsService`

Every game gets its own signal, storage key, and record method in `src/app/services/game-stats.service.ts` — don't create a separate service. Follow the existing shape exactly:

```ts
export type <Name>Result = 'player-a' | 'player-b' | 'draw'; // or whatever the real outcomes are

export interface <Name>Stats {
  // win/loss/draw counts, or a best-score record — match the game's own shape
}

const <NAME>_STORAGE_KEY = 'kestrel.<kebab-name>-stats';
const EMPTY_<NAME>_STATS: <Name>Stats = { /* zeroed */ };
```

Inside the `GameStatsService` class:
- `readonly <name> = signal<<Name>Stats>(this.load<Name>());`
- An `effect()` in the constructor that writes it to `localStorage` on every change (same pattern as the other three).
- A `record<Name>Result(...)` method that `update()`s the signal.
- A private `load<Name>()` that reads from `localStorage`, parses, and falls back to the empty stats in a `try/catch`.

Add a matching `describe` block to `game-stats.service.spec.ts` covering: increments persist across a fresh `TestBed.inject` (simulates reload), and the result-recording logic itself (e.g. a best-score method shouldn't overwrite with a worse score).

## 3. Create the 4 page files, at `src/app/pages/games/<kebab-name>/<kebab-name>-page.*`

### `<kebab-name>-page.ts`

```ts
import { Component, computed, inject, signal } from '@angular/core';
import { MatRipple } from '@angular/material/core';
import { Button } from '../../../atoms/button/button';
import { CanComponentDeactivate } from '../../../guards/confirm-exit.guard';
import { GameStatsService } from '../../../services/game-stats.service';

@Component({
  selector: 'app-<kebab-name>-page',
  imports: [Button, MatRipple],
  templateUrl: './<kebab-name>-page.html',
  styleUrl: './<kebab-name>-page.scss',
})
export class <Name>Page implements CanComponentDeactivate {
  private readonly gameStats = inject(GameStatsService);

  readonly board = signal(/* initial empty board */);
  readonly stats = this.gameStats.<name>;

  readonly winner = computed(() => /* derive from board() */);
  readonly isDraw = computed(() => !this.winner() && /* board full */);
  readonly isGameOver = computed(() => this.winner() !== null || this.isDraw());

  /* the move-making method: mutate board() via .update(), then check
     winner()/isDraw() and call gameStats.record<Name>Result(...) exactly
     once per concluded game — see TicTacToePage.selectCell for the shape */

  reset(): void {
    this.board.set(/* fresh empty board */);
  }

  hasUnsavedProgress(): boolean {
    return !this.isGameOver() && /* at least one move has been made */;
  }
}
```

- No `standalone: true`, no explicit `changeDetection` (both are defaults).
- `hasUnsavedProgress()` is what makes the exit guard (step 4) actually prompt — get this right or the guard is a no-op. Base it on the same state the template already derives from (see the three existing games for the exact pattern: moves made AND not yet game-over).
- If the game has a difficulty/variant selector, follow memory match: a `SelectOption[]` constant, `app-select`, and a `select<Thing>(value: string)` method that resets the board for the new variant.
- Never use a Material primitive directly if an `app-` atom wraps it (`app-button`, `app-icon`, `app-select`). Board cells are plain `<button>`s styled in the page's own `.scss` with `matRipple` — the board itself isn't a Material-wrapped concept, so it's fine to use `MatRipple` directly here (see the three existing games).

### `<kebab-name>-page.html`

```html
<div class="mx-auto flex max-w-<size> flex-col items-center gap-4 p-4">
  <h1><Game Title></h1>

  <p aria-live="polite">
    @if (winner(); as activeWinner) {
      {{ activeWinner }} wins!
    } @else if (isDraw()) {
      It's a draw!
    } @else {
      <!-- whose turn / current state -->
    }
  </p>

  <div class="<kebab-name>-board">
    <!-- board cells: matRipple, [matRippleDisabled] and [disabled] both tied
         to isGameOver() (plus any cell-specific "already filled" check),
         an aria-label describing the cell's position and contents -->
  </div>

  <app-button label="New game" (pressed)="reset()" />

  <p><!-- stats() summary, e.g. "X wins: {{ stats().xWins }} · O wins: ..." --></p>
</div>
```

- Exactly one `h1`. The status `<p>` needs `aria-live="polite"` since it changes in response to play.
- Tailwind for layout only; color always from `--mat-sys-*` tokens, never Tailwind color utilities.
- Every interactive cell needs an `aria-label` precise enough to announce position + current contents/state — screen reader users can't see the grid.

### `<kebab-name>-page.scss`

Board/cell visuals are genuinely page-specific, so unlike most pages this file won't stay empty. Follow the existing games' conventions:
- Cells: `aspect-ratio: 1`, `border: 1px solid var(--mat-sys-outline-variant)`, background `var(--mat-sys-surface-container-low)`, a `:hover:not(:disabled)` and `:active:not(:disabled)` micro-interaction, `:disabled { cursor: default; }`.
- Any game-specific accent color (e.g. connect four's red/yellow discs) can use a literal color if it's inherent to the game's identity rather than the app's theme — but prefer a `--mat-sys-*` token wherever the color is decorative/structural rather than semantic to the game.

### `<kebab-name>-page.spec.ts`

Same harness pattern as `new-page`, plus game-specific coverage. At minimum:

```ts
it('declares a winner and disables the board once the game concludes', async () => { ... });
it('resets the board when New game is pressed', async () => { ... });
it('reports unsaved progress once a move is made, and none once the game ends', async () => {
  const { fixture } = await harness.renderComponent();
  const page = fixture.componentInstance;

  expect(page.hasUnsavedProgress()).toBe(false);
  // ...make a move...
  expect(page.hasUnsavedProgress()).toBe(true);
  // ...play to a conclusion...
  expect(page.hasUnsavedProgress()).toBe(false);
});
it('has no accessibility violations', async () => { ... });
```

`localStorage.clear()` in `beforeEach` — this page persists stats through `GameStatsService`.

## 4. Register the route with the exit guard

In `src/app/app.routes.ts`, inside the grouped `games/*` entries, above the `''` redirect:

```ts
{
  path: 'games/<kebab-name>',
  loadComponent: () =>
    import('./pages/games/<kebab-name>/<kebab-name>-page').then((m) => m.<Name>Page),
  canDeactivate: [confirmExitGuard],
},
```

Every game route gets `canDeactivate: [confirmExitGuard]` — this is what turns `hasUnsavedProgress()` into an actual "leave this game?" prompt. Don't add it to non-game pages.

## 5. Link to it from `GamesPage`

Add a tile to `src/app/pages/games/games-page.html`:

```html
<app-card title="<Game Title>" link="/games/<kebab-name>" primaryButtonText="Go">
  <!-- one-line description -->
</app-card>
```

Add a matching test to `games-page.spec.ts` asserting the tile's text, description, and link `href`.

## 6. Verify

Run and fix until clean:

```
npx ng test --watch=false
npx ng lint
npx ng build
```

Then report what was created: the files, the new `GameStatsService` slice, the route path (with the guard), and the `GamesPage` entry.
