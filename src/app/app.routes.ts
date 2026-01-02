import { Routes } from '@angular/router';
import { LoginComponent } from '../pages/login/login.component';
import { LayoutComponent } from '../layout/layout.component';
import { DashboardComponent } from '../pages/dashboard/dashboard.component';
import { UsersComponent } from '../pages/users/users.component';
import { ReportsComponent } from '../pages/reports/reports.component';
import { SettingsComponent } from '../pages/settings/settings.component';

import { AuthGuard } from '../core/auth/auth.guard.ts.service';
import { DoctorListComponent } from '../pages/doctor-list/doctor-list.component';
import { AddDoctorComponent } from '../pages/add-doctor/add-doctor.component';
import { CreatePatientNoticeComponent } from '../pages/notice/notice.component';
import { NoticeListComponent } from '../pages/notice-list/notice-list.component';
export const routes: Routes = [
  // 🔓 Public
  { path: 'login', component: LoginComponent },

  // 🔒 Protected App
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'users', component: UsersComponent },
      { path: 'reports', component: ReportsComponent },
      { path: 'settings', component: SettingsComponent },
      { path: 'notices', component: NoticeListComponent },
      { path: 'notices/add', component: CreatePatientNoticeComponent },
      { path: 'admin/doctors', component: DoctorListComponent },
      { path: "admin/doctors/add", component: AddDoctorComponent },
      // default
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  // 🚨 Fallback
  { path: '**', redirectTo: 'dashboard' }
];
