import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/http/api.service';
import { firstValueFrom } from 'rxjs';
import { TooltipDirective } from '../../shared/tooltip/tooltip.directive';

@Component({
  selector: 'app-job-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, TooltipDirective],
  templateUrl: './job-list.component.html',
  styles: [`
    .team-chips { display: flex; flex-wrap: wrap; gap: 6px; }
    .team-chip {
      display: inline-flex; align-items: center; gap: 6px;
      background: var(--surface-2, #f1f3f5);
      border: 1px solid var(--border, #dee2e6);
      border-radius: 99px; padding: 3px 10px 3px 4px;
      font-size: 11.5px; font-weight: 500; white-space: nowrap;
    }
    .avatar-sm {
      width: 22px; height: 22px; border-radius: 50%;
      background: var(--primary, #6366f1);
      color: #fff; display: flex; align-items: center;
      justify-content: center; font-size: 9px; font-weight: 700;
      flex-shrink: 0;
    }
    .chip-role {
      font-size: 10px; color: var(--text-muted, #868e96);
      font-weight: 400; margin-left: 2px;
    }
    .no-team { font-size: 12px; color: var(--text-muted); font-style: italic; }
    .link-cell {
      color: var(--primary, #6366f1); font-weight: 600; cursor: pointer;
      text-decoration: none;
    }
    .link-cell:hover { text-decoration: underline; }
    .action-group { display: flex; justify-content: flex-end; gap: 4px; align-items: center; }
    .action-btn {
      display: inline-flex; align-items: center; gap: 5px;
      padding: 5px 10px; border-radius: 6px; font-size: 12px;
      font-weight: 600; border: 1px solid transparent; cursor: pointer;
      transition: all .15s;
    }
    .action-btn.booking {
      background: #e0e7ff; color: #4338ca; border-color: #c7d2fe;
    }
    .action-btn.booking:hover { background: #c7d2fe; }
    .action-btn.team {
      background: #d1fae5; color: #065f46; border-color: #a7f3d0;
    }
    .action-btn.team:hover { background: #a7f3d0; }
    .action-btn.receipt {
      background: #fef3c7; color: #92400e; border-color: #fde68a;
    }
    .action-btn.receipt:hover { background: #fde68a; }
  `]
})
export class JobListComponent implements OnInit {

  jobs: any[] = [];
  loading = false;
  searchQuery = '';

  // Pagination
  currentPage = 1;
  totalPages = 1;
  totalItems = 0;
  pageSize = 10;

  statusOptions = ['', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];
  selectedStatus = '';

  constructor(private api: ApiService, private router: Router) {}

  async ngOnInit() {
    this.load();
  }

  async load() {
    this.loading = true;
    try {
      const params: any = {
        page: this.currentPage,
        limit: this.pageSize
      };
      if (this.searchQuery) params.search = this.searchQuery;
      if (this.selectedStatus) params.status = this.selectedStatus;

      const res: any = await firstValueFrom(this.api.get('/jobs', params));
      const payload = res.data;

      if (payload && typeof payload === 'object') {
        if (Array.isArray(payload.data)) {
          this.jobs = payload.data;
          this.totalItems = payload.pagination?.total || payload.total || this.jobs.length;
        } else if (Array.isArray(payload)) {
          this.jobs = payload;
          this.totalItems = payload.length;
        } else {
          this.jobs = [];
          this.totalItems = 0;
        }
      } else if (Array.isArray(res)) {
        this.jobs = res;
        this.totalItems = res.length;
      } else {
        this.jobs = [];
        this.totalItems = 0;
      }

      this.totalPages = Math.ceil(this.totalItems / this.pageSize) || 1;
    } catch (err) {
      console.error('Error loading jobs', err);
      this.jobs = [];
    } finally {
      this.loading = false;
    }
  }

  onSearchChange() { this.currentPage = 1; this.load(); }
  onFilterChange() { this.currentPage = 1; this.load(); }

  /** Returns each assigned member's display info */
  getAssignedTeam(job: any): { name: string; role: string; initials: string }[] {
    return (job.assignedUsers || []).map((m: any) => {
      const personObj = m.user || m.freelancer;
      const name = personObj?.name || 'Unknown';
      const role = m.role || '';
      const initials = name.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase();
      return { name, role, initials };
    });
  }

  /** Navigate to printable job receipt */
  viewReceipt(job: any) {
    this.router.navigate(['/admin/jobs', job._id, 'receipt']);
  }

  /** Navigate to edit the linked booking */
  editBooking(job: any) {
    const bookingId = job.event?._id || job.event;
    if (bookingId) {
      this.router.navigate(['/admin/bookings/edit', bookingId]);
    } else {
      alert('No booking linked to this job.');
    }
  }

  /** Navigate to team assignment page for this job's booking */
  manageTeam(job: any) {
    const bookingId = job.event?._id || job.event;
    if (bookingId) {
      this.router.navigate(['/admin/bookings', bookingId, 'assign']);
    } else {
      alert('No booking linked to this job.');
    }
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      PENDING: 'info',
      CONFIRMED: 'success',
      COMPLETED: 'primary',
      CANCELLED: 'danger',
    };
    return map[status] || 'default';
  }
}
