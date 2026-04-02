import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment';
import { Zellstoffkategorie, ZellstoffkategorienApi } from './zellstoff.database';

export interface ImportExportSettings {
  folderimport: string;
  folderarchive: string;
  importauto: boolean;
  importinterval: number;
  folderexport: string;
}

export interface EudrSettings {
  username: string;
  password: string;
  webServiceClientId: string;
  ssl: boolean;
  timestampValidity: number;
  timeout: number;
}

export interface DatabaseSettings {
  login: string;
  password: string;
  database: string;
  server: string;
  driver: string;
  options: {
    trustedConnection: boolean;
  }
}

export interface LogSettings {
  level: string;
  folder: string;
  maxFiles: number;
  autoDelete: boolean;
}

interface Result {
  status: string;
  message: string;
}

/** lieferungen database that the data source uses to retrieve data for the table. */
export class SettingsDatabase {
  constructor(private _httpClient: HttpClient) { }

  getImportExportSettings(): Observable<ImportExportSettings> {
    const href = `${environment.apiUrl}/api/iesettings/get`;
    const requestUrl = `${href}`;
    return this._httpClient.get<ImportExportSettings>(requestUrl);
  }

  updateImportExportSettings(ieSettings: ImportExportSettings): Observable<Result> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const href = `${environment.apiUrl}/api/iesettings/update`;
    const requestUrl = `${href}`;
    return this._httpClient.post<Result>(requestUrl, { ieSettings }, { headers });
  }

  getEudrSettings(): Observable<EudrSettings> {
    const href = `${environment.apiUrl}/api/eudrsettings/get`;
    const requestUrl = `${href}`;
    return this._httpClient.get<EudrSettings>(requestUrl);
  }

  updateEudrSettings(eudrSettings: EudrSettings): Observable<Result> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const href = `${environment.apiUrl}/api/eudrsettings/update`;
    const requestUrl = `${href}`;
    return this._httpClient.post<Result>(requestUrl, { eudrSettings }, { headers });
  }

  getDBSettings(): Observable<DatabaseSettings> {
    const href = `${environment.apiUrl}/api/dbsettings/get`;
    const requestUrl = `${href}`;;//?sort=${sort}&order=${order}&page=${page+1}&pageSize=${pageSize}`;
    return this._httpClient.get<DatabaseSettings>(requestUrl);
  }

  updateDBSettings(dbSettings: DatabaseSettings): Observable<Result> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const href = `${environment.apiUrl}/api/dbsettings/update`;
    const requestUrl = `${href}`;
    return this._httpClient.post<Result>(requestUrl, { dbSettings }, { headers });
  }

  getLogSettings(): Observable<LogSettings> {
    const href = `${environment.apiUrl}/api/logsettings/get`;
    const requestUrl = `${href}`;;//?sort=${sort}&order=${order}&page=${page+1}&pageSize=${pageSize}`;
    return this._httpClient.get<LogSettings>(requestUrl);
  }

  updateLogSettings(logSettings: LogSettings): Observable<Result> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const href = `${environment.apiUrl}/api/logsettings/update`;
    const requestUrl = `${href}`;
    return this._httpClient.post<Result>(requestUrl, { logSettings }, { headers });
  }
}
