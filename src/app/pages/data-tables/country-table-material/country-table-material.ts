import { AfterViewInit, Component, effect, input, viewChild } from '@angular/core';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Country } from '../../../services/country.service';

@Component({
  selector: 'app-country-table-material',
  imports: [MatTableModule, MatSortModule, MatPaginatorModule],
  templateUrl: './country-table-material.html',
  styleUrl: './country-table-material.scss',
})
export class CountryTableMaterial implements AfterViewInit {
  readonly countries = input.required<Country[]>();

  protected readonly displayedColumns = [
    'flagEmoji',
    'commonName',
    'region',
    'subregion',
    'population',
    'areaKm2',
    'capital',
    'languages',
    'currencies',
    'unMember',
  ];

  protected readonly dataSource = new MatTableDataSource<Country>([]);

  private readonly sort = viewChild.required(MatSort);
  private readonly paginator = viewChild.required(MatPaginator);

  constructor() {
    effect(() => {
      this.dataSource.data = this.countries();
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort();
    this.dataSource.paginator = this.paginator();
  }
}
