import { Component, inject, Inject } from '@angular/core';
import { MatFormField, MatFormFieldModule, MatLabel } from "@angular/material/form-field";
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MatDialogContent, MatDialogActions, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSelect, MatOption } from "@angular/material/select";
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ZuordDatabase } from './zuord.database';
import { EudrApi } from '../../eudrs/eudrs.database';
import { Observable } from 'rxjs';

@Component({
  selector: 'editzuord-dialog',
  templateUrl: './editzuord.component.html',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatGridListModule, MatFormFieldModule, FormsModule, MatInputModule, MatDialogContent, MatDialogActions, MatButtonModule, MatFormField, MatLabel, MatSelect, MatOption],
})

export class EditZuordComponent {
  private zuordvorgdb = new ZuordDatabase(inject(HttpClient));
  zuordVorgaben$: EudrApi | undefined;
  form = new FormGroup({
    amount: new FormControl(null, [
      Validators.required,
      Validators.max(0)
    ])
  });

  actValue: number = 0;
  maxValue: number = 0;

  constructor(
    public dialogRef: MatDialogRef<EditZuordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngAfterContentInit(): void {
    this.zuordvorgdb.getProdProgZuordForVorgabe(this.data.prdid)
      .subscribe(data => {
        this.updateMaxValue(this.data.zuord.menge, this.data.zuord.menge);
        this.zuordVorgaben$ = data;
        if (data.items !== undefined) {
          const zuord = data.items.find(z => z.id === this.data.zuord.id);
          if (zuord !== undefined) {
            this.updateMaxValue(this.data.zuord.menge, zuord.menge + this.data.zuord.menge);
          }
        }
      });
  }

  compareFnEudrs(f1: any, f2: any): boolean {
    if (f1 && f2) {
      if (f1.id === f2.id) {
        f1.menge += f2.menge;
        return true;
      }
    }
    return f1 === f2;
    //          return f1 && f2 ? f1.id === f2.id : f1 === f2;
  }

  updateMaxValue(menge: number, limit: number): void {
    this.actValue = menge;
    this.maxValue = limit;
    this.form.get('amount')?.setValidators([Validators.max(this.maxValue)]);
    this.form.get('amount')?.updateValueAndValidity();
  }

  closeDialog(val: any) {
    if (val) {
      if (this.actValue > 0) {
        let zuord = { eudrid: this.data.zuord.id, menge: this.actValue };
        this.dialogRef.close(zuord);
      }
    } else {
      this.dialogRef.close(null);
    }
  }
}
