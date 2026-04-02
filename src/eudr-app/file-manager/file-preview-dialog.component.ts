import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import {SafeUrlPipe} from '../fahrzeuge/import/safe-url.pipe';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environment';

interface FileItem {
  name: string;
  type: string;
}

@Component({
  selector: 'app-file-preview-dialog',
  templateUrl: './file-preview-dialog.component.html',
  styleUrls: ['./file-preview-dialog.component.css'],
  standalone: true,
  imports: [SafeUrlPipe, CommonModule],
})
export class FilePreviewDialogComponent {
  apiBase = environment.apiUrl;
  previewUrl: string | null = null;
  isImage = false;
  isPdf = false;
  isText = false;
  textContent = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { path: string; file: FileItem },
    private http: HttpClient,
    public dialogRef: MatDialogRef<FilePreviewDialogComponent>
  ) {
    this.loadPreview();
  }

  loadPreview() {
    const pathParam = this.data.path ? `path=${encodeURIComponent(this.data.path)}&` : '';
    const url = `${this.apiBase}/api/filemanager/preview?${pathParam}name=${encodeURIComponent(this.data.file.name)}`;

    // Option 1: if backend returns raw blob
    this.http.get(url, { responseType: 'blob' }).subscribe(blob => {
      const type = blob.type || this.data.file.type;

      if (type.startsWith('image/')) {
        this.isImage = true;
        this.previewUrl = URL.createObjectURL(blob);
      } else if (type === 'application/pdf') {
        this.isPdf = true;
        this.previewUrl = URL.createObjectURL(blob);
      } else if (type.startsWith('text/')) {
        this.isText = true;
        const reader = new FileReader();
        reader.onload = () => this.textContent = reader.result as string;
        reader.readAsText(blob);
      }
    });
  }
}
