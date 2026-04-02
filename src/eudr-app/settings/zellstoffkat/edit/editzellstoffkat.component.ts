import { Component, Inject } from '@angular/core';
import { MatFormField, MatFormFieldModule, MatLabel } from "@angular/material/form-field";
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MatDialogContent, MatDialogActions, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSelect, MatOption } from "@angular/material/select";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'editzellstoffkat-dialog',
  templateUrl: './editzellstoffkat.component.html',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatGridListModule, MatFormFieldModule, FormsModule, MatInputModule, MatDialogContent, MatDialogActions, MatButtonModule, MatFormField, MatLabel, MatSelect, MatOption],
})

export class EditZellstoffkategorieComponent {

  constructor(
    public dialogRef: MatDialogRef<EditZellstoffkategorieComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  caption(): string {
    if(this.data.edit) {
      return 'Zellstoffkategorie bearbeiten';
    }
    return 'Neue Zellstoffkategorie anlegen';
  }
}
