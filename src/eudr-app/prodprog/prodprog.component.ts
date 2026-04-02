import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator, PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTable, MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EditProdprogComponent } from './edit/editprodprog.component';
import { DeleteProdprogComponent } from './delete/deleteprodprog.component';
import { DatePipe } from '@angular/common';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { Prodprog } from './prodprog.database';
import { ProdprogTableDataSource } from './prodprog.data-source';
import { Subject } from 'rxjs';
import { MatGridList, MatGridTile } from "@angular/material/grid-list";
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ZuordDatabase } from './edit/zuord.database';
import { ExportSAPComponent } from './export/exportprodprog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-prodprog',
  standalone: true,
  imports: [MatTooltipModule, MatInputModule, ReactiveFormsModule, DatePipe, MatFormFieldModule, MatDialogModule, MatButtonModule, MatIconModule, MatCheckboxModule, MatProgressSpinnerModule, MatTableModule, MatSortModule, MatPaginatorModule, MatGridList, MatGridTile],
  templateUrl: './prodprog.component.html',
  styleUrls: ['./prodprog.component.css'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'de-At' }]
})

export class ProdProgComponent implements AfterViewInit {
  formGroupPrognr = new FormGroup({ textFilter: new FormControl(''), }, { updateOn: 'change' });
  formGroupJahr = new FormGroup({ textFilter: new FormControl(''), }, { updateOn: 'change' });
  Zellstoffsorte = new FormGroup({ textFilter: new FormControl(''), }, { updateOn: 'change' });

  private prodprogChanger = new Subject<boolean>();

  displayedColumns: string[] = ['select', 'prodprog_nr', 'jahr', 'start', 'ende', 'zellstoffkats', 'mengevorg', 'mengezuord', 'beendet', 'add'];

  pageSize = 25;
  disabled = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  clickedRows = new Set<Prodprog>();
  pageSizeOptions = [10, 25, 50];
  hidePageSize = false;
  pageIndex = 0;
  selection = new SelectionModel<Prodprog>(true, []);

  dialogRef: MatDialog | undefined;

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Prodprog>;
  dataSource: ProdprogTableDataSource;
  database: ZuordDatabase | undefined;

  pageEvent: PageEvent | undefined;

  constructor(public dialog: MatDialog, private router: Router,) {
    this.dataSource = new ProdprogTableDataSource();
  }

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    //this.resultsLength = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }
  }

  ngAfterViewInit() {
    this.dataSource.textFilterPrognr = this.formGroupPrognr.controls.textFilter;
    this.dataSource.textFilterJahr = this.formGroupJahr.controls.textFilter;
    this.dataSource.textFilterZellstoff = this.Zellstoffsorte.controls.textFilter;

    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.dataSource.prodprogChanger = this.prodprogChanger;
    this.table.dataSource = this.dataSource;
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
  checkboxLabel(row?: Prodprog): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  addProdprog() {
    let prodzuord = { start: new Date(), ende: new Date(), jahr: new Date().getFullYear(), prog_nr: "", prodprog_nr: "", beendet: false, id: 0 };
    const dialogRef = this.dialog.open(EditProdprogComponent, {
      height: '950px',
      width: '950px',
      maxWidth: '100%',
      data: { caption: "Neues Produktionsprogramm erstellen", prodprog: prodzuord },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      /* if (result == true) {
         this.dataSource.database!.addProdprog(prodzuord).subscribe((result) => {
           if (result.status === 'error') {
             alert('Error updating Produktionsprogramm: ' + result.message);
           }
         });
       }*/
      this.prodprogChanger.next(true);
    });
  }

  editProdprog(row: Prodprog) {
    let prodprog = { id: row.id, start: row.start, ende: row.ende, jahr: row.jahr, prog_nr: row.prog_nr, prodprog_nr: row.prodprog_nr, beendet: row.beendet };
    const dialogRef = this.dialog.open(EditProdprogComponent, {
      height: '950px',
      width: '950px',
      maxWidth: '100%',
      data: { caption: "Produktionsprogramm bearbeiten", prodprog: prodprog },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      /*if (result == true) {
        this.dataSource.database!.updateProdprog(prodprog).subscribe((result) => {
          if (result.status === 'error') {
            alert('Error updating Produktionsprogramm: ' + result.message);
          }
        });
      }*/
      this.prodprogChanger.next(true);
    });
  }

  deleteProdprog() {
    const dialogRef = this.dialog.open(DeleteProdprogComponent, {
      height: '250px',
      width: '300px',
      maxWidth: '100%',
      data: { prodprog: this.selection.selected },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        var ids: number[] = [];
        this.selection.selected.forEach(row => {
          ids.push((row as any).id);
        });
        this.dataSource.database!.deleteProdprog(ids).subscribe((result) => {
          if (result.status === 'error') {
            alert('Error deleting Produktionsprogramm: ' + result.message);
          } else {
            this.selection.clear();
            this.prodprogChanger.next(true);
          }
        });
      }
    });
  }

  reloadPage() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/sap-export']);
    });
  }

  exportProdprogs() {
    var ids: number[] = [];
    this.selection.selected.forEach(row => {
      ids.push((row as any).id);
    });

    const dialogRef = this.dialog.open(ExportSAPComponent, {
      height: '450px',
      width: '600px',
      maxWidth: '100%',
      data: { caption: "Für SAP exportieren!", ids: ids },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.reloadPage();
      }
    });
  }

  isBeendet(beendet: number): string {
    if (beendet == 1)
      return "true";
    return "false";
  }
}
