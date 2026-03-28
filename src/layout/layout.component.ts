import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {

  expandedGroups: Record<string, boolean> = {
    'Overview': true,
    'Sales': false,
    'Team & Crew': false,
    'Master Setup': false,
    'Operations': false,
    'Analytics': false
  };

  constructor(public router: Router) {
    this.autoExpandActiveGroup();
  }

  toggleGroup(groupLabel: string) {
    this.expandedGroups[groupLabel] = !this.expandedGroups[groupLabel];
  }

  isGroupActive(paths: string[]): boolean {
    return paths.some(p => this.router.url.includes(p));
  }

  autoExpandActiveGroup() {
    const url = this.router.url;
    if (url.includes('/dashboard') || url.includes('/calendar')) this.expandedGroups['Overview'] = true;
    if (url.includes('/admin/bookings') || url.includes('/admin/quotations') || url.includes('/admin/invoices') || url.includes('/admin/payments')) this.expandedGroups['Sales'] = true;
    if (url.includes('/admin/jobs') || url.includes('/admin/team') || url.includes('/admin/freelancers')) this.expandedGroups['Team & Crew'] = true;
    if (url.includes('/admin/party') || url.includes('/admin/services') || url.includes('/admin/packages')) this.expandedGroups['Master Setup'] = true;
    if (url.includes('/admin/equipments') || url.includes('/ledger')) this.expandedGroups['Operations'] = true;
    if (url.includes('/reports')) this.expandedGroups['Analytics'] = true;
  }

  get activeRouteLabel(): string {
    const url = this.router.url;
    if (url.includes('/dashboard')) return 'Dashboard';
    if (url.includes('/calendar')) return 'Calendar';
    if (url.includes('/ledger')) return 'Ledger';
    if (url.includes('/reports')) return 'Reports';
    if (url.includes('/settings')) return 'Settings';

    const segments = url.split('/');
    const entityKey = segments[segments.length - 1] || segments[segments.length - 2] || '';
    
    // Quick mapping for display labels
    const routeLabels: Record<string, string> = {
      'party': 'Parties',
      'services': 'Services',
      'packages': 'Packages',
      'freelancers': 'Freelancers',
      'bookings': 'Bookings',
      'quotations': 'Quotations',
      'invoices': 'Invoices',
      'payments': 'Payments',
      'equipments': 'Equipment',
      'team': 'Team',
      'jobs': 'Job Assignments'
    };

    if (routeLabels[entityKey]) return routeLabels[entityKey];
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
