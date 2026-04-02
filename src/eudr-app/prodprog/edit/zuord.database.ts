import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Eudr, EudrApi } from '../../eudrs/eudrs.database';
import { environment } from '../../../../environment';

export interface ProdprogZuordApi {
  items: ProdprogZuordWithEudr[];
  total_count: number;
}

export interface ProdprogZuord {
  id: number;
  prdid: number;
  eudrid: number;
  menge: number;
}

export interface ProdprogZuordWithEudr {
  id: number;
  prdid: number;
  eudr: number;
  lsnr: number;
  verifnr: string;
  referencenr: string;
  menge: number;
}

interface Result {
  status: string;
  message: string;
}

/** eudrs database that the data source uses to retrieve data for the table. */
export class ZuordDatabase {
  constructor(private _httpClient: HttpClient) { }

  getProdprogZuord(prodid: number): Observable<ProdprogZuordApi> {
    const href = `${environment.apiUrl}/api/prodprogzuord`;
    const requestUrl = `${href}?prdid=${prodid}`;//?sort=${sort}&order=${order}&page=${page+1}&pageSize=${pageSize}`;
    return this._httpClient.get<ProdprogZuordApi>(requestUrl);
  }

  updateProdprogZuord(zuord: ProdprogZuord): Observable<Result> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const href = `${environment.apiUrl}/api/prodprogzuord/update`;
    const requestUrl = `${href}`;
    return this._httpClient.post<Result>(requestUrl, { command: "update", zuord }, { headers });
  }

  addProdprogZuord(zuord: ProdprogZuord): Observable<Result> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const href = `${environment.apiUrl}/api/prodprogzuord/update`;
    const requestUrl = `${href}`;
    return this._httpClient.post<Result>(requestUrl, { command: "add", zuord }, { headers });
  }

  deleteProdprogZuord(ids: number[]): Observable<Result> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const href = `${environment.apiUrl}/api/prodprogzuord/delete`;
    const requestUrl = `${href}`;
    return this._httpClient.post<Result>(requestUrl, { ids }, { headers });
  }

  getProdProgZuordForVorgabe(prodid: number): Observable<EudrApi> {
    const href = `${environment.apiUrl}/api/eudrsvorzuordnung`;
    const requestUrl = `${href}?prdid=${prodid}`;
    return this._httpClient.get<EudrApi>(requestUrl);
  }

  prodProgZuordForVorgabe(prodid: number): Observable<Result> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const href = `${environment.apiUrl}/api/prodprogzuord/autozuordnung`;
    const requestUrl = `${href}`;
    return this._httpClient.post<Result>(requestUrl, { prodid }, { headers });
  }


  exportProdprogForSAP(ids: number[]): Observable<Result> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const href = `${environment.apiUrl}/api/prodprog/exportforsap`;
    const requestUrl = `${href}`;
    return this._httpClient.post<Result>(requestUrl, { ids }, { headers });
  }
}
