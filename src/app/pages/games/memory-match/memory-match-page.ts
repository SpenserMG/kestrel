import { Component, computed, inject, signal } from '@angular/core';
import { MatRipple } from '@angular/material/core';
import { Button } from '../../../atoms/button/button';
import { Icon } from '../../../atoms/icon/icon';
import { Select, SelectOption } from '../../../atoms/select/select';
import { GameStats, MemoryMatchDifficulty } from '../../../services/game-stats';

interface MemoryCard {
  id: number;
  symbol: string;
}

interface DifficultyConfig {
  label: string;
  pairs: number;
}

const DIFFICULTIES: Record<MemoryMatchDifficulty, DifficultyConfig> = {
  easy: { label: 'Easy (3x4)', pairs: 6 },
  medium: { label: 'Medium (4x4)', pairs: 8 },
  hard: { label: 'Hard (5x4)', pairs: 10 },
};

const DIFFICULTY_OPTIONS: SelectOption[] = (
  Object.entries(DIFFICULTIES) as [MemoryMatchDifficulty, DifficultyConfig][]
).map(([value, config]) => ({ value, label: config.label }));

const SYMBOL_POOL = [
  'favorite',
  'star',
  'pets',
  'cake',
  'bolt',
  'anchor',
  'diamond',
  'spa',
  'umbrella',
  'rocket_launch',
];

const MISMATCH_DELAY_MS = 800;

function buildDeck(pairs: number): MemoryCard[] {
  const symbols = SYMBOL_POOL.slice(0, pairs);
  const deck = [...symbols, ...symbols].map((symbol, index) => ({ id: index, symbol }));

  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  return deck;
}

@Component({
  selector: 'app-memory-match-page',
  imports: [Button, Icon, MatRipple, Select],
  templateUrl: './memory-match-page.html',
  styleUrl: './memory-match-page.scss',
})
export class MemoryMatchPage {
  private readonly gameStats = inject(GameStats);

  readonly difficultyOptions = DIFFICULTY_OPTIONS;
  readonly difficulty = signal<MemoryMatchDifficulty>('easy');
  readonly cards = signal<MemoryCard[]>(buildDeck(DIFFICULTIES.easy.pairs));
  readonly matchedIds = signal<Set<number>>(new Set());
  readonly flippedIndices = signal<number[]>([]);
  readonly isResolving = signal(false);
  readonly moves = signal(0);
  readonly stats = this.gameStats.memoryMatch;

  readonly pairsTotal = computed(() => this.cards().length / 2);
  readonly pairsMatched = computed(() => this.matchedIds().size / 2);
  readonly isWon = computed(() => this.pairsMatched() === this.pairsTotal());

  selectDifficulty(value: string): void {
    this.difficulty.set(value as MemoryMatchDifficulty);
    this.newGame();
  }

  newGame(): void {
    this.cards.set(buildDeck(DIFFICULTIES[this.difficulty()].pairs));
    this.matchedIds.set(new Set());
    this.flippedIndices.set([]);
    this.isResolving.set(false);
    this.moves.set(0);
  }

  isFaceUp(index: number): boolean {
    const card = this.cards()[index];
    return this.matchedIds().has(card.id) || this.flippedIndices().includes(index);
  }

  flipCard(index: number): void {
    if (this.isResolving() || this.isFaceUp(index) || this.flippedIndices().length >= 2) {
      return;
    }

    const flipped = [...this.flippedIndices(), index];
    this.flippedIndices.set(flipped);

    if (flipped.length < 2) {
      return;
    }

    this.moves.update((count) => count + 1);

    const cards = this.cards();
    const [firstIndex, secondIndex] = flipped;
    const first = cards[firstIndex];
    const second = cards[secondIndex];

    if (first.symbol === second.symbol) {
      this.matchedIds.update((ids) => new Set(ids).add(first.id).add(second.id));
      this.flippedIndices.set([]);

      if (this.pairsMatched() === this.pairsTotal()) {
        this.gameStats.recordMemoryMatchWin(this.difficulty(), this.moves());
      }
      return;
    }

    this.isResolving.set(true);
    setTimeout(() => {
      this.flippedIndices.set([]);
      this.isResolving.set(false);
    }, MISMATCH_DELAY_MS);
  }
}
