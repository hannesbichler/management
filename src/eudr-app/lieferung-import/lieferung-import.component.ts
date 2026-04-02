import { FileManagerComponent } from "../file-manager/file-manager.component";
import { Component } from '@angular/core';
import { MatTabGroup, MatTab } from "@angular/material/tabs";

@Component({
  selector: 'lieferung-import',
  standalone: true,
  templateUrl: './lieferung-import.component.html',
  styleUrls: ['./lieferung-import.component.css'],
  imports: [FileManagerComponent, MatTabGroup, MatTab],
})
export class LieferungImportComponent {
}
