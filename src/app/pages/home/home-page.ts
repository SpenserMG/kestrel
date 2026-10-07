import { Component } from '@angular/core';
import { CoffeeTicker } from '../../components/coffee-ticker/coffee-ticker';

@Component({
  selector: 'app-home-page',
  imports: [CoffeeTicker],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage {}
