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
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.css']
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
