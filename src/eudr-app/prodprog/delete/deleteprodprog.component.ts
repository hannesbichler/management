import {Component, Inject} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import { MatDialogRef, MatDialogContent, MatDialogActions, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgFor } from '@angular/common';

@Component({
  selector: 'deleteprodprog-dialog',
  templateUrl: './deleteprodprog.component.html',
  standalone: true,
  imports: [NgFor, MatDialogContent, MatDialogActions, MatButtonModule],
})

export class DeleteProdprogComponent {

  constructor(
    public dialogRef: MatDialogRef<DeleteProdprogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}
}
