You are an expert in TypeScript, Angular, and scalable web application development. You write functional, maintainable, performant, and accessible code following Angular and TypeScript best practices.

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

## Angular Best Practices

- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default in Angular v20+.
- Do NOT set `changeDetection: ChangeDetectionStrategy.OnPush` explicitly. `OnPush` is the default in Angular v22+.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images.
  - `NgOptimizedImage` does not work for inline base64 images.

## Components

- Keep components small and focused on a single responsibility.
- Think in terms of atomic design — atoms → molecules → organisms → pages — as a mental model and naming vocabulary. This is not a mandated folder structure; file/folder organization is intentionally left to develop organically rather than being fixed upfront.
- Every component gets 4 separate files: `name.ts`, `name.html`, `name.scss`, `name.spec.ts`. No inline templates or styles, even for trivial components.
- Use Angular Material for all applicable UI primitives, styled through the M3 theme tokens defined in `src/styles.scss`.
- Wrap every Material primitive used directly in the app in our own atom component (selector prefix `app-`), e.g. `app-button` wraps `MatButton`. This keeps one seam for app-wide restyling/behavior changes instead of touching every usage site.
  - Wrapper components stay narrow: expose our own contract, forward to Material, no business logic.
  - Wrapper contracts are narrow and opinionated by default — expose a curated subset of variants/inputs rather than mirroring Material's full API surface. Expand only when a real use case needs it.
- Use `input()` and `output()` functions instead of decorators.
- Use `input.required<T>()` for required inputs — it gives a compile-time error when the input isn't bound, so no separate manual-validation convention is needed.
- Use `model()` for two-way bound properties with `[(prop)]` syntax instead of pairing `input()` with `output()`.
- Use `computed()` for derived state.
- Use `linkedSignal()` for state derived from multiple reactive sources that must stay synchronized.
- Prefer signals for state; use RxJS only where signals don't cover the need (async streams, complex operators), bridging via `toSignal`/`toObservable`.
- Prefer Signal Forms (`@angular/forms/signals`) for new forms. They are stable in Angular v22+ and provide signal-based state, type-safe field access, and schema-based validation.
- When not using Signal Forms, prefer Reactive forms instead of Template-driven ones.
- Do NOT use `ngClass`, use `class` bindings instead.
- Do NOT use `ngStyle`, use `style` bindings instead.
- When using external templates/styles, use paths relative to the component TS file.

### Example atom

```ts
// button.ts
import { Component, input } from '@angular/core';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-button',
  imports: [MatButton],
  templateUrl: './button.html',
  styleUrl: './button.scss',
})
export class Button {
  readonly variant = input<'filled' | 'outlined' | 'text'>('filled');
  readonly disabled = input(false);
  readonly label = input.required<string>();
}
```

```html
<!-- button.html -->
@switch (variant()) { @case ('outlined') {
<button matButton="outlined" [disabled]="disabled()">{{ label() }}</button>
} @case ('text') {
<button matButton [disabled]="disabled()">{{ label() }}</button>
} @default {
<button matButton="filled" [disabled]="disabled()">{{ label() }}</button>
} }
```

## Pages

- A page = a route. Navigating to a new route means creating a new page component.
- Pages are thin orchestrators: they compose smaller components (organisms/molecules/atoms) and pass data down. They do not implement business logic themselves.
- There is no separate "template" layer between organisms and pages — a page is both the layout and the data orchestrator.
- Each page is wired up via `loadComponent` in the route config for lazy loading, not eagerly bundled.
- Route params, query params, and route data flow into the page via `input()`, using the router's `withComponentInputBinding()`. Do not manually subscribe to `ActivatedRoute` in pages.
- Service data (API calls, records, etc.) is fetched by injecting a service directly (`inject()`), where the service exposes state as a signal or Angular's `resource()` API. The page reads that directly — loading/error state stays colocated with the page that needs it.
- Naming: suffix `Page` — class `HomePage`, file `home-page.ts`, selector `app-home-page`.
- Same 4-file convention as components: `home-page.ts`, `home-page.html`, `home-page.scss`, `home-page.spec.ts`.

## Accessibility Requirements

