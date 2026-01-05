import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AdminDoctorService } from '../../core/doctormangment/doctor-managment.service';
import { FormField } from '../../shared/dynamic-form/form.types';
import { DynamicFormComponent } from '../../shared/dynamic-form/dynamic-form.component';
import { firstValueFrom } from 'rxjs';
@Component({
  selector: 'app-update-doctor',
  standalone: true,
  imports: [CommonModule, DynamicFormComponent],
  templateUrl: './update-doctor.component.html'
}) export class UpdateDoctorComponent implements OnInit {

  doctorId!: string;
  submitLabel = 'Update Doctor';

  model: any = null;     // 🔑 start as null
  loaded = false;        // 🔑 add flag

  fields: FormField[] = [
    { key: 'name', label: 'Full Name', type: 'text', required: true, class: 'input', wrapperClass: 'col-6' },
    { key: 'email', label: 'Email', type: 'email', required: true, class: 'input', wrapperClass: 'col-6' },

    { key: 'profile.specialization', label: 'Specialization', type: 'text', class: 'input', wrapperClass: 'col-4' },
    { key: 'profile.qualification', label: 'Qualification', type: 'text', class: 'input', wrapperClass: 'col-4' },
    { key: 'profile.experienceYears', label: 'Experience (Years)', type: 'number', class: 'input', wrapperClass: 'col-2' },
    { key: 'profile.consultationFee', label: 'Consultation Fee (₹)', type: 'number', class: 'input', wrapperClass: 'col-2' },

    { key: 'profile.contact.phone', label: 'Contact Number', type: 'text', class: 'input', wrapperClass: 'col-4' },
    { key: 'profile.address.city', label: 'City', type: 'text', class: 'input', wrapperClass: 'col-4' }
  ];

  constructor(
    private service: AdminDoctorService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.doctorId = this.route.snapshot.paramMap.get('id')!;
    this.loadDoctor();
  }

  loadDoctor() {
    this.service.getDoctorById(this.doctorId).subscribe(res => {
      console.log('API DATA 👉', res); // sanity check
      this.model = res;
      this.loaded = true;            // 🔑 mark ready
    });
  }

  submitDoctor = async (data: any) => {
    console.log('SUBMIT DATA 👉', data);

    await firstValueFrom(
      this.service.updateDoctorProfile(
        this.doctorId,
        data.profile   // 🔑 ONLY profile
      )
    );

    console.log('UPDATE API DONE ✅');
    this.router.navigate(['/admin/doctors']);
  };

}
