import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment';

interface Result {
  status: string;
  message: string;
}

/** eudrs database that the data source uses to retrieve data for the table. */
export class ProdProgDatabase {
  constructor(private _httpClient: HttpClient) { }

  exportProdprogForSAP(ids: number[]): Observable<Result> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const href = `${environment.apiUrl}/api/prodprog/exportforsap`;
    const requestUrl = `${href}`;
    return this._httpClient.post<Result>(requestUrl, { ids }, { headers });
  }
}
