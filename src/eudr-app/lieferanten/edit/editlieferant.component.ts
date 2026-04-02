import { ChangeDetectionStrategy, Component, Inject, inject } from '@angular/core';
import { MatFormField, MatFormFieldModule, MatLabel } from "@angular/material/form-field";
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MatDialogContent, MatDialogActions, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatGridListModule } from '@angular/material/grid-list';

@Component({
  selector: 'editlieferant-dialog',
  templateUrl: './editlieferant.component.html',
  standalone: true,
  imports: [MatDialogModule, MatGridListModule, MatFormFieldModule, FormsModule, MatInputModule, MatDialogContent, MatDialogActions, MatButtonModule, MatFormField, MatLabel]
})

export class EditLieferantComponent {

  constructor(
    public dialogRef: MatDialogRef<EditLieferantComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }
}
