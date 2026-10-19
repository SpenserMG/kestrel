---
name: new-page
description: Scaffold a new routed page in Kestrel — the 4-file `*-page` component, its lazy `loadComponent` route, a harness-based spec with an axe check, and any entry point linking to it. Use whenever the user asks to add a new page, screen, route, or view (e.g. "add an About page", "create a new game page").
---

# New page

A page = a route. Follow these steps in order. CLAUDE.md is the source of truth for conventions; this skill is the procedure.

## 1. Pin down the inputs

Before writing files, settle (ask only if it can't be inferred from the request):

- **Name** → class `<Name>Page`, file/folder `<kebab-name>-page`, selector `app-<kebab-name>-page`.
- **URL path** → e.g. `about`, or nested like `games/connect-four`.
- **Location** → `src/app/pages/<area>/...`. Nest the folder to mirror the URL: a page under `games/` lives in `src/app/pages/games/<kebab-name>/`. A top-level page gets its own folder: `src/app/pages/<kebab-name>/`.
- **Route params / query params / route data** it needs, if any.
- **Entry point** → which existing page or component should link to it (e.g. a new game needs a card on `GamesPage`).

## 2. Create the 4 files

### `<kebab-name>-page.ts`

```ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-<kebab-name>-page',
  imports: [],
  templateUrl: './<kebab-name>-page.html',
  styleUrl: './<kebab-name>-page.scss',
})
export class <Name>Page {}
```

- No `standalone: true`, no explicit `changeDetection` (both are defaults).
- Route params/query/data arrive via `input()` / `input.required()` — `withComponentInputBinding()` is already enabled in `src/app/app.config.ts`. Never inject `ActivatedRoute`.
- Service data: `inject()` a service that exposes signals or `resource()` and read it directly (see `TicTacToePage` + `GameStatsService`). New singleton services use `@Service`, and their class/file name must include `Service` (see Services rule in CLAUDE.md).
- Keep the page a thin orchestrator. Pages compose atoms (`src/app/atoms/`) and components (`src/app/components/`); if UI is reusable or getting large, extract it into a component instead of growing the page. Local interactive state with `signal`/`computed` is fine (the game pages do this).
- Never use a Material primitive directly if an `app-` atom wraps it. If a needed Material primitive has no atom yet, create the atom first (narrow contract, scoped `*-overrides` theming class on first use).

### `<kebab-name>-page.html`

Start from the established page shell — centered, padded, responsive column with an `h1`:

```html
<div class="mx-auto flex max-w-3xl flex-col gap-4 p-4">
  <h1><Page Title></h1>
</div>
```

- Exactly one `h1` per page (axe/WCAG).
- Tailwind for layout/spacing/breakpoints, mobile-first (`sm:`, `md:` …). Never Tailwind color utilities — color comes from `--mat-sys-*` tokens.
- Native control flow (`@if`, `@for`, `@switch`); `class`/`style` bindings, not `ngClass`/`ngStyle`.
- Dynamic status text that changes in response to the user gets `aria-live="polite"`.
- Static images use `NgOptimizedImage`, referenced with the `assets/` prefix.

### `<kebab-name>-page.scss`

Create it empty. Pages should have near-zero custom styling; reach for global styles / `src/styles/utility-classes.scss` first. Only add page-scoped styles for genuinely page-specific visuals (e.g. a game board), and use `--mat-sys-*` tokens for any color.

### `<kebab-name>-page.spec.ts`

```ts
import { render, screen } from '@testing-library/angular';
import { expectNoA11yViolations } from '<relative>/test-utils/axe';
import { <Name>Page } from './<kebab-name>-page';

class <Name>PageHarness {
  async renderComponent() {
    return render(<Name>Page);
  }
}

describe('<Name>Page', () => {
  let harness: <Name>PageHarness;

  beforeEach(() => {
    harness = new <Name>PageHarness();
  });

  it('renders the page heading', async () => {
    await harness.renderComponent();
    expect(screen.getByRole('heading', { level: 1, name: '<Page Title>' })).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = await harness.renderComponent();
    await expectNoA11yViolations(container);
  });
});
```

- `renderComponent(overrides)` takes only what varies per test (route inputs via `inputs`, `providers`, `imports`). If the page renders `routerLink`s, add `providers: [provideRouter([])]`.
- Route-param inputs: pass them through `inputs` in the harness, the same way the router would bind them.
- Interactions use `userEvent.setup()` from `@testing-library/user-event`. Pages that persist to `localStorage` call `localStorage.clear()` in `beforeEach`.
- Query priority: text → role → `data-testid` last.
- Trust the boundary: don't re-test child components' internals — assert they're rendered with the right inputs and that the page reacts to their outputs.
- Put helpers reused across this file's tests (e.g. a `cell(index)` locator) on the harness.

## 3. Register the route

Add to `src/app/app.routes.ts`, **above** the `''` redirect, using `loadComponent` (never eager imports):

```ts
{
  path: '<url-path>',
  loadComponent: () => import('./pages/<path>/<kebab-name>-page').then((m) => m.<Name>Page),
},
```

Keep sibling routes grouped (e.g. all `games/*` entries together).

## 4. Link to it

A page nobody can reach isn't done. Add the entry point identified in step 1 — e.g. a new game gets an `app-card` on `src/app/pages/games/games-page.html` with `title`, `link`, `primaryButtonText="Go"` and a one-line description, plus a matching test in `games-page.spec.ts` asserting the card text and link `href`.

## 5. Verify

Run and fix until clean:

```
npx ng test --watch=false
npx ng lint
npx ng build
```

Then report what was created: the files, the route path, and where the page is linked from.
