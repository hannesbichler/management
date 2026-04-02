import { DataSource } from '@angular/cdk/collections';
import { MatSort } from '@angular/material/sort';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';
import { Zellstoffkategorie, ZellstoffDatabase } from './zellstoff.database';
import { inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

/**
 * Data source for the Table view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class ZellstoffTableDataSource extends DataSource<Zellstoffkategorie> {
  zellstoffChanger: Observable<boolean> | undefined;

  data: Zellstoffkategorie[] = [];
  sort: MatSort | undefined;
  database: ZellstoffDatabase | undefined;
  isLoadingResults = signal(true);
  isRateLimitReached = signal(false);

  constructor() {
    super();
    this.database = new ZellstoffDatabase(inject(HttpClient));
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<Zellstoffkategorie[]> {
    if (this.zellstoffChanger && this.sort && this.database) {
      // Combine everything that affects the rendered data into one update
      // stream for the data-table to consume.
      return merge(this.zellstoffChanger, this.sort.sortChange
      ).pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults.set(true);
          return this.database!.getZellstoffkategorien(
          ).pipe(
            catchError(() => observableOf({ items: [], total_count: 0 })),
            map((data) => {
              this.isLoadingResults.set(false);
              this.isRateLimitReached.set(data === null);
              this.data = data.items;
              return this.data;
            })
          );
        })
      );
    } else {
      throw Error(
        'Please set the paginator, sort and database on the data source before connecting.'
      );
    }
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect(): void { }
}
