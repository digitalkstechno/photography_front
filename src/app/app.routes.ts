import { Routes } from '@angular/router';
import { LoginComponent } from '../pages/login/login.component';
import { LayoutComponent } from '../layout/layout.component';
import { DashboardComponent } from '../pages/dashboard/dashboard.component';
import { ReportsComponent } from '../pages/reports/reports.component';
import { SettingsComponent } from '../pages/settings/settings.component';
import { EntityFormPageComponent } from '../pages/entity-form-page/entity-form-page.component';
import { EntityPageComponent } from '../pages/entity-page/entity-page.component';
import { QuotePublicComponent } from '../pages/quote-public/quote-public.component';
import { BookingConfirmationComponent } from '../pages/booking-confirmation/booking-confirmation.component';
import { BookingListComponent } from '../pages/booking-list/booking-list.component';
import { BookingFormComponent } from '../pages/booking-form/booking-form.component';
import { BookingDetailComponent } from '../pages/booking-detail/booking-detail.component';
import { CalendarComponent } from '../pages/calendar/calendar.component';
import { LedgerComponent } from '../pages/ledger/ledger.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },

  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },

      { path: 'admin/:entity', component: EntityPageComponent },

      // New entity form page
      { path: 'admin/:entity/new', component: EntityFormPageComponent },

      // Edit entity form page
      { path: 'admin/:entity/edit/:id', component: EntityFormPageComponent },

      { path: 'reports', component: ReportsComponent },
      { path: 'settings', component: SettingsComponent },

      // Bookings Custom Routes
      { path: 'bookings', component: BookingListComponent },
      { path: 'bookings/new', component: BookingFormComponent },
      { path: 'bookings/edit/:id', component: BookingFormComponent },
      { path: 'bookings/:id', component: BookingDetailComponent },
      
      // Calendar
      { path: 'calendar', component: CalendarComponent },
      
      // Ledger (Main & Sub)
      { path: 'ledger', component: LedgerComponent },
      { path: 'ledger/:partyId', component: LedgerComponent },

      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  { path: 'q/:id', component: QuotePublicComponent },
  { path: 'booking-confirmation', component: BookingConfirmationComponent },

  { path: '**', redirectTo: 'dashboard' }
];
