import { FileManagerComponent } from "../file-manager/file-manager.component";
import { Component } from '@angular/core';

@Component({
  selector: 'sap-export',
  standalone: true,
  templateUrl: './sap-export.component.html',
  styleUrls: ['./sap-export.component.css'],
  imports: [FileManagerComponent],
})
export class SAPExportComponent {
}
