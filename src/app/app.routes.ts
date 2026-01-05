import { Routes } from '@angular/router';
import { LoginComponent } from '../pages/login/login.component';
import { LayoutComponent } from '../layout/layout.component';
import { DashboardComponent } from '../pages/dashboard/dashboard.component';
import { UsersComponent } from '../pages/users/users.component';
import { ReportsComponent } from '../pages/reports/reports.component';
import { SettingsComponent } from '../pages/settings/settings.component';

import { AuthGuard } from '../core/auth/auth.guard.ts.service';

// Doctors
import { DoctorListComponent } from '../pages/doctor-list/doctor-list.component';
import { AddDoctorComponent } from '../pages/add-doctor/add-doctor.component';
import { UpdateDoctorComponent } from '../pages/update-doctor/update-doctor.component';
// Notices
import { CreatePatientNoticeComponent } from '../pages/notice/notice.component';
import { NoticeListComponent } from '../pages/notice-list/notice-list.component';

// 📚 Blogs
import { BlogListComponent } from '../pages/blog-list/blog-list.component';
import { AddBlogComponent } from '../pages/blog/blog.component';
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

      // 📢 Notices
      { path: 'notices', component: NoticeListComponent },
      { path: 'notices/add', component: CreatePatientNoticeComponent },
      { path: 'notices/edit/:id', component: CreatePatientNoticeComponent },

      // 📚 Blogs
      { path: 'blogs', component: BlogListComponent },
      { path: 'blogs/add', component: AddBlogComponent },

      // 👨‍⚕️ Doctors (Admin)
      { path: 'admin/doctors', component: DoctorListComponent },
      { path: 'admin/doctors/add', component: AddDoctorComponent },
      { path: 'admin/doctors/edit/:id', component: UpdateDoctorComponent },

      // default
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  // 🚨 Fallback
  { path: '**', redirectTo: 'dashboard' }
];
