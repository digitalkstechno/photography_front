import { Routes } from '@angular/router';
import { LoginComponent } from '../pages/login/login.component';
import { LayoutComponent } from '../layout/layout.component';
import { DashboardComponent } from '../pages/dashboard/dashboard.component';
import { ReportsComponent } from '../pages/reports/reports.component';
import { SettingsComponent } from '../pages/settings/settings.component';
import { EntityFormPageComponent } from '../pages/entity-form-page/entity-form-page.component';
import { EntityPageComponent } from '../pages/entity-page/entity-page.component';
import { CalendarComponent } from '../pages/calendar/calendar.component';
import { LedgerComponent } from '../pages/ledger/ledger.component';
import { AuthGuard } from '../core/auth/auth.guard.ts.service';
import { PassportStudioComponent } from '../pages/passport-studio-component/passport-studio.component';
import { QuotationFormComponent } from '../pages/quotation-form/quotation-form.component';
import { QuotationListComponent } from '../pages/quotation-list/quotation-list.component';
import { InvoiceComponent } from './../pages/invoice-list/invoice-list.component';
import { InvoiceFormComponent } from '../pages/invoiceform/invoiceform.component';
import { InvoiceDetailComponent } from '../pages/invoice-detail/invoice-detail.component';
import { JobAssignmentComponent } from '../pages/job-assignment/job-assignment.component';
import { JobListComponent } from '../pages/job-list/job-list.component';
import { JobReceiptComponent } from '../pages/job-receipt/job-receipt.component';
import { PosBillingComponent } from './pages/pos-billing/pos-billing.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },

  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'admin/pos', component: PosBillingComponent },

      // Quotations Management
      { path: 'admin/quotations', component: QuotationListComponent },
      { path: 'admin/quotations/new', component: QuotationFormComponent },
      { path: 'admin/quotations/edit/:id', component: QuotationFormComponent },

      { path: 'admin/invoices', component: InvoiceComponent },
      { path: 'admin/invoices/new', component: InvoiceFormComponent },
      { path: 'admin/invoices/:id', component: InvoiceDetailComponent },
      { path: 'admin/invoices/edit/:id', component: InvoiceFormComponent },
      { path: 'admin/bookings/:bookingId/assign', component: JobAssignmentComponent },
      { path: 'admin/jobs', component: JobListComponent },
      { path: 'admin/jobs/new', component: JobAssignmentComponent },
      { path: 'admin/jobs/:id/receipt', component: JobReceiptComponent },
      { path: 'admin/jobs/edit/:id', component: JobAssignmentComponent },

      { path: 'admin/:entity', component: EntityPageComponent },
      { path: 'admin/:entity/new', component: EntityFormPageComponent },
      { path: 'admin/:entity/edit/:id', component: EntityFormPageComponent },
      { 
        path: 'equipments', 
        component: EntityPageComponent, 
        data: { entity: 'equipment' } 
      },
      {
        path: 'admin/business-settings',
        loadComponent: () => import('../pages/business-settings/business-settings.component').then(m => m.BusinessSettingsComponent)
      },
      {
        path: 'photoEditor',
        loadComponent: () => import('../pages/passport-studio-component/passport-studio.component').then(m => m.PassportStudioComponent)
      },

      // Calendar
      { path: 'calendar', component: CalendarComponent },

      // Ledger
      { path: 'ledger', component: LedgerComponent },
      { path: 'ledger/:partyId', component: LedgerComponent },

      // Reports & Settings
      { path: 'reports', component: ReportsComponent },
      { path: 'settings', component: SettingsComponent },

      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  { path: '**', redirectTo: 'dashboard' }
];
