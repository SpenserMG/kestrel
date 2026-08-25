import { NgTemplateOutlet } from '@angular/common';
import { Component, input } from '@angular/core';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle, MatCardActions } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { MatAnchor } from "@angular/material/button";

@Component({
  selector: 'app-card',
  imports: [
    MatCard,
    MatCardActions,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    NgTemplateOutlet,
    RouterLink,
    MatAnchor
],
  templateUrl: './card.html',
  styleUrl: './card.scss',
})
export class Card {
  readonly title = input.required<string>();
  readonly link = input<string>();
  readonly primaryButtonText = input<string>();
}
