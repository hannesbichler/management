import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SortDirection } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment';

export interface EudrApi {
  items: Eudr[];
  total_count: number;
}

export interface Eudr {
  id: number;
  lsnr: string;
  prodlotlieferant: string;
  referenznr: string;
  verifnr: string;
  menge: number;
  status: string;
}

interface Result {
  status: string;
  message: string;
}

/** eudrs database that the data source uses to retrieve data for the table. */
export class EudrDatabase {
  constructor(private _httpClient: HttpClient) {}

  getEudrs(lsnr: string): Observable<EudrApi> {
    const href = `${environment.apiUrl}/api/eudrs`;
    const requestUrl = `${href}?sort=prodlotlieferant&order=asc&page=1&pageSize=1000&lsnr=${lsnr}`;
    return this._httpClient.get<EudrApi>(requestUrl);
  }

  updateEudr(eudr: Eudr): Observable<Result> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const href = `${environment.apiUrl}/api/eudr/update`;
    const requestUrl = `${href}`;
    return this._httpClient.post<Result>(requestUrl, {command: "update", eudr }, { headers });
  }

  addEudr(eudr: Eudr): Observable<Result> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const href = `${environment.apiUrl}/api/eudr/update`;
    const requestUrl = `${href}`;
    return this._httpClient.post<Result>(requestUrl, {command: "add", eudr }, { headers });
  }

  deleteEudrs(ids: number[]): Observable<Result> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const href = `${environment.apiUrl}/api/eudrs/delete`;
    const requestUrl = `${href}`;
    return this._httpClient.post<Result>(requestUrl, { ids }, { headers });
  }

  validateEudr(ids: number[]): Observable<Result> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const href = `${environment.apiUrl}/api/eudrs/validate`;
    const requestUrl = `${href}`;
    return this._httpClient.post<Result>(requestUrl, { ids }, { headers });
  }
}
