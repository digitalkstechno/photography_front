import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ApiService } from '../../core/http/api.service';

@Component({
  selector: 'app-booking-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="booking-detail-page container" *ngIf="event">
      <div class="card-premium card-header-black mb-5">
        <div class="header-inner">
          <div class="title-group">
            <div class="title-with-back">
              <button class="btn-back-icon" (click)="goBack()">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              </button>
              <h1 class="text-white">{{ event.eventType }} {{ event.title ? '— ' + event.title : '' }}</h1>
            </div>
            <p class="text-muted-light">Created on {{ event.createdAt | date:'medium' }}</p>
          </div>
          <div class="header-actions">
            <span class="badge" [class]="'badge-' + getStatusClass(event.status)">{{ event.status }}</span>
            <button class="btn-premium btn-secondary-light" (click)="edit()">Edit</button>
            <div class="status-dropdown">
              <select class="input-light" (change)="updateStatus($event)">
                  <option value="">Update Status</option>
                  <option value="PENDING">Pending</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        <div class="details-body p-5">
          <div class="grid-2col">
            <div class="detail-section">
              <div class="section-tag">Client Information</div>
              <div class="info-card">
                 <div class="row-info"><span class="label">Name</span> <span class="value">{{ event.customer?.name }}</span></div>
                 <div class="row-info"><span class="label">Phone</span> <span class="value">{{ event.customer?.phone }}</span></div>
                 <div class="row-info"><span class="label">Email</span> <span class="value">{{ event.customer?.email }}</span></div>
              </div>
            </div>

            <div class="detail-section">
              <div class="section-tag">Event Details</div>
              <div class="info-card">
                 <div class="row-info"><span class="label">Type</span> <span class="value">{{ event.eventType }}</span></div>
                 <div class="row-info"><span class="label">Start</span> <span class="value">{{ event.startDate | date:'fullDate' }}</span></div>
                 <div class="row-info"><span class="label">End</span> <span class="value">{{ event.endDate | date:'fullDate' }}</span></div>
                 <div class="row-info"><span class="label">Location</span> <span class="value">{{ event.location || 'N/A' }}</span></div>
                 <div class="row-info"><span class="label">Package</span> <span class="value">{{ event.package?.name || 'None' }}</span></div>
                 <div class="row-info"><span class="label">Total</span> <span class="value">₹{{ event.totalAmount | number }}</span></div>
              </div>
            </div>
          </div>

          <div class="notes-box mt-5" *ngIf="event.notes">
             <span class="label">Notes</span>
             <p>{{ event.notes }}</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .booking-detail-page { max-width: 1000px; padding-top: 24px; }
    .title-with-back { display: flex; align-items: center; gap: 12px; }
    .btn-back-icon {
      background: none; border: 1px solid rgba(255,255,255,0.2);
      color: #fff; width: 32px; height: 32px; border-radius: 8px;
      display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s;
    }
    .btn-back-icon:hover { background: rgba(255,255,255,0.1); border-color: #fff; }
    .header-actions { display: flex; align-items: center; gap: 12px; }
    .btn-secondary-light { background: transparent; color: #fff; border: 1.5px solid rgba(255,255,255,0.2); }
    .btn-secondary-light:hover { background: rgba(255,255,255,0.1); border-color: #fff; }
    .input-light {
      background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2);
      color: #fff; padding: 6px 12px; border-radius: 8px; font-size: 11px; font-weight: 700; text-transform: uppercase; cursor: pointer;
    }
    .input-light option { background: #000; color: #fff; }
    .grid-2col { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
    .section-tag { font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: var(--text-light); margin-bottom: 12px; }
    .info-card { background: var(--bg-app); border-radius: var(--radius-md); padding: 16px; border: 1px solid var(--border); }
    .row-info { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid var(--border); }
    .row-info:last-child { border: none; }
    .row-info .label { font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; }
    .row-info .value { font-size: 13.5px; font-weight: 600; color: var(--text-main); }
    .notes-box { background: white; border: 1px solid var(--border); padding: 12px; border-radius: 8px; }
    .notes-box .label { font-size: 10px; font-weight: 800; display: block; margin-bottom: 4px; color: var(--text-light); text-transform: uppercase; }
    .notes-box p { margin: 0; font-size: 13px; color: var(--text-muted); line-height: 1.4; }
    .mb-5 { margin-bottom: 24px; }
    .mt-5 { margin-top: 24px; }
  `]
})
export class BookingDetailComponent implements OnInit {
  event: any;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) this.loadEvent(id);
    });
  }

  loadEvent(id: string) {
    this.loading = true;
    this.api.get<any>(`/events/${id}`).subscribe({
      next: (res) => {
        this.event = res?.data || res;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        alert('Failed to load event details.');
      }
    });
  }

  getStatusClass(status: string): string {
    if (!status) return 'black';
    const s = status.toUpperCase();
    if (s === 'CONFIRMED') return 'success';
    if (s === 'PENDING') return 'warning';
    if (s === 'COMPLETED') return 'info';
    if (s === 'CANCELLED') return 'danger';
    return 'black';
  }

  updateStatus(evt: any) {
    const status = (evt.target as HTMLSelectElement).value;
    if (!status) return;

    this.api.patch(`/events/${this.event._id}/status`, { status }).subscribe({
      next: () => {
        this.event.status = status;
      },
      error: () => alert('Failed to update status')
    });
  }

  edit() {
    this.router.navigate(['/bookings/edit', this.event._id]);
  }

  goBack() {
    this.router.navigate(['/bookings']);
  }
}
