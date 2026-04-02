import {Component, Inject} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import { MatDialogRef, MatDialogContent, MatDialogActions, MAT_DIALOG_DATA, MatDialogTitle } from '@angular/material/dialog';
import { NgFor } from '@angular/common';

@Component({
  selector: 'deletevorgaben-dialog',
  templateUrl: './deletevorgaben.component.html',
  standalone: true,
  imports: [ NgFor, MatDialogContent, MatDialogActions, MatButtonModule],
})

export class DeleteVorgabenComponent {

  constructor(
    public dialogRef: MatDialogRef<DeleteVorgabenComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  yes(): void {
    this.dialogRef.close(true);
  }

  no(): void {
    this.dialogRef.close(false);
  }
}
