import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../core/http/api.service';
import { EntityService } from '../../core/entity/entity.service';
import { getEntityConfig } from '../../core/entity/entities';

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="booking-form-page container">
      <!-- High Contrast Header Card -->
      <div class="card-premium card-header-black" [formGroup]="bookingForm">
        <div class="header-inner">
          <div class="title-group">
            <h1 class="text-white">{{ isEdit ? 'Edit' : 'Create' }} Booking</h1>
            <p class="text-muted-light">Configure client schedule and photography team</p>
          </div>
          <div class="header-actions">
            <button class="btn-premium btn-secondary-light" (click)="cancel()">Cancel</button>
            <button class="btn-premium btn-primary-light" (click)="save()" [disabled]="bookingForm.invalid || loading">
              {{ loading ? 'Saving...' : 'Confirm' }}
            </button>
          </div>
        </div>

        <div class="form-body p-5">
          <div class="row">
            <!-- Customer Selection -->
            <div class="form-field">
              <label>Select Customer</label>
              <select formControlName="customerId" class="input">
                <option [ngValue]="null">Search for a client...</option>
                <option *ngFor="let c of customers" [value]="c.id">{{ c.name }}</option>
              </select>
            </div>

            <!-- Package Selection -->
            <div class="form-field">
              <label>Service Package</label>
              <select formControlName="packageId" class="input">
                <option [ngValue]="null">Custom / No Package</option>
                <option *ngFor="let p of packagesList" [value]="p.id">{{ p.name }} - ₹{{ p.price }}</option>
              </select>
            </div>

            <!-- Status -->
            <div class="form-field">
              <label>Booking Status</label>
              <select formControlName="status" class="input">
                <option value="TENTATIVE">Tentative</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            <!-- Notes -->
            <div class="form-field">
              <label>Internal Instructions</label>
              <textarea formControlName="notes" class="textarea" placeholder="Explain your notes here..."></textarea>
            </div>
          </div>

          <div class="events-section mt-5">
            <div class="section-header-black">
              <h3>Shoot Events</h3>
              <button type="button" class="btn-premium btn-primary btn-sm" (click)="addEvent()">
                 + Add New
              </button>
            </div>

            <div formArrayName="events" class="events-stack">
              <div *ngFor="let event of eventControls; let i = index" [formGroupName]="i" class="event-card-premium">
                <div class="event-meta">
                  <span class="badge-black">EVENT #{{ i + 1 }}</span>
                  <button type="button" class="btn-text-danger" (click)="removeEvent(i)">Remove</button>
                </div>
                <div class="row">
                  <div class="form-field">
                    <label>Event Type</label>
                    <input type="text" formControlName="eventType" class="input" placeholder="e.g. Wedding Ceremony" />
                  </div>
                  <div class="form-field">
                    <label>Shoot Date</label>
                    <input type="date" formControlName="eventDate" class="input" />
                  </div>
                  <div class="form-field">
                    <label>Venue Location</label>
                    <input type="text" formControlName="location" class="input" placeholder="Google Maps link or address" />
                  </div>
                  <div class="form-field">
                    <label>Assigned Photographer</label>
                    <select formControlName="photographerId" class="input">
                      <option [ngValue]="null">Unassigned</option>
                      <option *ngFor="let u of photographers" [value]="u.id">{{ u.name }}</option>
                    </select>
                  </div>
                  <div class="form-field">
                    <label>Event Note</label>
                    <input type="text" formControlName="notes" class="input" placeholder="Specific notes for this event" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .booking-form-page { max-width: 800px; padding: 16px; }
    
    .card-header-black { padding: 0; box-shadow: var(--shadow-md); border: 1px solid var(--border); }
    .header-inner { 
      background: var(--primary); 
      color: white; 
      padding: 12px 20px; 
      display: flex; 
      justify-content: space-between; 
      align-items: center;
    }
    
    .text-white { color: #fff; margin: 0; font-size: 18px; font-weight: 800; letter-spacing: -0.5px; }
    .text-muted-light { color: rgba(255,255,255,0.7); margin: 0; font-size: 11.5px; }
    
    .header-actions { display: flex; gap: 8px; }
    
    .btn-primary-light { background: #fff; color: #000; font-size: 11.5px; padding: 6px 14px; font-weight: 800; }
    .btn-primary-light:hover { background: #f4f4f5; transform: translateY(-1px); }
    
    .btn-secondary-light { background: transparent; color: #fff; border: 1.5px solid rgba(255,255,255,0.2); font-size: 11.5px; padding: 6px 14px; font-weight: 700; }
    .btn-secondary-light:hover { background: rgba(255,255,255,0.1); border-color: #fff; }
    
    .form-body { padding: 20px; }
    .row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .row > .form-field:last-child { grid-column: span 2; }
    
    .section-header-black { 
      display: flex; 
      justify-content: space-between; 
      align-items: center; 
      margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 2px solid var(--primary);
    }
    .section-header-black h3 { font-size: 12px; font-weight: 900; color: var(--primary); margin: 0; text-transform: uppercase; letter-spacing: 0.8px; }
    
    .event-card-premium { 
      background: #fafafa; 
      border: 1px solid var(--border); 
      border-radius: var(--radius-md); 
      padding: 16px; 
      margin-bottom: 16px; 
    }
    .event-card-premium:hover { border-color: var(--primary); }
    
    .event-meta { display: flex; justify-content: space-between; margin-bottom: 12px; align-items: center; }
    .badge-black { 
      background: var(--primary); 
      color: #fff; 
      padding: 3px 8px; 
      border-radius: 4px; 
      font-size: 9px; 
      font-weight: 900; 
      letter-spacing: 0.5px;
    }
    
    .btn-text-danger { background: transparent; border: none; color: var(--danger); font-weight: 800; cursor: pointer; font-size: 11px; }
    
    .mt-5 { margin-top: 24px; }
    .p-5 { padding: 20px; }
    .btn-sm { padding: 5px 12px; font-size: 11px; font-weight: 800; }
  `]
})
export class BookingFormComponent implements OnInit {
  bookingId?: number;
  isEdit = false;
  loading = false;
  bookingForm: FormGroup;
  
  customers: any[] = [];
  photographers: any[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private entityService: EntityService
  ) {
    this.bookingForm = this.fb.group({
      customerId: [null, Validators.required],
      quotationId: [null],
      packageId: [null],
      status: ['TENTATIVE', Validators.required],
      notes: [''],
      events: this.fb.array([])
    });
  }

  get eventControls() {
    return (this.bookingForm.get('events') as FormArray).controls as FormGroup[];
  }

  async ngOnInit() {
    await this.loadLookups();
    
    this.route.paramMap.subscribe(async params => {
      const id = params.get('id');
      if (id) {
        this.bookingId = Number(id);
        this.isEdit = true;
        await this.loadBooking();
      } else {
        // Check for quotation conversion
        this.route.queryParamMap.subscribe(queryParams => {
          const quoteId = queryParams.get('quote');
          if (quoteId) {
            this.loadQuotationForConversion(Number(quoteId));
          } else {
            this.addEvent(); 
          }
        });
      }
    });
  }

  async loadQuotationForConversion(quoteId: number) {
    this.api.get<any>(`/transactions/${quoteId}`).subscribe(quote => {
      if (quote) {
        this.bookingForm.patchValue({
          customerId: quote.partyId,
          quotationId: quote.id,
          packageId: quote.packageId,
          notes: `Converted from Quotation #${quote.id}. \n${quote.notes || ''}`
        });
        this.addEvent(); 
      }
    });
  }

  async loadLookups() {
    try {
      // Get Parties (Customers)
      const partyConfig = getEntityConfig('party')!;
      const partiesResp = await this.entityService.list(partyConfig);
      this.customers = Array.isArray(partiesResp) ? partiesResp : (partiesResp as any).data || [];

      // Get Packages
      const packageConfig = getEntityConfig('packages')!;
      const packageResp = await this.entityService.list(packageConfig);
      this.packagesList = Array.isArray(packageResp) ? packageResp : (packageResp as any).data || [];

      // Get Photographers (Users) - Use the new /users endpoint
      this.api.get<any[]>('/users').subscribe({
        next: (users) => this.photographers = users,
        error: () => {}
      });
    } catch (e) {}
  }

  packagesList: any[] = [];

  async loadBooking() {
    if (!this.bookingId) return;
    this.api.get<any>(`/bookings/${this.bookingId}`).subscribe(data => {
      if (data) {
        this.bookingForm.patchValue({
          customerId: data.customerId,
          quotationId: data.quotationId,
          packageId: data.packageId,
          status: data.status,
          notes: data.notes
        });
        
        // Clear and reload events
        const eventsArray = this.bookingForm.get('events') as FormArray;
        while (eventsArray.length) eventsArray.removeAt(0);
        
        if (data.events && data.events.length) {
          data.events.forEach((e: any) => {
             const dateOnly = e.eventDate ? e.eventDate.split('T')[0] : '';
             this.addEvent({
                eventType: e.eventType,
                eventDate: dateOnly,
                location: e.location,
                photographerId: e.photographerId,
                notes: e.notes
             });
          });
        }
      }
    });
  }

  addEvent(initial?: any) {
    const eventsArray = this.bookingForm.get('events') as FormArray;
    eventsArray.push(this.fb.group({
      eventType: [initial?.eventType || '', Validators.required],
      eventDate: [initial?.eventDate || '', Validators.required],
      location: [initial?.location || ''],
      photographerId: [initial?.photographerId || null],
      notes: [initial?.notes || ''],
      overrideConflicts: [false]
    }));
  }

  removeEvent(index: number) {
    const eventsArray = this.bookingForm.get('events') as FormArray;
    eventsArray.removeAt(index);
  }

  async save() {
    if (this.bookingForm.invalid) return;
    
    this.loading = true;
    const payload = this.bookingForm.value;
    
    const request = this.isEdit 
      ? this.api.put(`/bookings/${this.bookingId}`, payload) // Need to implement status update or full update
      : this.api.post('/bookings', payload);

    request.subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/bookings']);
      },
      error: (err) => {
        this.loading = false;
        if (err.status === 409) {
           alert(err.error?.message || "Double booking conflict detected!");
        } else {
           alert("Failed to save booking. " + (err.error?.message || ""));
        }
      }
    });
  }

  cancel() {
    this.router.navigate(['/bookings']);
  }
}
