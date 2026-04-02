import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment';

export interface LieferantenApi {
  items: Lieferant[];
  total_count: number;
}

//'Name', 'EORI', 'UID', 'Straße', 'PLZ', 'Stadt', 'Land'
export interface Lieferant {
  id: number;
  name: string;
  eori: string;
  uid: string;
  address: string;
  zip: string;
  city: string;
  country: string;
}

interface Result {
  status: string;
  message: string;
}

/** lieferanten database that the data source uses to retrieve data for the table. */
export class LieferantenDatabase {
  constructor(private _httpClient: HttpClient) {}

  getLieferanten(sort: string, direction: string, pageIndex: number, pageSize: number, filterName: string, filterUid: string, filterZip: string, filterCountry: string): Observable<LieferantenApi> {
    const href = `${environment.apiUrl}/api/lieferanten`;
    const requestUrl = `${href}?sort=${sort}&order=${direction}&page=${pageIndex+1}&pageSize=${pageSize}&fName=${filterName}&fUid=${filterUid}&fZip=${filterZip}&fCountry=${filterCountry}`;
    return this._httpClient.get<LieferantenApi>(requestUrl);
  }

  updateLieferant(lieferant: Lieferant): Observable<Result> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const href = `${environment.apiUrl}/api/lieferant/update`;
    const requestUrl = `${href}`;
    return this._httpClient.post<Result>(requestUrl, {command: "update", lieferant }, { headers });
  }

  addLieferant(lieferant: Lieferant): Observable<Result> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const href = `${environment.apiUrl}/api/lieferant/update`;
    const requestUrl = `${href}`;
    return this._httpClient.post<Result>(requestUrl, {command: "add", lieferant }, { headers });
  }

  deleteLieferanten(ids: number[]): Observable<Result> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const href = `${environment.apiUrl}/api/lieferanten/delete`;
    const requestUrl = `${href}`;
    return this._httpClient.post<Result>(requestUrl, { ids }, { headers });
  }
}
