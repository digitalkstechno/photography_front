import { Routes } from '@angular/router';
import { LoginComponent } from '../pages/login/login.component';
import { LayoutComponent } from '../layout/layout.component';
import { AuthGuard } from '../core/auth/auth.guard.ts.service';
import { DashboardComponent } from '../pages/dashboard/dashboard.component';
import { UsersComponent } from '../pages/users/users.component';


// app-routing.module.ts
export const routes: Routes = [
  { path: 'login', component: LoginComponent },

  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'users', component: UsersComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];
