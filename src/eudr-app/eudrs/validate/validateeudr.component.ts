import { Component, inject, Inject } from '@angular/core';
import { MatFormField, MatFormFieldModule, MatLabel } from "@angular/material/form-field";
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MatDialogContent, MatDialogActions, MAT_DIALOG_DATA, MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSelect, MatOption } from "@angular/material/select";
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { EudrDatabase } from '../eudrs.database';

@Component({
  selector: 'validateeudr-dialog',
  templateUrl: './validateeudr.component.html',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatGridListModule, MatFormFieldModule, FormsModule, MatInputModule, MatDialogContent, MatDialogActions, MatButtonModule, MatFormField, MatLabel, MatSelect, MatOption],
})

export class ValidateEudrComponent {
  private database = new EudrDatabase(inject(HttpClient));
  private disabledImport = false;
  private disabledFertig = false;
  message = '';

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ValidateEudrComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  validateEudr() {
    this.database!.validateEudrs(this.data.ids).subscribe((result) => {
      this.message = result.message;
    });
  }

  checkIfDisabledImport(): boolean {
    return this.disabledImport;
  }

  checkIfDisabledFertig(): boolean {
    return this.disabledFertig;
  }
}
