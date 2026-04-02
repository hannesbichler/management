import { Component, ViewChild, AfterViewInit, inject } from '@angular/core';
import { MatPaginator, PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTable, MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EditLieferungComponent } from './edit/editlieferung.component';
import { DeleteLieferungenComponent } from './delete/deletelieferungen.component';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DatePipe, DecimalPipe } from '@angular/common';
import { Lieferung } from './lieferungen.database';
import { LieferungenTableDataSource } from './lieferungen.data-source';
import { MatGridList, MatGridTile } from "@angular/material/grid-list";
import { Subject } from 'rxjs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { ImportLieferungenComponent } from './import/importlieferungen.component';

@Component({
  selector: 'app-lieferungen',
  standalone: true,
  imports: [
    MatTooltipModule,
    ReactiveFormsModule,
    DatePipe,
    DecimalPipe,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatGridList,
    MatGridTile
  ],
  templateUrl: './lieferungen.component.html',
  styleUrls: ['./lieferungen.component.css'],
})

export class LieferungenComponent implements AfterViewInit {
  formGroupLsnr = new FormGroup({ textFilter: new FormControl(''), }, { updateOn: 'change' });
  formGroupLieferant = new FormGroup({ textFilter: new FormControl(''), }, { updateOn: 'change' });
  formGroupZellstoffkat = new FormGroup({ textFilter: new FormControl(''), }, { updateOn: 'change' });
  formGroupEudrStatus = new FormGroup({ checkedFilter: new FormControl(false), }, { updateOn: 'change' });
  formGroupEmptyOrder = new FormGroup({ checkedFilter: new FormControl(false), }, { updateOn: 'change' });
  formGroupEmptyZellstoff = new FormGroup({ checkedFilter: new FormControl(false), }, { updateOn: 'change' });

  private lieferungChanger = new Subject<boolean>();
  private fragment: string | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Lieferung>;
  dataSource: LieferungenTableDataSource;

  constructor(public dialog: MatDialog, route: ActivatedRoute, private router: Router) {
    this.dataSource = new LieferungenTableDataSource();
    this.fragment = route.snapshot.fragment || null;
  }

  displayedColumns: string[] = ['select', 'lsnr', 'lsnrlieferant', 'lieferantname', 'lieferdate', 'prodname', 'zellstoffkat', 'menge', 'valide', 'gesperrt', 'add'];

  ngOnInit() {
    if (this.fragment?.includes('emptyOrder'))
      this.formGroupEmptyOrder.get('checkedFilter')!.setValue(true);

    if (this.fragment?.includes('emptyZellstoff'))
      this.formGroupEmptyZellstoff.get('checkedFilter')!.setValue(true);
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

    this.dataSource.textFilterLsnr = this.formGroupLsnr.controls.textFilter;
    this.dataSource.textFilterLieferant = this.formGroupLieferant.controls.textFilter;
    this.dataSource.textFilterZellstoffkat = this.formGroupZellstoffkat.controls.textFilter;
    this.dataSource.checkedEudrStatus = this.formGroupEudrStatus.controls.checkedFilter;

    this.dataSource.checkedEmptyOrder = this.formGroupEmptyOrder.controls.checkedFilter;
    this.dataSource.checkedEmptyZellstoff = this.formGroupEmptyZellstoff.controls.checkedFilter;
    this.dataSource.lieferungChanger = this.lieferungChanger.asObservable();
    this.table.dataSource = this.dataSource;
  }

  pageSize = 25;
  disabled = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  clickedRows = new Set<Lieferung>();
  pageSizeOptions = [10, 25, 50];
  hidePageSize = false;
  pageIndex = 0;

  dialogRef: MatDialog | undefined;

  pageEvent: PageEvent | undefined;

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

  selection = new SelectionModel<Lieferung>(true, []);

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
  checkboxLabel(row?: Lieferung): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  addLieferung() {
    let lieferant = { id: 0, name: "" };
    let zellstoff = { id: 0, name: "" };
    let lieferung = { lsnr: "", lsnrlieferant: "", lieferant: lieferant, lieferdate: new Date(), prodname: "", zellstoff: zellstoff, valide: false, gesperrt: false, id: -1, menge: 0 };
    const dialogRef = this.dialog.open(EditLieferungComponent, {
      height: '950px',
      width: '950px',
      maxWidth: '100%',
      data: { caption: "neue Lieferung anlegen!", lieferung: lieferung },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        let offset = new Date().getTimezoneOffset() / 60;
        lieferung.lieferdate.setHours(lieferung.lieferdate.getHours() - offset);
        this.dataSource.database!.addLieferung(lieferung).subscribe((result) => {
          if (result.status === 'error') {
            alert('Error updating Lieferung: ' + result.message);
          }
          else {
            this.lieferungChanger.next(true);
          }
        });
      }
    });
  }

  editLieferung(row: any) {
    let lieferant = { id: row.lieferant, name: row.lieferantname };
    let zellstoff = { id: row.zellstoff, name: row.zellstoffkat };
    let lieferung = { lsnr: row.lsnr, lsnrlieferant: row.lsnrlieferant, lieferant: lieferant, lieferdate: row.lieferdate, prodname: row.prodname, zellstoff: zellstoff, gesperrt: row.gesperrt, valide: row.valide, id: row.id, menge: row.menge };
    const dialogRef = this.dialog.open(EditLieferungComponent, {
      height: '950px',
      width: '950px',
      maxWidth: '100%',
      data: { caption: "Lieferung bearbeiten!", lieferung: lieferung },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        if (lieferung.lieferdate instanceof Date) {
          let offset = new Date().getTimezoneOffset() / 60;
          lieferung.lieferdate.setHours(lieferung.lieferdate.getHours() - offset);
        }
        this.dataSource.database!.updateLieferung(lieferung).subscribe((result) => {
          if (result.status === 'error') {
            alert('Error updating Lieferung: ' + result.message);
          }
          else {
            this.lieferungChanger.next(true);
          }
        });
      }
    });
  }

  deleteLieferungen() {
    const dialogRef = this.dialog.open(DeleteLieferungenComponent, {
      height: '250px',
      width: '350px',
      maxWidth: '100%',
      data: { lieferungen: this.selection.selected },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        var ids: number[] = [];
        this.selection.selected.forEach(row => {
          ids.push((row as any).id);
        });
        this.dataSource.database!.deleteLieferungen(ids).subscribe((result) => {
          if (result.status === 'error') {
            alert('Error updating Lieferung: ' + result.message);
          } else {
            this.selection.clear();
            this.lieferungChanger.next(true);
          }
        });
      }
    });
  }

  reloadPage() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/lieferungen'],{fragment: "emptyZellstoff"});
    });
  }

  importLieferungen() {
    const dialogRef = this.dialog.open(ImportLieferungenComponent, {
          height: '450px',
          width: '600px',
          maxWidth: '100%',
          data: { caption: "Lieferungen importieren!", vorgabe: "" },
          disableClose: true
        });
    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.reloadPage();
      }
    });
  }


  verificationIcon(valide: number): string {
    if (valide === 1)
      return "check";
    else
      return "close";
  }

  verificationIconClass(valide: number): string {
    if (valide === 1)
      return "eudrs-state-valid";
    else
      return "eudrs-state-invalid";
  }

  verificationTooltip(valide: number): string {
    if (valide === 1)
      return "Alle Eudr Einträge valide!";
    else
      return "Eudr Status nicht valide oder ausständig!";
  }

  isVerbucht(gesperrt: number): string {
    if(gesperrt == 1)
      return "true";
    return "false";
  }
}

