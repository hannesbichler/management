import { Component, inject, Inject } from '@angular/core';
import { MatFormField, MatFormFieldModule, MatLabel } from "@angular/material/form-field";
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MatDialogContent, MatDialogActions, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatGridListModule } from '@angular/material/grid-list';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ExportToSAPDatabase } from './exportprodprog.database';

@Component({
  selector: 'exportprodprog-dialog',
  templateUrl: './exportprodprog.component.html',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatGridListModule, MatFormFieldModule, FormsModule, MatInputModule, MatDialogContent, MatDialogActions, MatButtonModule, MatFormField, MatLabel],
})

export class ExportSAPComponent {
  private db = new ExportToSAPDatabase(inject(HttpClient));
  private disabledImport = false;
  private disabledFertig = true;
  message = '';

  constructor(
    public dialogRef: MatDialogRef<ExportSAPComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  exportToSAP() {
   this.db!.exportProdprogForSAP(this.data.ids).subscribe((result) => {
      this.message = result.message;
      this.disabledFertig = false;
      this.disabledImport = true;
    });
  }

  checkIfDisabledImport(): boolean {
    return this.disabledImport;
  }

  checkIfDisabledFertig(): boolean {
    return this.disabledFertig;
  }
}
