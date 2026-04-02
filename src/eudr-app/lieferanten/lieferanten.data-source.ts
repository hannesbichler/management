import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';
import { Lieferant, LieferantenDatabase} from './lieferanten.database';
import { signal } from '@angular/core';
import { FormControl } from '@angular/forms';

/**
 * Data source for the Table view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class LieferantenTableDataSource extends DataSource<Lieferant> {
  textFilterName: FormControl<string | null> | undefined;
  textFilterUid: FormControl<string | null> | undefined;
  textFilterZip: FormControl<string | null> | undefined;
  textFilterCountry: FormControl<string | null> | undefined;
  lieferantChanger: Observable<boolean> | undefined;
  data: Lieferant[] = [];
  paginator: MatPaginator | undefined;
  sort: MatSort | undefined;
  database: LieferantenDatabase | undefined;
  resultsLength = signal(0);
  isLoadingResults = signal(true);
  isRateLimitReached = signal(false);
  constructor() {
    super();
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<Lieferant[]> {
    if (this.paginator && this.sort && this.database && this.textFilterName && this.textFilterUid && this.textFilterZip && this.textFilterCountry && this.lieferantChanger) {
      // Combine everything that affects the rendered data into one update
      // stream for the data-table to consume.
      return merge(
                    this.paginator.page,
                    this.sort.sortChange,
                    this.textFilterName.valueChanges,
                    this.textFilterUid.valueChanges,
                    this.textFilterZip.valueChanges,
                    this.textFilterCountry.valueChanges,
                    this.lieferantChanger).pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults.set(true);
          return this.database!.getLieferanten(
            this.sort!.active,
            this.sort!.direction,
            this.paginator!.pageIndex,
            this.paginator!.pageSize,
            this.textFilterName!.value ?? '',
            this.textFilterUid!.value ?? '',
            this.textFilterZip!.value ?? '',
            this.textFilterCountry!.value ?? ''
          ).pipe(
            catchError(() => observableOf({ items: [], total_count: 0 })),
            map((data) => {
              // Flip flag to show that loading has finished.
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
        'Please set the paginator, sort and database on the data source before connecting.'
      );
    }
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect(): void {}
}
