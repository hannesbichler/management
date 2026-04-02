import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator, PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { Subject } from 'rxjs';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatTable, MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EditEudrsComponent } from './edit/editeudrs.component';
import { DeleteEudrsComponent } from './delete/deleteeudrs.component';
import { Eudr } from './eudrs.database';
import { EudrsTableDataSource } from './eudrs.data-source';
import { MatGridTile, MatGridList } from "@angular/material/grid-list";
import { MatInputModule } from '@angular/material/input';
import { ValidateEudrComponent } from './validate/validateeudr.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-eudrs',
  standalone: true,
  imports: [MatTooltipModule, MatFormFieldModule, ReactiveFormsModule,
    MatButtonModule, MatFormFieldModule,
    MatDialogModule, MatButtonModule, MatIconModule, MatCheckboxModule,
    MatProgressSpinnerModule, MatTableModule, MatSortModule,
    MatPaginatorModule, MatGridTile, MatGridList, MatInputModule],
  templateUrl: './eudrs.component.html',
  styleUrls: ['./eudrs.component.css']
})

export class EudrsComponent implements AfterViewInit {
  formGroupBestnr = new FormGroup({ textFilter: new FormControl(''), }, { updateOn: 'change' });
  formGroupProdlotLieferant = new FormGroup({ textFilter: new FormControl(''), }, { updateOn: 'change' });
  formGroupRefnr = new FormGroup({ textFilter: new FormControl(''), }, { updateOn: 'change' });
  formGroupVerifnr = new FormGroup({ textFilter: new FormControl(''), }, { updateOn: 'change' });

  displayedColumns: string[] = ['select', 'lsnr', 'zellstoff', 'prodlotlieferant', 'referenznr', 'verifnr', 'menge', 'status', 'add'];

  pageSize = 25;
  disabled = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  clickedRows = new Set<Eudr>();
  pageSizeOptions = [10, 25, 50];
  hidePageSize = false;
  pageIndex = 0;
  private eudrsChanger = new Subject<boolean>();
  dialogRef: MatDialog | undefined;

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Eudr>;
  dataSource: EudrsTableDataSource;
  pageEvent: PageEvent | undefined;
  formGroupEudrStatus: any;

  constructor(public dialog: MatDialog) {
    this.dataSource = new EudrsTableDataSource();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.dataSource.textFilterBestnr = this.formGroupBestnr.controls.textFilter;
    this.dataSource.textFilterProdlotLieferant = this.formGroupProdlotLieferant.controls.textFilter;
    this.dataSource.textFilterRefnr = this.formGroupRefnr.controls.textFilter;
    this.dataSource.textFilterVerifnr = this.formGroupVerifnr.controls.textFilter;
    this.dataSource.eudrsChanger = this.eudrsChanger;
    this.table.dataSource = this.dataSource;
  }

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }
  }

  selection = new SelectionModel<Eudr>(true, []);

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
  checkboxLabel(row?: Eudr): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  addEudr() {
    let eudr = { lsnr: "", prodlotlieferant: "", verifnr: "", referenznr: "", menge: 0.0, status: "", id: 0 };
    const dialogRef = this.dialog.open(EditEudrsComponent, {
      height: '370px',
      width: '700px',
      maxWidth: '100%',
      data: { caption: "neue EUDR DDS anlegen!", eudr: eudr }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.dataSource?.database!.addEudr(eudr).subscribe((result) => {
          if (result.status === 'error') {
            alert('Error updating Eudrs: ' + result.message);
          }
        });
        this.ngAfterViewInit();
      }
    });
  }

  editEudr(row: Eudr) {
    let eudr = { lsnr: row.lsnr, prodlotlieferant: row.prodlotlieferant, verifnr: row.verifnr, referenznr: row.referenznr, menge: row.menge, status: row.status, id: row.id };
    const dialogRef = this.dialog.open(EditEudrsComponent, {
      height: '370px',
      width: '700px',
      maxWidth: '100%',
      data: { caption: "Eudrs bearbeiten!", eudr: eudr }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.dataSource?.database!.updateEudr(eudr).subscribe((result) => {
          if (result.status === 'error') {
            alert('Error updating Eudrs: ' + result.message);
          }
          else {
            this.ngAfterViewInit();
          }
        });
      }
    });
  }

  deleteEudrs() {
    const dialogRef = this.dialog.open(DeleteEudrsComponent, {
      height: '250px',
      width: '300px',
      maxWidth: '100%',
      data: { eudrs: this.selection.selected }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== null) {
        var ids: number[] = [];
        this.selection.selected.forEach(row => {
          ids.push((row as any).id);
        });
        this.dataSource?.database!.deleteEudrs(ids).subscribe((result) => {
          if (result.status === 'error') {
            alert('Error updating Eudrs: ' + result.message);
          } else {
            this.ngAfterViewInit();
          }
        });
      }
    });
  }

  validateEudrs() {
    var ids: number[] = [];
    this.selection.selected.forEach(row => {
      ids.push((row as any).id);
    });

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

  verificationIcon(status: string): string {
    if (status === "AVAILABLE")
      return "check";
    if (status === "VALID")
      return "check";
    else
      return "close";
  }

  verificationIconClass(status: string): string {
    if (status === "AVAILABLE")
      return "eudrs-state-valid";
    if (status === "VALID")
      return "eudrs-state-valid";
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
}
