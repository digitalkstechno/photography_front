import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ENTITIES } from '../core/entity/entities';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {

  constructor(public router: Router) {}

  get entityConfigs() {
    return Object.values(ENTITIES);
  }

  get entities() {
    return this.entityConfigs.filter(e => e.sidebar !== false);
  }

  get activeRouteLabel(): string {
    const url = this.router.url;
    if (url.includes('/dashboard')) return 'Dashboard';
    if (url.includes('/calendar')) return 'Calendar';
    if (url.includes('/ledger')) return 'Ledger';
    if (url.includes('/reports')) return 'Reports';
    if (url.includes('/settings')) return 'Settings';

    // Check for entity route
    const segments = url.split('/');
    const entityKey = segments[segments.length - 1] || segments[segments.length - 2] || '';
    const entity = this.entityConfigs.find(e => e.key === entityKey);
    if (entity) return entity.label;

    return 'Overview';
  }

  navigate(path: string) {
    this.router.navigate([path]);
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
