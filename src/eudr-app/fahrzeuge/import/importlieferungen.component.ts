import { Component, inject, Inject } from '@angular/core';
import { MatFormField, MatFormFieldModule, MatLabel } from "@angular/material/form-field";
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MatDialogContent, MatDialogActions, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSelect, MatOption } from "@angular/material/select";
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { LieferungenDatabase } from '../lieferungen.database';

@Component({
  selector: 'importlieferungen-dialog',
  templateUrl: './importlieferungen.component.html',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatGridListModule, MatFormFieldModule, FormsModule, MatInputModule, MatDialogContent, MatDialogActions, MatButtonModule, MatFormField, MatLabel],
})

export class ImportLieferungenComponent {
  private db = new LieferungenDatabase(inject(HttpClient));
  private disabledImport = false;
  private disabledFertig = true;
  message = '';

  constructor(
    public dialogRef: MatDialogRef<ImportLieferungenComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  importLieferungen() {
   this.db!.importLieferungen().subscribe((result) => {
      if (result.status === 'error') {
        alert('Error importing Lieferungen: ' + result.message);
      } else {
        this.message = result.message;
        if(result.status === 'success') {
          this.disabledImport = true;
          this.disabledFertig = false;
        }
        else {
          this.disabledImport = true;
        }
      }
    });
  }

  checkIfDisabledImport(): boolean {
    return this.disabledImport;
  }

  checkIfDisabledFertig(): boolean {
    return this.disabledFertig;
  }
}
