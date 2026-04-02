import { AfterViewInit, Component, Inject, ViewChild } from '@angular/core';
import { MatFormField, MatFormFieldModule, MatLabel } from "@angular/material/form-field";
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MatDialogContent, MatDialogActions, MAT_DIALOG_DATA, MatDialogTitle, MatDialog } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTable, MatTableModule } from '@angular/material/table';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { Subject } from 'rxjs';
import { MatExpansionModule } from '@angular/material/expansion';
import { EditVorgabeComponent } from './editvorgabe.component';
import { VorgabeTableDataSource } from './vorgabe.data-source';
import { ZuordTableDataSource } from './zuord.data-source';
import { ProdprogVorgabe } from './vorgabe.database';
import { ProdprogZuordWithEudr } from './zuord.database';
import { EditZuordComponent } from './editzuord.component';
import { DeleteVorgabenComponent } from '../delete/deletevorgaben.component';
import { DeleteZuordnungenComponent } from '../delete/deletezuord.component';
import { EditGesperrtComponent } from './editgesperrt.component';
import { ProdprogTableDataSource } from '../prodprog.data-source';
import { ExportSAPComponent } from '../export/exportprodprog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'editprodprog-dialog',
  templateUrl: './editprodprog.component.html',
  standalone: true,
  providers: [provideNativeDateAdapter(), { provide: MAT_DATE_LOCALE, useValue: 'de-At' }],
  imports: [MatExpansionModule, MatCheckboxModule, MatTableModule, MatIconModule, MatDatepickerModule, MatGridListModule, MatDialogTitle, MatFormFieldModule, FormsModule, MatInputModule, MatDialogContent, MatDialogActions, MatButtonModule, MatFormField, MatLabel],
})

export class EditProdprogComponent implements AfterViewInit {
  dataSourceVorgabe: VorgabeTableDataSource;
  dataSourceZuord: ZuordTableDataSource;
  dataSource: ProdprogTableDataSource;
  private vorgabeChanger = new Subject<boolean>();
  private zuordChanger = new Subject<boolean>();

  @ViewChild('tableVorgabe') tableVorgabe!: MatTable<ProdprogVorgabe>;
  @ViewChild('tableZuord') tableZuord!: MatTable<ProdprogZuordWithEudr>;

  constructor(public dialog: MatDialog,
    private router: Router,
    public dialogRef: MatDialogRef<EditProdprogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.dataSourceVorgabe = new VorgabeTableDataSource();
    this.dataSourceZuord = new ZuordTableDataSource();
    this.dataSource = new ProdprogTableDataSource();
  }

  ngAfterViewInit(): void {
    this.dataSourceVorgabe.vorgabeChanger = this.vorgabeChanger.asObservable();
    this.dataSourceVorgabe.prodid = this.data.prodprog.id;
    this.tableVorgabe.dataSource = this.dataSourceVorgabe;

    this.dataSourceZuord.zuordChanger = this.zuordChanger.asObservable();
    this.dataSourceZuord.prodid = this.data.prodprog.id;
    this.tableZuord.dataSource = this.dataSourceZuord;
  }

