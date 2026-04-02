import { Component, input, Input, OnInit } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { environment } from '../../../environment';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from "@angular/material/icon";
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { DecimalPipe, CommonModule } from '@angular/common';
import { FilePreviewDialogComponent } from './file-preview-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NeonGlassContextMenuModule } from '../utils/neon-glass-context-menu.module';

interface Folder {
  name: string;
}

interface FileItem {
  name: string;
  size: number;
  type: string;
  lastModified: string;
}

interface UploadItem {
  file: File;
  progress: number;
}

@Component({
  selector: 'file-manager',
  templateUrl: './file-manager.component.html',
  styleUrls: ['./file-manager.component.css'],
  standalone: true,
  imports: [NeonGlassContextMenuModule, MatListModule, MatIconModule, MatProgressBarModule, MatToolbarModule, DecimalPipe, CommonModule, MatButtonModule, MatTabsModule, MatTooltipModule],
})

export class FileManagerComponent implements OnInit {
  @Input() folder: string = '';
  @Input() showUpload: boolean = true;

  apiBase = environment.apiUrl;

  currentPathSegments: string[] = []; // e.g. ['folder1', 'sub']
  folders: Folder[] = [];
  files: FileItem[] = [];

  isHovering = false;
  uploads: UploadItem[] = []; // track progress per file

  constructor(
    private http: HttpClient,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.loadItems();
  }

  //get currentPath(): string {
  //  return this.currentPathSegments.join('/');
  //}

  loadItems() {
    const pathParam = this.folder ? `?path=${encodeURIComponent(this.folder)}` : '';
    this.http
      .get<{ folders: Folder[]; files: FileItem[] }>(`${this.apiBase}/api/filemanager/files${pathParam}`)
      .subscribe(res => {
        this.folders = res.folders;
        this.files = [...res.files];
      });
  }

  // Breadcrumb navigation
  navigateTo(index: number | null) {
    if (index === null) {
      this.currentPathSegments = [];
    } else {
      this.currentPathSegments = this.currentPathSegments.slice(0, index + 1);
    }
    this.loadItems();
  }

  openFolder(folder: Folder) {
    this.currentPathSegments.push(folder.name);
    this.loadItems();
  }

  // Drag & drop handlers
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
      const files = Array.from(event.dataTransfer.files);
      this.uploadFiles(files);
      event.dataTransfer.clearData();
    }
  }

  // File input selection
  onFileInputChange(event: any) {
    const files: File[] = Array.from(event.target.files);
    this.uploadFiles(files);
    event.target.value = null;
  }

  uploadFiles(files: File[]) {
    files.forEach(file => {
      const uploadItem: UploadItem = { file, progress: 0 };
      this.uploads.push(uploadItem);

      const formData = new FormData();
      formData.append('files', file);

      const pathParam = this.folder ? `?path=${encodeURIComponent(this.folder)}` : '';

      this.http.post(`${this.apiBase}/api/filemanager/upload${pathParam}`, formData, {
        reportProgress: true,
        observe: 'events'
      }).subscribe(event => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          uploadItem.progress = Math.round((event.loaded / event.total) * 100);
        }
        if (event.type === HttpEventType.Response) {
          uploadItem.progress = 100;
          this.loadItems();
          // optionally remove from uploads list after a delay
          setTimeout(() => {
            this.uploads = this.uploads.filter(u => u !== uploadItem);
          }, 1000);
        }
      }, () => {
        uploadItem.progress = 0;
      });
    });
  }

  download(file: FileItem) {
    const pathParam = this.folder ? `path=${encodeURIComponent(this.folder)}&` : '';
    const url = `${this.apiBase}/api/filemanager/download?${pathParam}name=${encodeURIComponent(file.name)}`;
    window.open(url, '_blank');
  }

  delete(file: FileItem) {
    const pathParam = this.folder ? `path=${encodeURIComponent(this.folder)}&` : '';
    this.http
      .delete(`${this.apiBase}/api/filemanager/delete?${pathParam}name=${encodeURIComponent(file.name)}`)
      .subscribe(() => this.loadItems());
  }

  preview(file: FileItem) {
    this.dialog.open(FilePreviewDialogComponent, {
      width: '80vw',
      height: '80vh',
      data: {
        path: this.folder,
        file
      }
    });
  }

  // context menu handlers
  // ...existing code...
  contextMenuVisible = false;
  contextMenuX = 0;
  contextMenuY = 0;
  contextMenuItems = [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' }
  ];

  onRightClick(event: MouseEvent) {
    event.preventDefault();
    this.contextMenuX = event.clientX;
    this.contextMenuY = event.clientY;
    this.contextMenuVisible = true;
  }

  onMenuItemClick(item: any) {
    this.contextMenuVisible = false;
    // Handle menu item action here
    alert('Selected: ' + item.label);
  }

  onMenuClose() {
    this.contextMenuVisible = false;
  }
}
