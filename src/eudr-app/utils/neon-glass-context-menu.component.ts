import { Component, ElementRef, HostListener, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-neon-glass-context-menu',
  templateUrl: './neon-glass-context-menu.component.html',
  styleUrls: ['./neon-glass-context-menu.component.css']
})
export class NeonGlassContextMenuComponent {
  @Input() menuItems: { label: string, value: any }[] = [];
  @Input() visible = false;
  @Input() x = 0;
  @Input() y = 0;
  @Output() menuItemClick = new EventEmitter<any>();
  @Output() menuClose = new EventEmitter<void>();

  constructor(private el: ElementRef) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.el.nativeElement.contains(event.target)) {
      this.menuClose.emit();
    }
  }

  onMenuItemClick(item: any) {
    this.menuItemClick.emit(item);
    this.menuClose.emit();
  }
}
