import { Component, ViewChild, AfterViewInit, inject, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { MatIconModule } from '@angular/material/icon';
import { MatTable, MatTableModule } from '@angular/material/table';
import { EditZellstoffkategorieComponent } from './zellstoffkat/edit/editzellstoffkat.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DeleteZellstoffkategorienComponent } from './zellstoffkat/delete/deletezellstoffkat.component';
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatButtonModule } from '@angular/material/button';
import { Zellstoffkategorie } from './zellstoff.database';
import { ZellstoffTableDataSource } from './zellstoff.data-source';
import { HttpClient } from '@angular/common/http';
import { LieferungenDatabase } from '../fahrzeuge/lieferungen.database';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormField, MatFormFieldModule, MatLabel } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { UploadComponent } from '../upload/upload.component';
import { DatabaseSettings, EudrSettings, ImportExportSettings, LogSettings, SettingsDatabase } from './settings.database';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [FormsModule, MatInputModule, MatFormFieldModule, MatFormField, MatButtonModule, MatIconModule, MatTableModule, MatDialogModule, MatCheckboxModule, MatProgressSpinnerModule, MatSortModule, MatLabel],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
})

export class SettingsComponent implements AfterViewInit, OnInit, OnDestroy {
  private zellstoffChanger = new Subject<boolean>();
  private subscriptions = new Subscription();

  displayedColumns: string[] = ['select', 'name', 'add'];
  //lieferungen: LieferungenDatabase;
  selection = new SelectionModel<Zellstoffkategorie>(true, []);

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Zellstoffkategorie>;
  dataSource: ZellstoffTableDataSource;
  settingsDB: SettingsDatabase;
  ieSettings: ImportExportSettings | null = null;
  eudrSettings: EudrSettings | null = null;
  dbSettings: DatabaseSettings | null = null;
  logSettings: LogSettings | null = null;

  constructor(public dialog: MatDialog) {
    this.dataSource = new ZellstoffTableDataSource();
    this.settingsDB = new SettingsDatabase(inject(HttpClient));
  }

  ngOnInit() {
    this.loadIESettings();
    this.loadEudrSettings();
    this.loadDBSettings();
    this.loadLogSettings();
  }

  loadIESettings() {
    // Subscribe to settings observable
    const settingsSub = this.settingsDB.getImportExportSettings().subscribe({
      next: (settings) => {
        this.ieSettings = settings;
        console.log('Settings loaded:', settings);
        // Update UI with loaded settings
        this.updateSettingsUI(settings);
      },
      error: (error) => {
        console.error('Error loading settings:', error);
        // Handle error - show error message or load defaults
        this.handleSettingsError(error);
      },
      complete: () => {
        console.log('Settings observable completed');
      }
    });

    // Add to subscriptions for cleanup
    this.subscriptions.add(settingsSub);
  }

  loadEudrSettings() {
    // Subscribe to settings observable
    const settingsSub = this.settingsDB.getEudrSettings().subscribe({
      next: (settings) => {
        this.eudrSettings = settings;
        console.log('Settings loaded:', settings);
        // Update UI with loaded settings
        //this.updateSettingsUI(settings);
      },
      error: (error) => {
        console.error('Error loading settings:', error);
        // Handle error - show error message or load defaults
        this.handleSettingsError(error);
      },
      complete: () => {
        console.log('Settings observable completed');
      }
    });

    // Add to subscriptions for cleanup
    this.subscriptions.add(settingsSub);
  }

  loadDBSettings() {
    // Subscribe to settings observable
    const settingsSub = this.settingsDB.getDBSettings().subscribe({
      next: (settings) => {
        this.dbSettings = settings;
        console.log('Settings loaded:', settings);
      },
      error: (error) => {
        console.error('Error loading settings:', error);
        // Handle error - show error message or load defaults
        this.handleSettingsError(error);
      },
      complete: () => {
        console.log('Settings observable completed');
      }
    });

    // Add to subscriptions for cleanup
    this.subscriptions.add(settingsSub);
  }