  addVorgabe() {
    if (this.data.prodprog.id == 0) {
      alert('Bitte zuerst die Prgrammzuordnung speichern bevor Vorgaben hinzugefügt werden können!');
      return;
    }

    let zellstoff = { id: 0, name: "" };
    let vorgabe = { prdid: this.data.prodprog.id, menge: 0.0, zellstoff: zellstoff, id: 0 };
    const dialogRef = this.dialog.open(EditVorgabeComponent, {
      height: '220px',
      width: '400px',
      maxWidth: '100%',
      data: { caption: "Zellstoff Vorgabe anlegen!", vorgabe: vorgabe },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        // add to database
        this.dataSourceVorgabe.database!.addProdprogVorgabe(vorgabe).subscribe((result) => {
          if (result.status === 'error') {
            alert('Error adding Vorgabe: ' + result.message);
          }
          else {
            this.vorgabeChanger.next(true);
          }
        });
      }
    });
  }

  editVorgabe(row: any) {
    if (this.data.prodprog.id == 0) {
      alert('Bitte zuerst die Prgraommzuordnung speichern bevor Vorgaben hinzugefügt werden können!');
      return;
    }

    let zellstoff = { id: row.zellstoffkat, name: row.zellstoffkatname };
    let vorgabe = { prdid: this.data.prodprog.id, menge: row.menge, zellstoff: zellstoff, id: row.id };
    const dialogRef = this.dialog.open(EditVorgabeComponent, {
      height: '220px',
      width: '400px',
      maxWidth: '100%',
      data: { caption: "Zellstoff Vorgabe bearbeiten!", vorgabe: vorgabe },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        // add to database
        this.dataSourceVorgabe.database!.updateProdprogVorgabe(vorgabe).subscribe((result) => {
          if (result.status === 'error') {
            alert('Error adding vorgabe: ' + result.message);
          }
          else {
            this.vorgabeChanger.next(true);
          }
        });
      }
    });
  }

  deleteVorgabe() {
    const dialogRef = this.dialog.open(DeleteVorgabenComponent, {
      height: '250px',
      width: '300px',
      maxWidth: '100%',
      data: { vorgaben: this.selectionVorg.selected },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        var ids: number[] = [];
        this.selectionVorg.selected.forEach(row => {
          ids.push((row as any).id);
        });
        this.dataSourceVorgabe.database!.deleteProdprogVorgaben(ids).subscribe((result) => {
          if (result.status === 'error') {
            alert('Error updating Lieferung: ' + result.message);
          } else {
            this.selectionVorg.clear();
            this.vorgabeChanger.next(true);
          }
        });
      }
    });
  }

  displayedColumnsVorg: string[] = ['select', 'zellstoffkatname', 'menge', 'add'];
  displayedColumnsZuord: string[] = ['select', 'lsnr', 'referenznr', 'verifnr', 'menge', 'add'];

  /* Selection for Vorgabe Table */
  selectionVorg = new SelectionModel<ProdprogVorgabe>(true, []);

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelectedVorg() {
    const numSelectedVorg = this.selectionVorg.selected.length;
    const numRowsVorg = this.dataSourceVorgabe.data.length;
    return numSelectedVorg === numRowsVorg;
  }
  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRowsVorg() {
    if (this.isAllSelectedVorg()) {
      this.selectionVorg.clear();
      return;
    }

    this.selectionVorg.select(...this.dataSourceVorgabe.data);
  }

  checkIfDisabledVorg(): boolean {
    if (this.selectionVorg.selected.length == 0 || this.data.prodprog.beendet == 1) {
      return true;
    }
    return false;
  }

  /** The label for the checkbox on the passed row */
  checkboxLabelVorg(row?: ProdprogVorgabe): string {
    if (!row) {
      return `${this.isAllSelectedVorg() ? 'deselect' : 'select'} all`;
    }
    return `${this.selectionVorg.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  /* Selection for Zuord Table */
  selectionZuord = new SelectionModel<ProdprogZuordWithEudr>(true, []);

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelectedZuord() {
    const numSelected = this.selectionZuord.selected.length;
    const numRows = this.dataSourceZuord.data.length;
    return numSelected === numRows;
  }
  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRowsZuord() {
    if (this.isAllSelectedZuord()) {
      this.selectionZuord.clear();
      return;
    }

    this.selectionZuord.select(...this.dataSourceZuord.data);
  }

  checkIfDisabled(): boolean {
    if (this.data.prodprog.beendet == 1) {
      return true;
    }
    return false;
  }

  checkIfDisabledZuord(): boolean {
    if (this.selectionZuord.selected.length == 0 || this.data.prodprog.beendet == 1) {
      return true;
    }
    return false;
  }

  /** The label for the checkbox on the passed row */
  checkboxLabelZuord(row?: ProdprogZuordWithEudr): string {
    if (!row) {
      return `${this.isAllSelectedZuord() ? 'deselect' : 'select'} all`;
    }
    return `${this.selectionZuord.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  addZuord() {
    if (this.data.prodprog.id == 0) {
      alert('Bitte zuerst das Produktionsprogramm speichern bevor Zuordnungen hinzugefügt werden können!');
      return;
    }

    let eudrzuord = { eudrid: 0, menge: 0.0, id: 0 };
    const dialogRef = this.dialog.open(EditZuordComponent, {
      height: '220px',
      width: '800px',
      maxWidth: '100%',
      data: { caption: "Zellstoff Zuordnung anlegen!", prdid: this.data.prodprog.id, zuord: eudrzuord },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== null) {
        // add to database
        let zuord = { id: 0, prdid: this.data.prodprog.id, eudrid: result.eudrid, menge: result.menge };
        this.dataSourceZuord.database!.addProdprogZuord(zuord).subscribe((result) => {
          if (result.status === 'error') {
            alert('Error adding Zuordnung: ' + result.message);
          }
          else if (result.status === 'closed') {
            alert(`Die Lieferung ${result.message} wurde geschlossen!`);
            this.zuordChanger.next(true);
          } else {
            this.zuordChanger.next(true);
          }
        });
      }
    });
  }

  editZuord(row: ProdprogZuordWithEudr) {
    if (this.data.prodprog.id == 0) {
      alert('Bitte zuerst das Produktionsprogramm speichern bevor Zuordnungen hinzugefügt werden können!');
      return;
    }

    let eudrzuord = { id: row.eudr, menge: row.menge };
    const dialogRef = this.dialog.open(EditZuordComponent, {
      height: '220px',
      width: '800px',
      maxWidth: '100%',
      data: { caption: "Zellstoff Zuordnung bearbeiten!", prdid: this.data.prodprog.id, zuord: eudrzuord },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== null) {
        // add to database
        let zuord = { id: row.id, prdid: this.data.prodprog.id, eudrid: result.eudrid, menge: result.menge };
        this.dataSourceZuord.database!.updateProdprogZuord(zuord).subscribe((result) => {
          if (result.status === 'error') {
            alert('Error adding Zuordnung: ' + result.message);
          }
          else if (result.status === 'closed') {
            alert(result.message);
            this.zuordChanger.next(true);
          } else {
            this.zuordChanger.next(true);
          }
        });
      }
    });
  }

  deleteZuord() {
    const dialogRef = this.dialog.open(DeleteZuordnungenComponent, {
      height: '250px',
      width: '300px',
      maxWidth: '100%',
      data: { zuordnungen: this.selectionZuord.selected },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        var ids: number[] = [];
        this.selectionZuord.selected.forEach(row => {
          ids.push((row as any).id);
        });
        this.dataSourceZuord.database!.deleteProdprogZuord(ids).subscribe((result) => {
          if (result.status === 'error') {
            alert('Error updating Lieferung: ' + result.message);
          } else {
            this.selectionZuord.clear();
            this.zuordChanger.next(true);
          }
        });
      }
    });
  }

  onFeatureEnabledChange(event: MatCheckboxChange) {
    const checked = event.checked;
    if (!checked) {
      // add ja/nein dialog
      const dialogRef = this.dialog.open(EditGesperrtComponent, {
        height: '250px',
        width: '420px',
        maxWidth: '100%',
        disableClose: true
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result == false) {
          this.data.prodprog.beendet = true;
          event.source.checked = true;
        }
      });
    }
  }

  speichern() {
    if (this.data.prodprog.id != 0) {
      // update
      this.dataSource.database!.updateProdprog(this.data.prodprog).subscribe((result) => {
        if (result.status === 'error') {
          alert('Error updating Produktionsprogramm: ' + result.message);
        } else {
          this.dialogRef.close(true);
        }
      });
    }
    else {
      // add
      this.dataSource.database!.addProdprog(this.data.prodprog).subscribe((result) => {
        if (result.status === 'error') {
          alert('Error updating Produktionsprogramm: ' + result.message);
        } else {
          this.data.prodprog.id = result.id;
        }
      });
    }
  }

  reloadPage() {
    this.dialogRef.close(false)
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/sap-export']);
    });
  }

  exportProdprog() {
    if (this.data.prodprog.id == 0) {
      alert('Bitte zuerst das Produktionsprogramm speichern bevor ein Export durchgeführt werden kann!');
      return;
    }

    const dialogRef = this.dialog.open(ExportSAPComponent, {
      height: '450px',
      width: '600px',
      maxWidth: '100%',
      data: { caption: "Für SAP exportieren!", ids: [this.data.prodprog.id] },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.reloadPage();
      }
    });
  }

  zuordnen() {
    if (this.data.prodprog.id == 0) {
      alert('Bitte zuerst das Produktionsprogramm speichern bevor Zuordnungen durchgeführt werden können!');
      return;
    }

    // check if vorgaben exist and warn if not
    if (this.dataSourceVorgabe.data.length == 0) {
      alert("Es sind keine Vorgaben für dieses Produktionsprogramm definiert.");
      return;
    }

    // check if vorgaben exist and warn if not
    if (this.dataSourceZuord.data.length > 0) {
      alert("Es sind bereits Zuordnungen vorhanden, keine automtische Zuordnung möglich.");
      return;
    }

    this.dataSourceZuord.database!.prodProgZuordForVorgabe(this.data.prodprog.id).subscribe((result) => {
      if (result.status === 'error') {
        alert('Error automatische Zuordnung: ' + result.message);
      }
      else {
        alert('Produktionsprogramm erfolgreich zugeordnet.');
        this.zuordChanger.next(true);
      }
    });
  }
}
