import {Component, Inject} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import { MatDialogRef, MatDialogContent, MatDialogActions, MAT_DIALOG_DATA, MatDialogTitle } from '@angular/material/dialog';
import { NgFor } from '@angular/common';

@Component({
  selector: 'deletezuord-dialog',
  templateUrl: './deletezuord.component.html',
  standalone: true,
  imports: [ NgFor, MatDialogContent, MatDialogActions, MatButtonModule],
})

export class DeleteZuordnungenComponent {

  constructor(
    public dialogRef: MatDialogRef<DeleteZuordnungenComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  yes(): void {
    this.dialogRef.close(true);
  }

  no(): void {
    this.dialogRef.close(false);
  }
}
