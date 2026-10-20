import { Component, computed, input } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { AllCommunityModule, ColDef, ModuleRegistry } from 'ag-grid-community';
import { agGridTheme } from '../../../../styles/ag-grid-theme';
import { Country } from '../../../services/country.service';

ModuleRegistry.registerModules([AllCommunityModule]);

const COLUMN_DEFS: ColDef<Country>[] = [
  { field: 'flagEmoji', headerName: 'Flag', sortable: false, filter: false, width: 90 },
  { field: 'commonName', headerName: 'Name' },
  { field: 'region' },
  { field: 'subregion' },
  { field: 'population', valueFormatter: ({ value }) => value.toLocaleString() },
  { field: 'areaKm2', headerName: 'Area (km²)', valueFormatter: ({ value }) => value.toLocaleString() },
  { field: 'capital' },
  { field: 'languages' },
  { field: 'currencies' },
  { field: 'unMember', headerName: 'UN Member', valueFormatter: ({ value }) => (value ? 'Yes' : 'No') },
];

@Component({
  selector: 'app-country-table-ag-grid',
  imports: [AgGridAngular],
  templateUrl: './country-table-ag-grid.html',
  styleUrl: './country-table-ag-grid.scss',
})
export class CountryTableAgGrid {
  readonly countries = input.required<Country[]>();

  protected readonly theme = agGridTheme;
  protected readonly columnDefs = COLUMN_DEFS;
  protected readonly defaultColDef: ColDef = { sortable: true, filter: true, resizable: true };
  protected readonly rowData = computed(() => this.countries());
  protected readonly pageSizeOptions = [10, 25, 50];
}
