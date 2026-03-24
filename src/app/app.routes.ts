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

export const routes: Routes = [
  { path: 'login', component: LoginComponent },

  {
    path: '',
    component: LayoutComponent,
    canActivate:[AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },

      // Entity CRUD (generic)
      { path: 'admin/:entity', component: EntityPageComponent },
      { path: 'admin/:entity/new', component: EntityFormPageComponent },
      { path: 'admin/:entity/edit/:id', component: EntityFormPageComponent },


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
