import { Component, inject, Inject } from '@angular/core';
import { MatFormField, MatFormFieldModule, MatLabel } from "@angular/material/form-field";
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MatDialogContent, MatDialogActions, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSelect, MatOption } from "@angular/material/select";
import { CommonModule } from '@angular/common';
import { ZellstoffDatabase } from '../../settings/zellstoff.database';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'editvorgabe-dialog',
  templateUrl: './editvorgabe.component.html',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatGridListModule, MatFormFieldModule, FormsModule, MatInputModule, MatDialogContent, MatDialogActions, MatButtonModule, MatFormField, MatLabel, MatSelect, MatOption],
})

export class EditVorgabeComponent {
  private zelldb = new ZellstoffDatabase(inject(HttpClient));
    kategorien$ = this.zelldb.getZellstoffkategorien();

  constructor(
    public dialogRef: MatDialogRef<EditVorgabeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  compareFnZellstoff(f1: any, f2: any): boolean {
    return f1 && f2 ? f1.id === f2.id : f1 === f2;
  }
}
