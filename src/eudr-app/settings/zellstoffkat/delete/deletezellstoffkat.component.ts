import {Component, Inject} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import { MatDialogRef, MatDialogContent, MatDialogActions, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgFor } from '@angular/common';

@Component({
  selector: 'deletezellstoffkat-dialog',
  templateUrl: './deletezellstoffkat.component.html',
  standalone: true,
  imports: [NgFor, MatDialogContent, MatDialogActions, MatButtonModule],
})

export class DeleteZellstoffkategorienComponent {

  constructor(
    public dialogRef: MatDialogRef<DeleteZellstoffkategorienComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}
}
