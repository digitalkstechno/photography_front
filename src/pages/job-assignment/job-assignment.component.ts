import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../core/http/api.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-job-assignment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './job-assignment.component.html',
  styleUrls: ['./job-assignment.component.css']
})
export class JobAssignmentComponent implements OnInit {

  form: FormGroup;
  booking: any = null;
  bookingId: string | null = null;
  jobId: string | null = null;
  loading = false;
  saving = false;

  // Master Data
  allPersonnel: any[] = [];
  roles = ["CANDID", "VIDEO", "DRONE", "DSLR", "EDITOR", "ASSISTANT", "OTHER"];

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      event: ['', Validators.required],
      status: ['PENDING'],
      notes: [''],
      assignedUsers: this.fb.array([]),
      totalCost: [{ value: 0, disabled: true }]
    });
  }

  get assignedUsers(): FormArray {
    return this.form.get('assignedUsers') as FormArray;
  }

  async ngOnInit() {
    this.loading = true;
    this.bookingId = this.route.snapshot.paramMap.get('bookingId');
    this.jobId = this.route.snapshot.paramMap.get('id');
    
    if (this.bookingId) {
      await this.loadBooking(this.bookingId);
      await this.loadJobByBooking(this.bookingId);
    } else if (this.jobId) {
      await this.loadJobById(this.jobId);
    } else {
      await this.loadConfirmedBookings();
      this.addAssignment();
    }

    await this.fetchPersonnel();

    this.loading = false;
    this.form.valueChanges.subscribe(() => this.calculateTotalCost());
  }

  async fetchPersonnel() {
    try {
      const [staffRes, freelancerRes]: any = await Promise.all([
        firstValueFrom(this.api.get('/auth/users')),
        firstValueFrom(this.api.get('/freelancers'))
      ]);

      const staff = (staffRes.data || []).map((s: any) => ({
        ...s,
        displayName: `[Staff] ${s.name}`,
        sourceType: 'user'
      }));

      const freelancers = (freelancerRes.data?.data || freelancerRes.data || []).map((f: any) => ({
        ...f,
        displayName: `[Crew] ${f.name}`,
        sourceType: 'freelancer'
      }));

      this.allPersonnel = [...staff, ...freelancers];
    } catch (err) {
      console.error('Error fetching personnel', err);
      this.allPersonnel = [];
    }
  }

  confirmedBookings: any[] = [];
  async loadConfirmedBookings() {
    try {
      const res: any = await firstValueFrom(this.api.get('/events?status=CONFIRMED'));
      this.confirmedBookings = res.data?.data || res.data || [];
    } catch { this.confirmedBookings = []; }
  }

  async loadJobById(id: string) {
    try {
      const res: any = await firstValueFrom(this.api.get(`/jobs/${id}`));
      const job = res.data || res;
      this.form.patchValue({
        event: job.event?._id || job.event,
        status: job.status,
        notes: job.notes
      });
      this.assignedUsers.clear();
      job.assignedUsers.forEach((a: any) => this.addAssignment(a));
      
      if (job.event) {
        await this.loadBooking(job.event._id || job.event);
      }
    } catch (err) {
      console.error('Error loading job by ID', err);
    }
  }

  async loadBooking(id: string) {
    try {
      const res: any = await firstValueFrom(this.api.get(`/events/${id}`));
      this.booking = res.data || res;
      this.form.patchValue({ event: id });
    } catch (err) {
      console.error('Error loading booking', err);
    }
  }

  async loadJobByBooking(bookingId: string) {
    try {
      const res: any = await firstValueFrom(this.api.get(`/jobs?event=${bookingId}`));
      const jobs = res.data?.data || res.data || [];
      if (jobs.length > 0) {
        const job = jobs[0];
        this.jobId = job._id;
        this.form.patchValue({ status: job.status, notes: job.notes });
        this.assignedUsers.clear();
        job.assignedUsers.forEach((a: any) => this.addAssignment(a));
      } else {
        this.addAssignment();
      }
    } catch (err) {
      console.error('Error loading job', err);
    }
  }

  addAssignment(data: any = {}) {
    // Determine the original selected person's ID (user or freelancer)
    const personId = data.user?._id || data.user || data.freelancer?._id || data.freelancer || '';
    
    const group = this.fb.group({
      personId: [personId, Validators.required],
      role: [data.role || '', Validators.required],
      chargePerDay: [data.chargePerDay || 0, [Validators.required, Validators.min(0)]],
      days: [data.days || 1, [Validators.required, Validators.min(1)]],
      totalCharge: [{ value: data.totalCharge || 0, disabled: true }]
    });

    // Auto-fill logic when person changes
    group.get('personId')?.valueChanges.subscribe(val => {
      const found = this.allPersonnel.find(p => p._id === val);
      if (found && found.sourceType === 'freelancer') {
        group.patchValue({ 
          chargePerDay: found.chargePerDay,
          role: found.skill 
        });
      }
    });

    this.assignedUsers.push(group);
  }

  removeAssignment(index: number) {
    this.assignedUsers.removeAt(index);
  }

  calculateTotalCost() {
    let total = 0;
    this.assignedUsers.controls.forEach((ctrl: any) => {
      const g = ctrl.controls;
      const charge = g.chargePerDay.value || 0;
      const days = g.days.value || 1;
      const rowTotal = charge * days;
      g.totalCharge.setValue(rowTotal, { emitEvent: false });
      total += rowTotal;
    });
    this.form.get('totalCost')?.setValue(total, { emitEvent: false });
  }

  async save() {
    if (this.form.invalid) {
      alert('Please fill all required fields correctly.');
      return;
    }

    const raw = this.form.getRawValue();
    const payload = {
      ...raw,
      assignedUsers: raw.assignedUsers.map((a: any) => {
        // Find if the selected person was a staff or freelancer to correctly map to the backend
        const person = this.allPersonnel.find(p => p._id === a.personId);
        return {
          user: person?.sourceType === 'user' ? a.personId : null,
          freelancer: person?.sourceType === 'freelancer' ? a.personId : null,
          role: a.role,
          chargePerDay: a.chargePerDay,
          days: a.days,
          totalCharge: a.chargePerDay * a.days
        };
      })
    };

    this.saving = true;
    try {
      if (this.jobId) {
        await firstValueFrom(this.api.put(`/jobs/${this.jobId}`, payload));
      } else {
        await firstValueFrom(this.api.post('/jobs', payload));
      }
      alert('Team assignments saved successfully!');
      this.router.navigate(['/admin/bookings']);
    } catch (err: any) {
      alert('Error saving assignments: ' + (err.error?.message || 'Unknown error'));
    } finally {
      this.saving = false;
    }
  }
}
