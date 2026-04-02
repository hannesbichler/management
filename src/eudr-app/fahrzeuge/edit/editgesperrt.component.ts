import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MatDialogContent, MatDialogActions, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatGridListModule } from '@angular/material/grid-list';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'editgesperrt-dialog',
  templateUrl: './editgesperrt.component.html',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatGridListModule, FormsModule, MatInputModule, MatDialogContent, MatDialogActions, MatButtonModule],
})

export class EditGesperrtComponent {

  constructor(
    public dialogRef: MatDialogRef<EditGesperrtComponent>) {}
}