  loadLogSettings() {
    // Subscribe to settings observable
    const settingsSub = this.settingsDB.getLogSettings().subscribe({
      next: (settings) => {
        this.logSettings = settings;
        console.log('Settings loaded:', settings);
      },
      error: (error) => {
        console.error('Error loading settings:', error);
        // Handle error - show error message or load defaults
        this.handleSettingsError(error);
      },
      complete: () => {
        console.log('Settings observable completed');
      }
    });

    // Add to subscriptions for cleanup
    this.subscriptions.add(settingsSub);
  }

  ngOnDestroy() {
    // Clean up all subscriptions
    this.subscriptions.unsubscribe();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.zellstoffChanger = this.zellstoffChanger
    this.table.dataSource = this.dataSource;
  }

  private updateSettingsUI(settings: ImportExportSettings) {
    console.log('Updating UI with settings:', settings);
  }

  private handleSettingsError(error: any) {
    console.error('Failed to load settings:', error);
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  checkIfDisabled(): boolean {
    if (this.selection.selected.length == 0) {
      return true;
    }
    return false;
  }
  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Zellstoffkategorie): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  addZellstoffkat() {
    let zellstoffkat = { name: "", id: 0 };
    const dialogRef = this.dialog.open(EditZellstoffkategorieComponent, {
      height: '250px',
      width: '350px',
      maxWidth: '100%',
      data: { caption: "Zellstoffsorte anlegen", zellstoffkat: zellstoffkat },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.dataSource.database!.addZellstoffkategorie(zellstoffkat).subscribe((result) => {
          if (result.status === 'error') {
            alert('Error updating Zellstoffkategorie: ' + result.message);
          }
          else {
            this.zellstoffChanger.next(true);
          }
        });
        // this.ngAfterViewInit();
      }
    });
  }

  editZellstoffkat(row: Zellstoffkategorie) {
    let zellstoffkat = { id: row.id, name: row.name };
    const dialogRef = this.dialog.open(EditZellstoffkategorieComponent, {
      height: '250px',
      width: '350px',
      maxWidth: '100%',
      data: { caption: "Zellstoffsorte bearbeiten", edit: true, zellstoffkat: zellstoffkat },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.dataSource.database!.updateZellstoffkategorie(zellstoffkat).subscribe((result) => {
          if (result.status === 'error') {
            alert('Error updating Zellstoffkategorie: ' + result.message);
          }
          else {
            this.zellstoffChanger.next(true);
            //  this.ngAfterViewInit();
          }
        });
      }
    });
  }

  deleteZellstoffkat() {
    const dialogRef = this.dialog.open(DeleteZellstoffkategorienComponent, {
      height: '250px',
      width: '300px',
      maxWidth: '100%',
      data: { zellstoffkats: this.selection.selected },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        var ids: number[] = [];
        this.selection.selected.forEach(row => {
          ids.push((row as any).id);
        });
        this.dataSource.database!.deleteZellstoffkategorien(ids).subscribe((result) => {
          if (result.status === 'error') {
            alert('Error updating Zellstoffkategorien: ' + result.message);
          } else {
            this.zellstoffChanger.next(true);
          }
        });
      }
    });
  }

  updateIESettings() {
    this.settingsDB?.updateImportExportSettings(this.ieSettings!).subscribe((result) => {
      if (result.status === 'error') {
        alert('Error updating Import/Export Settings: ' + result.message);
      }
    });
  }

  updateEudrSettings() {
    this.settingsDB?.updateEudrSettings(this.eudrSettings!).subscribe((result) => {
      if (result.status === 'error') {
        alert('Error updating EUDR Settings: ' + result.message);
      }
    });
  }

  updateLogSettings() {
    this.settingsDB?.updateLogSettings(this.logSettings!).subscribe((result) => {
      if (result.status === 'error') {
        alert('Error updating Log Settings: ' + result.message);
      }
    });
  }

  updateDBSettings() {
    this.settingsDB?.updateDBSettings(this.dbSettings!).subscribe((result) => {
      if (result.status === 'error') {
        alert('Error updating DB Settings: ' + result.message);
      }
    });
  }
}
