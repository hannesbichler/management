import { DataSource } from '@angular/cdk/collections';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { inject, signal, ViewChild } from '@angular/core';
import { Prodprog, ProdprogDatabase } from './prodprog.database';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormControl } from '@angular/forms';

/**
 * Data source for the Table view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class ProdprogTableDataSource extends DataSource<Prodprog> {
  prodprogChanger: Observable<boolean> | undefined;

  textFilterPrognr: FormControl<string | null> | undefined;
  textFilterJahr: FormControl<string | null> | undefined;
  textFilterZellstoff: FormControl<string | null> | undefined;

  data: Prodprog[] = [];
  paginator: MatPaginator | undefined;
  sort: MatSort | undefined;
  database: ProdprogDatabase | undefined;
  resultsLength = signal(0);
  isLoadingResults = signal(true);
  isRateLimitReached = signal(false);

  constructor() {
    super();
    this.database = new ProdprogDatabase(inject(HttpClient));
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<Prodprog[]> {
    if (this.database && this.paginator && this.sort && this.prodprogChanger && this.textFilterPrognr && this.textFilterJahr && this.textFilterZellstoff) {
      // Combine everything that affects the rendered data into one update
      // stream for the data-table to consume.
      return merge(this.prodprogChanger, this.paginator.page,
                    this.sort.sortChange, this.textFilterPrognr.valueChanges,
                    this.textFilterJahr.valueChanges, this.textFilterZellstoff.valueChanges).pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults.set(true);
          return this.database!.getProdprog(
            this.sort!.active,
            this.sort!.direction,
            this.paginator!.pageIndex,
            this.paginator!.pageSize,
            this.textFilterPrognr!.value ?? '',
            this.textFilterJahr!.value ?? '',
            this.textFilterZellstoff!.value ?? ''
          ).pipe(
            catchError(() => observableOf({ items: [], total_count: 0 })),
            map((data) => {
              this.isLoadingResults.set(false);
              this.isRateLimitReached.set(data === null);
              this.resultsLength.set(data.total_count);
              this.data = data.items;
              return this.data;
            })
          );
        })
      );
    } else {
      throw Error(
        'Please set the database on the data source before connecting.'
      );
    }
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect(): void { }
}
