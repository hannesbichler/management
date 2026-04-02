import { Routes } from '@angular/router';
import { LieferantenComponent } from './lieferanten/lieferanten.component';
import { LieferungenComponent } from './fahrzeuge/lieferungen.component';
import { SettingsComponent } from './settings/settings.component';
import { ProdProgComponent } from './prodprog/prodprog.component';
import { EudrsComponent } from './eudrs/eudrs.component';
import { LogsComponent } from './logs/logs.component';
import { LieferungImportComponent } from './lieferung-import/lieferung-import.component';
import { SAPExportComponent } from './sap-export/sap-export.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
 // { path: '', redirectTo: 'lieferanten', pathMatch: 'full' },
  { path: '', component: HomeComponent },
  { path: 'lieferanten', component: LieferantenComponent },
  { path: 'fahrzeuge', component: LieferungenComponent, runGuardsAndResolvers: 'always' },
  { path: 'lieferungenEmptyOrder', component: LieferungenComponent, runGuardsAndResolvers: 'always' },
  { path: 'settings', component: SettingsComponent },
  { path: 'prodprog', component: ProdProgComponent },
  { path: 'eudrs', component: EudrsComponent },
  { path: 'lieferung-import', component: LieferungImportComponent },
  { path: 'sap-export', component: SAPExportComponent },
  { path: 'logs', component: LogsComponent },
];
