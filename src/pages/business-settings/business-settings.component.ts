import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AccountSettingsComponent } from './account/account-settings.component';
import { CompanySettingsComponent } from './company/company-settings.component';
import { InvoiceSettingsComponent } from './invoices/invoice-settings.component';
import { UserManagementComponent } from './users/user-management.component';

@Component({
  selector: 'app-business-settings',
  standalone: true,
  imports: [
    CommonModule, 
    AccountSettingsComponent, 
    CompanySettingsComponent,
    InvoiceSettingsComponent,
    UserManagementComponent
  ],
  template: `
    <div class="settings-container animate-fade-in">
      <!-- SECONDARY SIDEBAR -->
      <aside class="settings-sidebar shadow-premium">
        <div class="business-brief">
          <div class="brief-avatar">📸</div>
          <div class="brief-info">
            <span class="business-name">Studio Pro</span>
            <span class="business-id">Admin Command</span>
          </div>
        </div>

        <button class="back-btn" (click)="goBack()">← Back to Dashboard</button>

        <nav class="settings-nav">
          <div class="nav-item" (click)="setTab('account')" [class.active]="currentTab === 'account'">
            <span class="icon">👤</span> Account
          </div>
          <div class="nav-item" (click)="setTab('business')" [class.active]="currentTab === 'business'">
            <span class="icon">💼</span> Manage Business
          </div>
          <div class="nav-item" (click)="setTab('invoices')" [class.active]="currentTab === 'invoices'">
            <span class="icon">📄</span> Invoice Settings
          </div>
          <div class="nav-item" (click)="setTab('print')" [class.active]="currentTab === 'print'">
            <span class="icon">🖨️</span> Print Settings
          </div>
          <div class="nav-item" (click)="setTab('users')" [class.active]="currentTab === 'users'">
            <span class="icon">👥</span> Manage Users
          </div>
          <div class="nav-item" (click)="setTab('reminders')" [class.active]="currentTab === 'reminders'">
            <span class="icon">⏰</span> Reminders
          </div>
          <div class="nav-item" (click)="setTab('ca')" [class.active]="currentTab === 'ca'">
            <span class="icon">📊</span> CA Reports Sharing
          </div>
        </nav>

        <div class="sidebar-footer">
          <p>Managed by System Admin</p>
          <div class="badges">
             <span class="dot-live"></span> Studio Online
          </div>
        </div>
      </aside>

      <!-- MAIN CONTENT AREA -->
      <main class="settings-main">
        <app-account-settings *ngIf="currentTab === 'account'"></app-account-settings>
        <app-company-settings *ngIf="currentTab === 'business'"></app-company-settings>
        <app-invoice-settings *ngIf="currentTab === 'invoices'"></app-invoice-settings>
        <app-user-management *ngIf="currentTab === 'users'"></app-user-management>
        
        <!-- PLACEHOLDERS FOR REMAINING MODULES -->
        <div *ngIf="['print', 'reminders', 'ca'].includes(currentTab)" class="placeholder-view">
           <div class="p-content">
              <span class="p-icon">🚧</span>
              <h3>Module Integration in Progress</h3>
              <p>The <b>{{currentTab | titlecase}}</b> module is being connected to the modular framework.</p>
           </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .settings-container { 
      display: flex; 
      min-height: auto; 
      background: #f8fafc; 
    }
    .settings-sidebar { 
      width: 280px; 
      background: white; 
      border-right: 1px solid #e2e8f0; 
      display: flex; 
      flex-direction: column; 
      padding: 1.5rem 0; 
      z-index: 10; 
    }
    .business-brief { display: flex; align-items: center; gap: 0.75rem; padding: 0 1.5rem 1.5rem; border-bottom: 1px solid #f1f5f9; }
    .brief-avatar { width: 40px; height: 40px; background: #7c3aed; color: white; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; font-weight: 800; }
    .business-name { display: block; font-weight: 800; color: #1e293b; font-size: 0.9rem; }
    .business-id { font-size: 0.75rem; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
    
    .back-btn { margin: 1.5rem; padding: 0.75rem 1rem; background: #0f172a; color: white; border: none; border-radius: 12px; font-weight: 700; font-size: 0.85rem; cursor: pointer; transition: all 0.2s; }
    .back-btn:hover { background: #334155; transform: translateX(-4px); }
    
    .settings-nav { flex: 1; padding: 0 0.75rem; display: flex; flex-direction: column; gap: 0.25rem; }
    .nav-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.875rem 1rem; border-radius: 12px; color: #64748b; font-weight: 600; font-size: 0.9rem; cursor: pointer; transition: all 0.2s; }
    .nav-item:hover { background: #f1f5f9; color: #1e293b; }
    .nav-item.active { background: #7c3aed; color: white; box-shadow: 0 4px 12px rgba(124, 58, 237, 0.25); }
    
    .settings-main { flex: 1; overflow-y: auto; padding: 2.5rem 4rem; position: relative; scroll-behavior: smooth; }
    .placeholder-view { height: 60vh; display: flex; align-items: center; justify-content: center; text-align: center; }
    .p-icon { font-size: 4rem; margin-bottom: 1rem; display: block; }
    
    .sidebar-footer { padding: 1.5rem; border-top: 1px solid #f1f5f9; font-size: 0.75rem; color: #94a3b8; }
    .dot-live { display: inline-block; width: 6px; height: 6px; background: #10b981; border-radius: 50%; margin-right: 4px; box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1); }
    .shadow-premium { box-shadow: 4px 0 24px -10px rgba(0,0,0,0.05); }

    .animate-fade-in { animation: fadeIn 0.3s ease-out; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  `]
})
export class BusinessSettingsComponent {
  currentTab: string = 'business';

  constructor(private router: Router) {}

  setTab(tab: string) {
    this.currentTab = tab;
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}
