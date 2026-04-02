import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment';

export interface ZellstoffkategorienApi {
  items: Zellstoffkategorie[];
  total_count: number;
}

export interface Zellstoffkategorie {
  id: number;
  name: string;
}

interface Result {
  status: string;
  message: string;
}

/** lieferungen database that the data source uses to retrieve data for the table. */
export class ZellstoffDatabase {
  constructor(private _httpClient: HttpClient) {}

  getZellstoffkategorien(): Observable<ZellstoffkategorienApi> {
    const href = `${environment.apiUrl}/api/zellstoffkategorien`;
    const requestUrl = `${href}`;;//?sort=${sort}&order=${order}&page=${page+1}&pageSize=${pageSize}`;
    return this._httpClient.get<ZellstoffkategorienApi>(requestUrl);
  }

  updateZellstoffkategorie(zellstoffkategorie: Zellstoffkategorie): Observable<Result> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const href = `${environment.apiUrl}/api/zellstoffkategorie/update`;
    const requestUrl = `${href}`;
    return this._httpClient.post<Result>(requestUrl, {command: "update", zellstoffkategorie }, { headers });
  }

  addZellstoffkategorie(zellstoffkategorie: Zellstoffkategorie): Observable<Result> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const href = `${environment.apiUrl}/api/zellstoffkategorie/update`;
    const requestUrl = `${href}`;
    return this._httpClient.post<Result>(requestUrl, {command: "add", zellstoffkategorie }, { headers });
  }

  deleteZellstoffkategorien(ids: number[]): Observable<Result> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const href = `${environment.apiUrl}/api/zellstoffkategorien/delete`;
    const requestUrl = `${href}`;
    return this._httpClient.post<Result>(requestUrl, { ids }, { headers });
  }
}
