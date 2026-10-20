import { Component, inject, signal } from '@angular/core';
import { Select, SelectOption } from '../../atoms/select/select';
import { CountryService } from '../../services/country.service';
import { CountryTableAgGrid } from './country-table-ag-grid/country-table-ag-grid';
import { CountryTableMaterial } from './country-table-material/country-table-material';
import { CountryTableTanstack } from './country-table-tanstack/country-table-tanstack';

type TableImplementation = 'material' | 'ag-grid' | 'tanstack';

const IMPLEMENTATION_OPTIONS: SelectOption[] = [
  { value: 'material', label: 'Angular Material' },
  { value: 'ag-grid', label: 'AG Grid' },
  { value: 'tanstack', label: 'TanStack Table' },
];

@Component({
  selector: 'app-data-tables-page',
  imports: [Select, CountryTableMaterial, CountryTableAgGrid, CountryTableTanstack],
  templateUrl: './data-tables-page.html',
  styleUrl: './data-tables-page.scss',
})
export class DataTablesPage {
  private readonly countryService = inject(CountryService);

  readonly implementationOptions = IMPLEMENTATION_OPTIONS;
  readonly implementation = signal<TableImplementation>('material');

  readonly countries = this.countryService.countries.value;
  readonly isLoading = this.countryService.countries.isLoading;
  readonly error = this.countryService.countries.error;

  selectImplementation(value: string): void {
    this.implementation.set(value as TableImplementation);
  }
}
