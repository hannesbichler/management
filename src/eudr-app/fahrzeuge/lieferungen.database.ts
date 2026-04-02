import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SortDirection } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { environment } from '../../../environment';

export interface LieferungenApi {
  items: Lieferung[];
  total_count: number;
}

export interface LieferantenApi {
  items: Lieferant[];
}

export interface Lieferant {
  name:string;
}

export interface Lieferung {
  id: number;
  lsnr: string;
  lsnrlieferant: string;
  lieferant: {
    id: number;
    name: string;
  };
  //  lieferantname: string;
  lieferdate: Date;
  prodname: string;
  zellstoff: {
    id: number;
    name: string;
  };
  valide: boolean;
  gesperrt: boolean;
  menge: number;
}

interface Result {
  status: string;
  message: string;
}

/** lieferungen database that the data source uses to retrieve data for the table. */
export class LieferungenDatabase {
  constructor(private _httpClient: HttpClient) { }

  getLieferungen(sort: string, order: SortDirection, page: number, pageSize: number,
    filterLsnr: string,
    filterLieferant: string,
    filterZellstoffkat: string,
    filterEudrStatus: boolean,
    filterEmptyOrder: boolean,
    filterEmptyZellstoff: boolean
  ): Observable<LieferungenApi> {
    const href = `${environment.apiUrl}/api/lieferungen`;
    const requestUrl = `${href}?sort=${sort}&order=${order}&page=${page + 1}&pageSize=${pageSize}&fLsnr=${filterLsnr}&fLieferant=${filterLieferant}&fZellstoffkat=${filterZellstoffkat}&fEudrStatus=${filterEudrStatus}&fEmptyOrder=${filterEmptyOrder}&fEmptyZellstoff=${filterEmptyZellstoff}`;
    return this._httpClient.get<LieferungenApi>(requestUrl);
  }

  updateLieferung(lieferung: Lieferung): Observable<Result> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const href = `${environment.apiUrl}/api/lieferung/update`;
    const requestUrl = `${href}`;
    return this._httpClient.post<Result>(requestUrl, { command: "update", lieferung }, { headers });
  }

  addLieferung(lieferung: Lieferung): Observable<Result> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const href = `${environment.apiUrl}/api/lieferung/update`;
    const requestUrl = `${href}`;
    return this._httpClient.post<Result>(requestUrl, { command: "add", lieferung }, { headers });
  }

  deleteLieferungen(ids: number[]): Observable<Result> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const href = `${environment.apiUrl}/api/lieferungen/delete`;
    const requestUrl = `${href}`;
    return this._httpClient.post<Result>(requestUrl, { ids }, { headers });
  }

  importLieferungen(): Observable<Result> {
    const href = `${environment.apiUrl}/api/lieferungen/import`;
    const requestUrl = `${href}`;
    return this._httpClient.get<Result>(requestUrl);
  }

  getLieferungenForLieferanten(lieferantenIds: number[]): Observable<LieferantenApi> {
    const href = `${environment.apiUrl}/api/lieferungenforlieferanten`;
    const requestUrl = `${href}?lieferantenIds=${lieferantenIds}`;
    return this._httpClient.get<LieferantenApi>(requestUrl);
  }
}
