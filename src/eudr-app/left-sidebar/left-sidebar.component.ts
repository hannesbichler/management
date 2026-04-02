import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-left-sidebar',
  standalone: true,
  imports: [RouterModule, CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './left-sidebar.component.html',
  styleUrl: './left-sidebar.component.css',
})
export class LeftSidebarComponent {
  @Input() isLeftSidebarCollapsed: boolean = false;
  @Output() changeIsLeftSidebarCollapsed = new EventEmitter<boolean>();

  constructor(private router: Router) { }

  gotToHome(): void {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([`/`]);
    });
  }

  items = [/*
    {
      routeLink: 'lieferanten',
      icon: 'fal fa-globe',
      label: 'Lieferanten',
    },*/
    {
      routeLink: 'fahrzeuge',
      icon: 'fal fa-truck',
      label: 'Fahrzeuge',
    },
    {
      routeLink: 'prodprog',
      icon: 'fal fa-th-list',
      label: 'Aktivitäten',
    }/*,
    {
      routeLink: 'eudrs',
      icon: 'fal fa-list',
      label: 'DDS Übersicht',
    },
    {
      routeLink: 'lieferung-import',
      icon: 'fal fa-download',
      label: 'Import-Dateien',
    },
    {
      routeLink: 'sap-export',
      icon: 'fal fa-clipboard',
      label: 'Export-Dateien',
    },
    {
      routeLink: 'logs',
      icon: 'fal fa-bars',
      label: 'Log-Dateien',
    },
    {
      routeLink: 'settings',
      icon: 'fal fa-wrench',
      label: 'Einstellungen',
    }*/
  ];

  toggleCollapse(): void {
    this.changeIsLeftSidebarCollapsed.emit(!this.isLeftSidebarCollapsed);
  }

  closeSidenav(): void {
    this.changeIsLeftSidebarCollapsed.emit(true);
  }
}

