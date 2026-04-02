import {Component, inject, Inject} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import { MatDialogRef, MatDialogContent, MatDialogActions, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgFor } from '@angular/common';
import { LieferungenDatabase } from '../../fahrzeuge/lieferungen.database';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'deletelieferanten-dialog',
  templateUrl: './deletelieferanten.component.html',
  standalone: true,
  imports: [NgFor, MatDialogContent, MatDialogActions, MatButtonModule],
})

export class DeleteLieferantenComponent {
  private lieferungendb = new LieferungenDatabase(inject(HttpClient));
  errors: string[] = [];

  constructor(
    public dialogRef: MatDialogRef<DeleteLieferantenComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngAfterContentInit(): void {
    var ids: number[] = [];
        for(var lief of this.data.lieferanten) {
          ids.push(lief.id);
        };
    this.lieferungendb.getLieferungenForLieferanten(ids)
    .subscribe(data => {
      for(var lief of data.items) {
        this.errors.push(lief.name + " kann nicht gelöscht werden, da einer Lieferung zugeordnet!");
      }
      /*
        this.zuordVorgaben$ = data;
        const zuord = data.items.find(z => z.id === this.data.zuord.id);
        if (zuord !== undefined) {
          this.updateMaxValue(this.data.zuord.menge, zuord.menge + this.data.zuord.menge);
        }*/
      });
  }

    checkIfDisabled(): boolean {
      return this.errors.length > 0;
  }
}
