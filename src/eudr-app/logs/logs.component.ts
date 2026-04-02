import { FileManagerComponent } from "../file-manager/file-manager.component";
import { Component } from '@angular/core';

@Component({
  selector: 'app-logs',
  standalone: true,
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.css'],
  imports: [FileManagerComponent],
})
export class LogsComponent {
}
