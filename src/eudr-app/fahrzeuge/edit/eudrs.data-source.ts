import { DataSource } from '@angular/cdk/collections';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';
import { Eudr, EudrDatabase} from './eudrs.database';
import { HttpClient } from '@angular/common/http';
import { inject, signal } from '@angular/core';

/**
 * Data source for the Table view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class EudrsTableDataSource extends DataSource<Eudr> {
 // textFilterName: FormControl<string | null> | undefined;
 // textFilterUid: FormControl<string | null> | undefined;
 // textFilterZip: FormControl<string | null> | undefined;
 // textFilterCountry: FormControl<string | null> | undefined;
  lsnr: string = '';
  eudrsChanger: Observable<boolean> | undefined;
  data: Eudr[] = [];
 // paginator: MatPaginator | undefined;
 // sort: MatSort | undefined;
  database: EudrDatabase;
  resultsLength = signal(0);
  isLoadingResults = signal(true);
  isRateLimitReached = signal(false);
  constructor() {
    super();
    this.database = new EudrDatabase(inject(HttpClient));
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<Eudr[]> {
    if ( this.database) {
      // Combine everything that affects the rendered data into one update
      // stream for the data-table to consume.
      return merge(this.eudrsChanger).pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults.set(true);
          return this.database!.getEudrs(
            this.lsnr
          ).pipe(
            catchError(() => observableOf({ items: [], total_count: 0 })),
            map((data) => {
              // Flip flag to show that loading has finished.
              this.isLoadingResults.set(false);
              //this.isRateLimitReached.set(data === null);
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
