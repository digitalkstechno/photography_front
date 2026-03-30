import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HotkeyAction, HotkeyService } from '../core/services/hotkey.service';
import { ShortcutsModalComponent } from '../shared/shortcuts-modal/shortcuts-modal.component';
import { AuthService } from '../core/auth/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule, ShortcutsModalComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent implements OnInit {

  expandedGroups: Record<string, boolean> = {
    'Dashboard': true,
    'Parties': false,
    'Sales': false,
    'Bookings & Jobs': false,
    'Team': false,
    'Finance': false,
    'Billing & POS': false,
    'Inventory': false
  };
  
  showProfileDropdown = false;
  showShortcuts = false;

  constructor(
    public router: Router, 
    private eRef: ElementRef,
    private hotkeyService: HotkeyService,
    public authService: AuthService
  ) {
    this.autoExpandActiveGroup();
  }

  ngOnInit() {
    this.hotkeyService.hotkeys.subscribe(action => {
      if (action === HotkeyAction.TOGGLE_SHORTCUTS) {
        this.showShortcuts = !this.showShortcuts;
      }
    });

    // Default expand based on role
    const role = this.authService.getUserRole().toLowerCase();
    if (role === 'freelancer') {
      this.expandedGroups['Dashboard'] = true;
    }
  }

  isGroupVisible(groupName: string): boolean {
    const role = this.authService.getUserRole().toLowerCase();
    
    // ADMIN has full access
    if (role === 'admin') return true;

    // STAFF access (Operations focused)
    if (role === 'staff') {
      const allowed = ['Dashboard', 'Parties', 'Bookings & Jobs', 'Team', 'Inventory'];
      return allowed.includes(groupName);
    }

    // FREELANCER access (Task focused)
    if (role === 'freelancer') {
      const allowed = ['Dashboard', 'Bookings & Jobs', 'Finance']; // Finance for Payouts
      return allowed.includes(groupName);
    }

    return true; // Default fallback
  }

  toggleProfileDropdown(event: Event) {
    event.stopPropagation();
    this.showProfileDropdown = !this.showProfileDropdown;
  }

  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    // Specifically check if click was outside the profile wrapper
    const profileWrapper = this.eRef.nativeElement.querySelector('.user-profile-wrapper');
    if (profileWrapper && !profileWrapper.contains(event.target)) {
      this.showProfileDropdown = false;
    }
  }

  toggleGroup(groupLabel: string) {
    this.expandedGroups[groupLabel] = !this.expandedGroups[groupLabel];
  }

  isGroupActive(paths: string[]): boolean {
    return paths.some(p => this.router.url.includes(p));
  }

  autoExpandActiveGroup() {
    const url = this.router.url;
    // Set all to false first
    Object.keys(this.expandedGroups).forEach(k => this.expandedGroups[k] = false);

    if (url.includes('/dashboard')) this.expandedGroups['Dashboard'] = true;
    if (url.includes('/party')) this.expandedGroups['Parties'] = true;
    if (url.includes('/quotations') || url.includes('/invoices') || url.includes('/payments')) this.expandedGroups['Sales'] = true;
    if (url.includes('/bookings') || url.includes('/jobs')) this.expandedGroups['Bookings & Jobs'] = true;
    if (url.includes('/team') || url.includes('/freelancers')) this.expandedGroups['Team'] = true;
    if (url.includes('/accounts') || url.includes('/transactions') || url.includes('/expenses') || url.includes('/ledger')) this.expandedGroups['Finance'] = true;
    if (url.includes('/pos') || url.includes('/online-payments')) this.expandedGroups['Billing & POS'] = true;
    if (url.includes('/equipments')) this.expandedGroups['Inventory'] = true;
    
    // Auto-expand overview for reports
    if (url.includes('/reports')) this.expandedGroups['Dashboard'] = true;
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
      'jobs': 'Job Assignments',
      'accounts': 'Cash & Bank',
      'transactions': 'Transactions',
      'expenses': 'Expenses'
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
