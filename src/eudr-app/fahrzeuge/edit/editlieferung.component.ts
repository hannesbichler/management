import { Component, Inject, ChangeDetectionStrategy, signal, inject, computed, AfterViewInit, ViewChild } from '@angular/core';
import { MatFormField, MatFormFieldModule, MatLabel } from "@angular/material/form-field";
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MatDialogContent, MatDialogActions, MAT_DIALOG_DATA, MatDialogTitle, MatDialog } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSelectModule } from '@angular/material/select';
import { HttpClient } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';
import { NgForOf, AsyncPipe } from '@angular/common';
import { LieferantenApi, LieferantenDatabase } from '../../lieferanten/lieferanten.database';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter, MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatTable, MatTableModule } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatCheckbox, MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { EditEudrComponent } from './editeudr.component';
import { DeleteLiefEudrsComponent } from '../delete/deleteliefeudrs.component';
import { ZellstoffDatabase, ZellstoffkategorienApi } from '../../settings/zellstoff.database';
import { ZellstoffTableDataSource } from '../../settings/zellstoff.data-source';
import { EudrsTableDataSource } from './eudrs.data-source';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EditGesperrtComponent } from './editgesperrt.component';
import { ValidateEudrComponent } from '../../eudrs/validate/validateeudr.component';

