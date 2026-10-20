import { Component, input, signal } from '@angular/core';
import {
  ColumnDef,
  createPaginatedRowModel,
  createSortedRowModel,
  FlexRender,
  injectTable,
  PaginationState,
  rowPaginationFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_basic,
  SortingState,
  tableFeatures,
} from '@tanstack/angular-table';
import { Button } from '../../../atoms/button/button';
import { Country } from '../../../services/country.service';

const features = tableFeatures({
  rowSortingFeature,
  rowPaginationFeature,
  sortedRowModel: createSortedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortFns: { alphanumeric: sortFn_alphanumeric, basic: sortFn_basic },
});

const COLUMNS: ColumnDef<typeof features, Country>[] = [
  { accessorKey: 'flagEmoji', header: 'Flag', enableSorting: false },
  { accessorKey: 'commonName', header: 'Name' },
  { accessorKey: 'region', header: 'Region' },
  { accessorKey: 'subregion', header: 'Subregion' },
  {
    accessorKey: 'population',
    header: 'Population',
    sortFn: 'basic',
    cell: (ctx) => ctx.getValue<number>().toLocaleString(),
  },
  {
    accessorKey: 'areaKm2',
    header: 'Area (km²)',
    sortFn: 'basic',
    cell: (ctx) => ctx.getValue<number>().toLocaleString(),
  },
  { accessorKey: 'capital', header: 'Capital', enableSorting: false },
  { accessorKey: 'languages', header: 'Languages', enableSorting: false },
  { accessorKey: 'currencies', header: 'Currencies', enableSorting: false },
  {
    accessorKey: 'unMember',
    header: 'UN Member',
    cell: (ctx) => (ctx.getValue<boolean>() ? 'Yes' : 'No'),
  },
];

@Component({
  selector: 'app-country-table-tanstack',
  imports: [FlexRender, Button],
  templateUrl: './country-table-tanstack.html',
  styleUrl: './country-table-tanstack.scss',
})
export class CountryTableTanstack {
  readonly countries = input.required<Country[]>();

  private readonly sorting = signal<SortingState>([]);
  private readonly pagination = signal<PaginationState>({ pageIndex: 0, pageSize: 10 });

  protected readonly table = injectTable(() => ({
    features,
    columns: COLUMNS,
    data: this.countries(),
    state: { sorting: this.sorting(), pagination: this.pagination() },
    onSortingChange: (updater) =>
      this.sorting.update((old) => (typeof updater === 'function' ? updater(old) : updater)),
    onPaginationChange: (updater) =>
      this.pagination.update((old) => (typeof updater === 'function' ? updater(old) : updater)),
  }));
}
