import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';
import { Lieferung, LieferungenDatabase} from './lieferungen.database';
import { inject, signal } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

/**
 * Data source for the Table view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class LieferungenTableDataSource extends DataSource<Lieferung> {
  textFilterLsnr: FormControl<string | null> | undefined;
  textFilterLieferant: FormControl<string | null> | undefined;
  textFilterZellstoffkat: FormControl<string | null> | undefined;
  checkedEudrStatus: FormControl<boolean | null> | undefined;
  checkedEmptyOrder: FormControl<boolean | null> | undefined;
  checkedEmptyZellstoff: FormControl<boolean | null> | undefined;

  lieferungChanger: Observable<boolean> | undefined;

  data: Lieferung[] = [];
  paginator: MatPaginator | undefined;
  sort: MatSort | undefined;
  database: LieferungenDatabase | undefined;
  resultsLength = signal(0);
  isLoadingResults = signal(true);
  isRateLimitReached = signal(false);

  constructor() {
    super();
    this.database = new LieferungenDatabase(inject(HttpClient));
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<Lieferung[]> {
    if (this.paginator && this.sort && this.database && this.textFilterLsnr && this.textFilterLieferant && this.textFilterZellstoffkat
      && this.checkedEudrStatus && this.lieferungChanger && this.checkedEmptyOrder && this.checkedEmptyZellstoff) {
      // Combine everything that affects the rendered data into one update
      // stream for the data-table to consume.
      return merge(
                    this.paginator.page,
                    this.sort.sortChange,
                    this.textFilterLsnr.valueChanges,
                    this.textFilterLieferant.valueChanges,
                    this.textFilterZellstoffkat.valueChanges,
                    this.checkedEudrStatus.valueChanges,
                    this.checkedEmptyOrder.valueChanges,
                    this.checkedEmptyZellstoff.valueChanges,
                    this.lieferungChanger).pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults.set(true);
          return this.database!.getLieferungen(
            this.sort!.active,
            this.sort!.direction,
            this.paginator!.pageIndex,
            this.paginator!.pageSize,
            this.textFilterLsnr!.value ?? '',
            this.textFilterLieferant!.value ?? '',
            this.textFilterZellstoffkat!.value ?? '',
            this.checkedEudrStatus!.value ?? false,
            this.checkedEmptyOrder!.value ?? false,
            this.checkedEmptyZellstoff!.value ?? false
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