@Component({
  selector: 'editlieferung-dialog',
  styleUrls: ['./editlieferung.component.css'],
  templateUrl: './editlieferung.component.html',
  providers: [provideNativeDateAdapter(), { provide: MAT_DATE_LOCALE, useValue: 'de-At' }],
  standalone: true,
  imports: [MatTooltipModule, MatExpansionModule, MatIconModule, MatCheckboxModule, MatTableModule, MatDialogTitle, MatDatepickerModule, AsyncPipe, NgForOf, MatSelectModule, MatGridListModule, MatFormFieldModule, FormsModule, MatInputModule, MatDialogContent, MatDialogActions, MatButtonModule, MatFormField, MatLabel, NgForOf],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class EditLieferungComponent implements AfterViewInit {
  private _httpClient = inject(HttpClient);
  private zelldb = new ZellstoffDatabase(this._httpClient);
  kategorien$ = this.zelldb.getZellstoffkategorien();
  private lieferantdb = new LieferantenDatabase(this._httpClient);
  lieferanten$ = this.lieferantdb.getLieferanten("name", "asc", 0, 1000, "", "", "", "");
  // private database = new EudrDatabase(this._httpClient);
  eudrschanged = false;
  private eudrsChanger = new Subject<boolean>();
  @ViewChild(MatTable) table!: MatTable<Eudr>;
  @ViewChild('validCheckBox') validCheckBox!: MatCheckbox;

  displayedColumns: string[] = ['select', 'prodlotlieferant', 'referenznr', 'verifnr', 'menge', 'status', 'add'];
  selection = new SelectionModel<Eudr>(true, []);

  dataSource: EudrsTableDataSource;

  ngAfterViewInit(): void {
    this.dataSource.eudrsChanger = this.eudrsChanger.asObservable();
    this.dataSource.lsnr = this.data.lieferung.id;
    this.table.dataSource = this.dataSource;

  }

  constructor(public dialog: MatDialog,
    public dialogRef: MatDialogRef<EditLieferungComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.dataSource = new EudrsTableDataSource();
  }

  compareFnZellstoff(f1: any, f2: any): boolean {
    return f1 && f2 ? f1.id === f2.id : f1 === f2;
  }

  compareFnLieranten(f1: any, f2: any): boolean {
    return f1 && f2 ? f1.id === f2.id : f1 === f2;
  }

  public onFeatureEnabledChange(event: MatCheckboxChange) {
    const checked = event.checked;
    if (!checked) {
      // add ja/nein dialog
      const dialogRef = this.dialog.open(EditGesperrtComponent, {
        height: '250px',
        width: '400px',
        maxWidth: '100%',
        disableClose: true
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result == false) {
          this.data.lieferung.gesperrt = true;
          event.source.checked = true;
        }
      });
    }
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource!.data ? this.dataSource!.data.length : 0;
    return numSelected === numRows;
  }
  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource!.data);
  }

  checkIfDisabled(): boolean {
    if (this.data.lieferung.gesperrt == 1) {
      return true;
    }
    return false;
  }

  checkIfDisabledForDelete(): boolean {
    if (this.selection.selected.length == 0 || this.data.lieferung.gesperrt == 1) {
      return true;
    }
    return false;
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Eudr): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  addEudr() {
    if (this.data.lieferung.id <= 0) {
      alert('Bitte zuerst die Lieferung speichern bevor EUDRs hinzugefügt werden können!');
      return;
    }

    let eudr = { lsnr: "", prodlotlieferant: "", verifnr: "", referenznr: "", menge: 0.0, status: "", id: 0 };
    const dialogRef = this.dialog.open(EditEudrComponent, {
      height: '220px',
      width: '800px',
      maxWidth: '100%',
      data: { caption: "neue UDR anlegen!", eudr: eudr },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        // add to database
        eudr.lsnr = this.data.lieferung.id;
        this.dataSource?.database!.addEudr(eudr).subscribe((result) => {
          if (result.status === 'error') {
            alert('Error adding Eudr: ' + result.message);
          }
          else {
            this.eudrsChanger.next(true);
          }
        });
      }
    });
  }

  editEudr(row: Eudr) {
    let eudr = { lsnr: row.lsnr, prodlotlieferant: row.prodlotlieferant, verifnr: row.verifnr, referenznr: row.referenznr, menge: row.menge, status: row.status, id: row.id };
    const dialogRef = this.dialog.open(EditEudrComponent, {
      height: '220px',
      width: '800px',
      maxWidth: '100%',
      data: { caption: "neue UDR anlegen!", eudr: eudr },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        row.lsnr = eudr.lsnr;
        row.prodlotlieferant = eudr.prodlotlieferant;
        row.referenznr = eudr.referenznr;
        row.verifnr = eudr.verifnr;
        row.menge = eudr.menge;
        row.status = eudr.status;
        // add to database
        eudr.lsnr = this.data.lieferung.id;
        this.dataSource!.database!.updateEudr(eudr).subscribe((result) => {
          if (result.status === 'error') {
            alert('Error adding Eudr: ' + result.message);
          }
          else {
            this.eudrsChanger.next(true);
          }
        });
      }
    });
  }

  deleteEudrs() {
    const dialogRef = this.dialog.open(DeleteLiefEudrsComponent, {
      height: '250px',
      width: '300px',
      maxWidth: '100%',
      data: { eudrs: this.selection.selected }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        var ids: number[] = [];
        this.selection.selected.forEach(row => {
          ids.push((row as any).id);
        });
        this.dataSource!.database!.deleteEudrs(ids).subscribe((result) => {
          if (result.status === 'error') {
            alert('Error updating Eudrs: ' + result.message);
          } else {
            this.eudrsChanger.next(true);
          }
        });
      }
    });
  }

  verificationIcon(status: string): string {
    if (status === "VALID")
      return "check";
    if (status === "AVAILABLE")
      return "check";
    if (status === "INITIAL")
      return "autorenew";
    else
      return "close";
  }

  verificationIconClass(status: string): string {
    if (status === "VALID")
      return "eudrs-state-valid";
    if (status === "AVAILABLE")
      return "eudrs-state-valid";
    if (status === "INITIAL")
      return "eudrs-state-initial";
    else
      return "eudrs-state-invalid";
  }

  verificationTooltip(status: string): string {
    if (status === "VALID")
      return "Eudr Status valide!";
    if (status === "AVAILABLE")
      return "Eudr Status available!";
    if (status === "INITIAL")
      return "Eudr Validierung ausständig!";
    else
      return "Eudr Status nicht valide!";
  }

  async validateEudrs(ids: number[]) {
    const dialogRef = this.dialog.open(ValidateEudrComponent, {
      height: '450px',
      width: '600px',
      maxWidth: '100%',
      data: { caption: "Eudr validieren!", ids: ids },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      this.eudrsChanger.next(true);
    });
  }

  async validieren(row: Eudr, singlevalidate?: boolean) {
    if (row.status == "valid") {
      if (singlevalidate)
        alert('Eudr bereits validert und Status ist valide, keine weiter validierung notwendig. Referenznummer: ' + row.referenznr);
    } else {
      this.validateEudrs([row.id]);
    }
  }

  async alleValidieren() {
    if (this.data.lieferung.valide) {
      alert('Lieferung ist bereits als valide markiert, keine weiter validierung notwendig.');
      return;
    }
    var ids: number[] = [];
    this.dataSource.data.forEach((eudr: Eudr) => {
      ids.push(eudr.id);
    });
    await this.validateEudrs(ids);
    //this.data.lieferung.valide = true;
  }
}

export interface EudrApi {
  items: Eudr[];
  total_count: number;
}

//'id', 'lsnr', 'prodlotlieferant', 'referenznr', 'verifnr', 'menge', 'status'
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
