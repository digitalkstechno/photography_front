import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ApiService } from '../../core/http/api.service';

@Component({
  selector: 'app-booking-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="booking-detail-page container" *ngIf="booking">
      <div class="card-premium card-header-black mb-5">
        <div class="header-inner">
          <div class="title-group">
            <div class="title-with-back">
              <button class="btn-back-icon" (click)="goBack()">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              </button>
              <h1 class="text-white">Booking #{{ booking.id }}</h1>
            </div>
            <p class="text-muted-light">Viewing record created on {{ booking.createdAt | date:'medium' }}</p>
          </div>
          <div class="header-actions">
            <span class="badge" [class]="'badge-' + getStatusClass(booking.status)">{{ booking.status }}</span>
            <button class="btn-premium btn-secondary-light" (click)="edit()">Edit Record</button>
            <div class="status-dropdown">
              <select class="input-light" (change)="updateStatus($event)">
                  <option value="">Status Update</option>
                  <option value="TENTATIVE">Tentative</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        <div class="details-body p-5">
          <div class="grid-2col">
            <!-- Customer Info -->
            <div class="detail-section">
              <div class="section-tag">Client Information</div>
              <div class="info-card">
                 <div class="row-info"><span class="label">Name</span> <span class="value">{{ booking.customer?.name }}</span></div>
                 <div class="row-info"><span class="label">Phone</span> <span class="value">{{ booking.customer?.phone }}</span></div>
                 <div class="row-info"><span class="label">Email</span> <span class="value">{{ booking.customer?.email }}</span></div>
                 <div class="row-info"><span class="label">Address</span> <span class="value">{{ booking.customer?.address }}</span></div>
              </div>
            </div>

            <!-- Booking Summary -->
            <div class="detail-section">
              <div class="section-tag">Financials & Links</div>
              <div class="info-card">
                 <div class="row-info" *ngIf="booking.quotationId">
                    <span class="label">Quotation</span> 
                    <span class="value">
                      <a class="text-accent" [routerLink]="['/admin', 'quotes', 'edit', booking.quotationId]">View Quote #{{ booking.quotationId }}</a>
                    </span>
                 </div>
                 <div class="row-info"><span class="label">Pkg events</span> <span class="value">{{ booking.events?.length || 0 }} Scheduled</span></div>
                 <div class="notes-box mt-3" *ngIf="booking.notes">
                    <span class="label">Internal Notes</span>
                    <p>{{ booking.notes }}</p>
                 </div>
              </div>
            </div>
          </div>

          <!-- Events List -->
          <div class="events-main mt-5">
            <div class="section-tag">Event Itinerary</div>
            <div class="event-grid-compact">
              <div class="event-card-refined" *ngFor="let event of booking.events; let i = index">
                <div class="event-count">Event #{{ i + 1 }}</div>
                <div class="event-info-main">
                  <div class="event-type-badge">{{ event.eventType }}</div>
                  <div class="event-date-text">{{ event.eventDate | date:'fullDate' }}</div>
                </div>
                <div class="event-details-row">
                  <div class="detail-item">
                    <span class="icon">📍</span>
                    <span class="text">{{ event.location || 'No location set' }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="icon">📸</span>
                    <span class="text">{{ event.photographer?.name || 'Unassigned' }}</span>
                  </div>
                </div>
                <div class="event-notes-footer" *ngIf="event.notes">
                  <span class="icon">📝</span> {{ event.notes }}
                </div>
              </div>
            </div>
            <div *ngIf="!booking.events?.length" class="empty-state-minimal">
              No events scheduled for this booking yet.
            </div>
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

    .event-grid-compact { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
    .event-card-refined { 
      background: white; border: 1.5px solid var(--border); border-radius: 12px; padding: 16px; 
      transition: all 0.2s; position: relative; overflow: hidden;
    }
    .event-card-refined:hover { border-color: var(--primary); transform: translateY(-2px); box-shadow: var(--shadow-md); }
    .event-card-refined::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 4px; background: var(--primary); }

    .event-count { font-size: 9px; font-weight: 900; color: var(--text-light); text-transform: uppercase; margin-bottom: 8px; }
    .event-type-badge { font-size: 14px; font-weight: 800; color: var(--primary); margin-bottom: 2px; }
    .event-date-text { font-size: 11px; font-weight: 700; color: var(--text-muted); margin-bottom: 12px; }

    .event-details-row { display: flex; flex-direction: column; gap: 6px; margin-bottom: 10px; }
    .detail-item { display: flex; align-items: flex-start; gap: 8px; font-size: 12px; color: var(--text-main); font-weight: 500; }
    .detail-item .icon { font-size: 14px; }
    
    .event-notes-footer { border-top: 1px solid var(--border); margin-top: 8px; padding-top: 8px; font-size: 11px; color: var(--text-muted); font-style: italic; }
    
    .empty-state-minimal { padding: 32px; text-align: center; color: var(--text-light); font-weight: 600; font-size: 13px; background: var(--bg-app); border-radius: 12px; }
    
    .text-accent { color: var(--accent); font-weight: 700; text-decoration: none; }
    .text-accent:hover { text-decoration: underline; }
    .mb-5 { margin-bottom: 24px; }
    .mt-5 { margin-top: 24px; }
  `]
})
export class BookingDetailComponent implements OnInit {
  booking: any;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) this.loadBooking(Number(id));
    });
  }

  loadBooking(id: number) {
    this.loading = true;
    this.api.get<any>(`/bookings/${id}`).subscribe({
      next: (data) => {
        this.booking = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        alert("Failed to load booking details.");
      }
    });
  }

  getStatusClass(status: string): string {
    if (!status) return 'black';
    const s = status.toUpperCase();
    if (s === 'CONFIRMED') return 'success';
    if (s === 'TENTATIVE') return 'warning';
    if (s === 'COMPLETED') return 'info';
    if (s === 'CANCELLED') return 'danger';
    return 'black';
  }

  updateStatus(event: any) {
    const status = (event.target as HTMLSelectElement).value;
    if (!status) return;

    this.api.put(`/bookings/${this.booking.id}/status`, { status }).subscribe({
      next: () => {
        this.booking.status = status;
        alert("Status updated successfully");
      },
      error: () => alert("Failed to update status")
    });
  }

  edit() {
    this.router.navigate(['/bookings/edit', this.booking.id]);
  }

  goBack() {
    this.router.navigate(['/bookings']);
  }
}
