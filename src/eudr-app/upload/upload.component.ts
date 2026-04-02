import { Component } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { MatDialogContent, MatDialogActions } from "@angular/material/dialog";
import { MatProgressBar } from "@angular/material/progress-bar";
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatGridListModule } from '@angular/material/grid-list';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'],
  standalone: true,
  imports: [MatDialogContent, MatDialogActions, MatProgressBar,
    CommonModule, MatDialogModule, MatGridListModule, FormsModule, MatInputModule, MatDialogContent, MatDialogActions, MatButtonModule
  ]
})
export class UploadComponent {
  file!: File | null;
  isHovering = false;

  progress = -1;

  constructor(private http: HttpClient) {}

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isHovering = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isHovering = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isHovering = false;

    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      this.file = event.dataTransfer.files[0];
    }
  }

  onFileSelected(event: any) {
    this.file = event.target.files[0];
  }

  uploadFile() {
    if (!this.file) return;

    const formData = new FormData();
    formData.append('file', this.file);

    this.http.post('http://your-api-url/upload', formData, {
      reportProgress: true,
      observe: 'events'
    }).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress) {
        this.progress = Math.round((event.loaded / event.total!) * 100);
      }

      if (event.type === HttpEventType.Response) {
        console.log('Upload complete', event.body);
      }
    });
  }
}
