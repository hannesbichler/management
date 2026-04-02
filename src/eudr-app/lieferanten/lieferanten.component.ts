import { HttpClient } from '@angular/common/http';
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
import { EditLieferantComponent } from './edit/editlieferant.component';
import { DeleteLieferantenComponent } from './delete/deletelieferanten.component';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Lieferant, LieferantenDatabase } from './lieferanten.database';
import { LieferantenTableDataSource } from './lieferanten.data-source';
import { MatGridList, MatGridTile } from "@angular/material/grid-list";
import { Subject } from 'rxjs';
import { MatTooltipModule } from '@angular/material/tooltip';


@Component({
  selector: 'app-lieferanten',
  standalone: true,
  imports: [
    ReactiveFormsModule,
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
    MatGridTile,
    MatTooltipModule
  ],
  templateUrl: './lieferanten.component.html',
  styleUrls: ['./lieferanten.component.css'],
})

export class LieferantenComponent implements AfterViewInit {
  formGroupName = new FormGroup({ textFilter: new FormControl(''), }, { updateOn: 'change' });
  formGroupUid = new FormGroup({ textFilter: new FormControl(''), }, { updateOn: 'change' });
  formGroupZip = new FormGroup({ textFilter: new FormControl(''), }, { updateOn: 'change' });
  formGroupCountry = new FormGroup({ textFilter: new FormControl(''), }, { updateOn: 'change' });

  private lieferantChanger = new Subject<boolean>();

  private _httpClient = inject(HttpClient);
  private database = new LieferantenDatabase(this._httpClient);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Lieferant>;
  dataSource: LieferantenTableDataSource;

  displayedColumns: string[] = ['select', 'name', 'eori', 'uid', 'address', 'address_add', 'zip', 'city', 'country', 'add'];

  constructor(public dialog: MatDialog) {
    this.dataSource = new LieferantenTableDataSource();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.dataSource.textFilterName = this.formGroupName.controls.textFilter;
    this.dataSource.textFilterUid = this.formGroupUid.controls.textFilter;
    this.dataSource.textFilterZip = this.formGroupZip.controls.textFilter;
    this.dataSource.textFilterCountry = this.formGroupCountry.controls.textFilter;
    this.dataSource.lieferantChanger = this.lieferantChanger.asObservable();
    this.dataSource.database = this.database;
    this.table.dataSource = this.dataSource;
  }

  pageSize = 25;
  disabled = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  clickedRows = new Set<Lieferant>();
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

  selection = new SelectionModel<Lieferant>(true, []);

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
  checkboxLabel(row?: Lieferant): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  addLieferant() {
    let lieferant = { name: "", eori: "", uid: "", address: "", zip: "", city: "", country: "", id: 0 };
    const dialogRef = this.dialog.open(EditLieferantComponent, {
      height: '370px',
      width: '700px',
      maxWidth: '100%',
      data: { caption: "neuen Lieferanten anlegen!", lieferant: lieferant },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.database!.addLieferant(lieferant).subscribe((result) => {
          if (result.status === 'error') {
            alert('Error updating Lieferant: ' + result.message);
          }
          else {
            this.lieferantChanger.next(true);
          }
        });
      }
    });

  }

  editLieferant(row: Lieferant) {
    let lieferant = { name: row.name, eori: row.eori, uid: row.uid, address: row.address, zip: row.zip, city: row.city, country: row.country, id: row.id };
    const dialogRef = this.dialog.open(EditLieferantComponent, {
      height: '370px',
      width: '700px',
      maxWidth: '100%',
      data: { caption: "Lieferanten bearbeiten!", lieferant: lieferant },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.database!.updateLieferant(lieferant).subscribe((result) => {
          if (result.status === 'error') {
            alert('Error updating Lieferant: ' + result.message);
          }
          else {
            this.lieferantChanger.next(true);
          }
        });
      }
    });
  }

  deleteLieferanten() {
    const dialogRef = this.dialog.open(DeleteLieferantenComponent, {
      height: '250px',
      width: '300px',
      maxWidth: '100%',
      data: { lieferanten: this.selection.selected }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        var ids: number[] = [];
        this.selection.selected.forEach(row => {
          ids.push((row as any).id);
        });
        this.database!.deleteLieferanten(ids).subscribe((result) => {
          if (result.status === 'error') {
            alert('Error updating Lieferant: ' + result.message);
          } else {
            this.selection.clear();
            this.lieferantChanger.next(true);
          }
        });
      }
    });
  }
}
