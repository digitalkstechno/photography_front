import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  eventId?: string;
  isEdit = false;
  loading = false;
  eventForm: FormGroup;

  customers: any[] = [];
  packagesList: any[] = [];

  eventTypes = [
    'WEDDING', 'HALDI', 'MEHNDI', 'SANGEET', 'RECEPTION',
    'ENGAGEMENT', 'BIRTHDAY', 'CORPORATE', 'OTHER'
  ];

  statuses = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private entityService: EntityService
  ) {
    this.eventForm = this.fb.group({
      customer: [null, Validators.required],
      eventType: ['WEDDING', Validators.required],
      title: [''],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      location: [''],
      status: ['PENDING', Validators.required],
      package: [null],
      quotation: [null],
      totalAmount: [0],
      notes: [''],
      overrideConflicts: [false]
    });
  }

  async ngOnInit() {
    await this.loadLookups();

    this.route.paramMap.subscribe(async params => {
      const id = params.get('id');
      if (id) {
        this.eventId = id;
        this.isEdit = true;
        await this.loadEvent();
      } else {
        // Check for quotation conversion
        this.route.queryParamMap.subscribe(queryParams => {
          const quotationId = queryParams.get('quotation');
          if (quotationId) {
            this.eventForm.patchValue({ quotation: quotationId });
          }
        });
      }
    });
  }

  async loadLookups() {
    try {
      const partyConfig = getEntityConfig('party')!;
      this.customers = await this.entityService.list(partyConfig);

      const packageConfig = getEntityConfig('packages')!;
      this.packagesList = await this.entityService.list(packageConfig);
    } catch (e) {}
  }

  async loadEvent() {
    if (!this.eventId) return;
    this.api.get<any>(`/events/${this.eventId}`).subscribe(res => {
      const data = res?.data || res;
      if (data) {
        this.eventForm.patchValue({
          customer: data.customer?._id || data.customer,
          eventType: data.eventType,
          title: data.title,
          startDate: data.startDate ? data.startDate.split('T')[0] : '',
          endDate: data.endDate ? data.endDate.split('T')[0] : '',
          location: data.location,
          status: data.status,
          package: data.package?._id || data.package,
          quotation: data.quotation?._id || data.quotation,
          totalAmount: data.totalAmount,
          notes: data.notes
        });
      }
    });
  }

  async save() {
    if (this.eventForm.invalid) return;

    this.loading = true;
    const payload = { ...this.eventForm.value };

    // Clean up null/empty fields
    if (!payload.package) delete payload.package;
    if (!payload.quotation) delete payload.quotation;
    delete payload.overrideConflicts;

    const request = this.isEdit
      ? this.api.put(`/events/${this.eventId}`, payload)
      : this.api.post('/events', payload);

    request.subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/bookings']);
      },
      error: (err) => {
        this.loading = false;
        if (err.status === 409) {
          const override = confirm(
            (err.error?.message || 'Date conflict detected!') +
            '\n\nDo you want to override and book anyway?'
          );
          if (override) {
            payload.overrideConflicts = true;
            const retryReq = this.isEdit
              ? this.api.put(`/events/${this.eventId}`, payload)
              : this.api.post('/events', payload);
            retryReq.subscribe({
              next: () => this.router.navigate(['/bookings']),
              error: () => alert('Failed to save event.')
            });
          }
        } else {
          alert('Failed to save event. ' + (err.error?.message || ''));
        }
      }
    });
  }

  cancel() {
    this.router.navigate(['/bookings']);
  }
}