- It MUST pass all AXE checks.
- It MUST follow all WCAG 2.2 AA minimums, including focus management, color contrast, and ARIA attributes.

## State Management

- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

## Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables
- Do not assume globals like (`new Date()`) are available.

## Services

- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Prefer the `@Service` decorator over `@Injectable({providedIn: 'root'})` for new singleton services (Angular v22+)
- Use the `inject()` function instead of constructor injection

## Testing

- Test behavior, not implementation. Confidence should come from "does this work for the user," not line coverage. Target roughly 80-85% coverage, not 95-100% — chasing the last mile yields diminishing returns and encourages brittle implementation-detail tests.
- Query priority when finding elements: text first, then role, then `data-testid` as a last resort when neither is viable.
- Use `@testing-library/user-event` for interactions (click/hover/type), not raw `fireEvent()` — it simulates the realistic event sequence a browser produces rather than a single synthetic event.
- Do not test styling in unit specs — that's for manual QA or a future visual-regression tool.
- Every spec includes an automated accessibility check (axe, no violations) alongside behavior tests, enforcing the WCAG 2.2 AA requirement automatically.
- Test from the ground up and trust the boundary: if a component is fully tested, a page that uses it doesn't re-test the component's internals — only that it's wired up correctly (rendered with the right inputs, responds to its outputs).
- Keep unit tests small and targeted; add integration tests only where the interaction between pieces is the actual thing being verified.

### Test harness pattern

Each spec file defines a reusable per-component harness class (naming: `<Component>Harness`, e.g. `ButtonHarness`) that:

- Wraps `@testing-library/angular`'s `render()` (not raw `TestBed`) — reuses its existing `TestBed` setup and returns queries already bound to the rendered DOM.
- Exposes a `renderComponent(overrides)` method taking the props/inputs, providers, and imports that vary per test.
- Is instantiated once in a top-level `beforeEach`, then each `it()` calls `harness.renderComponent(...)` with only the overrides that test cares about — keeps individual tests slim.
- Houses commonly-reused methods across the file's tests (e.g. a `stable()` helper wrapping `fixture.whenStable()`).

```ts
// button.spec.ts
import { render, screen } from '@testing-library/angular';
import { userEvent } from '@testing-library/user-event';
import { Button } from './button';

class ButtonHarness {
  async renderComponent(
    overrides: Partial<{
      label: string;
      variant: 'filled' | 'outlined' | 'text';
      disabled: boolean;
    }> = {},
  ) {
    return render(Button, {
      inputs: {
        label: overrides.label ?? 'Click me',
        variant: overrides.variant,
        disabled: overrides.disabled,
      },
    });
  }
}

describe('Button', () => {
  let harness: ButtonHarness;

  beforeEach(() => {
    harness = new ButtonHarness();
  });

  it('renders the provided label', async () => {
    await harness.renderComponent({ label: 'Save' });
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('is disabled when disabled input is true', async () => {
    await harness.renderComponent({ disabled: true });
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

- Shared cross-file utilities (helpers reused across multiple spec files, not scoped to one component) go in a generic `test-utils` location.

## Styling & Theming

- Global-first: styling should be handled at the global level (`src/styles.scss` plus reusable utility classes) by default. Only move styling down a level — to the page, then the component, then the smallest atom/molecule — when it truly can't be expressed globally or via a utility class.
  - Net effect: pages should have close to zero custom styling; most styling lives globally or in the smallest, most reusable components.
- Color/theming is entirely token-driven, via a single defined list of color tokens set per theme. This is defined in `src/styles.scss` via `mat.theme-overrides` under `:root, :host` (light) and `.dark` (dark) — add more themes later as additional selector blocks.
- Typography stays constant across all themes.
- Layout, breakpoints, and spacing are handled by Tailwind CSS, using Tailwind's default breakpoints.
  - Tailwind's Preflight base reset must be disabled — it conflicts with Angular Material's own base styles. Tailwind supplies utility classes only.
  - Never use Tailwind's color utilities (e.g. `bg-red-500`, `text-slate-800`) — color always comes from the Material theme tokens, keeping a single source of truth for color.
  - Build pages with each Tailwind breakpoint in mind — responsive by default, not an afterthought.
