import { DataSource } from '@angular/cdk/collections';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { ProdprogVorgabe, VorgabeDatabase} from './vorgabe.database';

/**
 * Data source for the Table view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class VorgabeTableDataSource extends DataSource<ProdprogVorgabe> {
  prodid: number = 0;
  vorgabeChanger: Observable<boolean> | undefined;
  data: ProdprogVorgabe[] = [];
  database: VorgabeDatabase;

  constructor() {
    super();
    this.database = new VorgabeDatabase(inject(HttpClient));
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<ProdprogVorgabe[]> {
    if ( this.database) {
      // Combine everything that affects the rendered data into one update
      // stream for the data-table to consume.
      return merge(this.vorgabeChanger).pipe(
        startWith({}),
        switchMap(() => {
          return this.database!.getProdprogVorgabe(
            this.prodid
          ).pipe(
            catchError(() => observableOf({ items: [], total_count: 0 })),
            map((data) => {
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
  disconnect(): void {}
}
