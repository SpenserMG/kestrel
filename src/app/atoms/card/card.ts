import { NgTemplateOutlet, NgClass } from '@angular/common';
import { Component, input } from '@angular/core';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatRipple } from '@angular/material/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-card',
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatRipple,
    NgTemplateOutlet,
    RouterLink,
    NgClass
],
  templateUrl: './card.html',
  styleUrl: './card.scss',
})
export class Card {
  readonly title = input.required<string>();
  readonly link = input<string>();
}
