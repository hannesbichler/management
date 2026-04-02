import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SortDirection } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { environment } from '../../../environment';

export interface ProdprogApi {
  items: Prodprog[];
  total_count: number;
}

export interface Prodprog {
  id: number;
  start: Date;
  ende: Date;
  jahr: number;
  prog_nr: string;
  prodprog_nr: string;
  beendet: boolean;
}

interface Result {
  status: string;
  message: string;
}

interface AddResult {
  status: string;
  message: string;
  id: number;
}

/** Produktionsprogramm database that the data source uses to retrieve data for the table. */
export class ProdprogDatabase {
  constructor(private _httpClient: HttpClient) { }

  getProdprog(sort: string, order: SortDirection, page: number, pageSize: number,
    filterPrognr: string, filterJahr: string, filterZellstoff: string
  ): Observable<ProdprogApi> {
    const href = `${environment.apiUrl}/api/prodprog`;
    const requestUrl = `${href}?sort=${sort}&order=${order}&page=${page + 1}&pageSize=${pageSize}&fPrognr=${filterPrognr}&fJahr=${filterJahr}&fZellstoff=${filterZellstoff}`;
    return this._httpClient.get<ProdprogApi>(requestUrl);
  }

  updateProdprog(prodprog: Prodprog): Observable<Result> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const href = `${environment.apiUrl}/api/prodprog/update`;
    const requestUrl = `${href}`;
    return this._httpClient.post<Result>(requestUrl, { command: "update", prodprog }, { headers });
  }

  addProdprog(prodprog: Prodprog): Observable<AddResult> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const href = `${environment.apiUrl}/api/prodprog/update`;
    const requestUrl = `${href}`;
    return this._httpClient.post<AddResult>(requestUrl, { command: "add", prodprog }, { headers });
  }

  deleteProdprog(ids: number[]): Observable<Result> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const href = `${environment.apiUrl}/api/prodprog/delete`;
    const requestUrl = `${href}`;
    return this._httpClient.post<Result>(requestUrl, { ids }, { headers });
  }
}
