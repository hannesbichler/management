import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment';

export interface ProdprogVorgabeApi {
  items: ProdprogVorgabe[];
  total_count: number;
}

export interface ProdprogVorgabe {
  id: number;
  prdid: number;
  menge: number;
  zellstoff: {
    id: number;
    name: string;
  };
}

interface Result {
  status: string;
  message: string;
}

/** eudrs database that the data source uses to retrieve data for the table. */
export class VorgabeDatabase {
  constructor(private _httpClient: HttpClient) {}

  getProdprogVorgabe(prodid:number): Observable<ProdprogVorgabeApi> {
    const href = `${environment.apiUrl}/api/prodprogvorg`;
    const requestUrl = `${href}?prdid=${prodid}`;//&order=${order}&page=${page+1}&pageSize=${pageSize}`;
    return this._httpClient.get<ProdprogVorgabeApi>(requestUrl);
  }

  updateProdprogVorgabe(vorgabe: ProdprogVorgabe): Observable<Result> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const href = `${environment.apiUrl}/api/prodprogvorg/update`;
    const requestUrl = `${href}`;
    return this._httpClient.post<Result>(requestUrl, {command: "update", vorgabe }, { headers });
  }

  addProdprogVorgabe(vorgabe: ProdprogVorgabe): Observable<Result> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const href = `${environment.apiUrl}/api/prodprogvorg/update`;
    const requestUrl = `${href}`;
    return this._httpClient.post<Result>(requestUrl, {command: "add", vorgabe }, { headers });
  }

  deleteProdprogVorgaben(ids: number[]): Observable<Result> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const href = `${environment.apiUrl}/api/prodprogvorg/delete`;
    const requestUrl = `${href}`;
    return this._httpClient.post<Result>(requestUrl, { ids }, { headers });
  }
}
