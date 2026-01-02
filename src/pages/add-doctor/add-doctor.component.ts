import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AdminDoctorService } from '../../core/doctormangment/doctor-managment.service';
import { FormField } from '../../shared/dynamic-form/form.types';
import { DynamicFormComponent } from '../../shared/dynamic-form/dynamic-form.component';

@Component({
  selector: 'app-add-doctor',
  standalone: true,
  imports: [CommonModule, DynamicFormComponent],
  templateUrl: './add-doctor.component.html',
  styleUrls: ['./add-doctor.component.css'] // ✅ THIS
})
export class AddDoctorComponent {

  submitLabel = 'Create Doctor';

  model: any = {
    name: '',
    email: '',
    password: '',
    age: null,
    specialization: '',
    clinicAddress: ''
  };

  fields: FormField[] = [
    {
      key: 'name',
      label: 'Full Name',
      type: 'text',
      required: true,
      class: 'input',
      wrapperClass: 'col-6'
    },
    {
      key: 'email',
      label: 'Email',
      type: 'email',
      required: true,
      class: 'input',
      wrapperClass: 'col-6'
    },
    {
      key: 'password',
      label: 'Password',
      type: 'password',
      required: true,
      class: 'input',
      wrapperClass: 'col-3'
    },
    {
      key: 'clinicAddress',
      label: 'Clinic Address',
      type: 'textarea',
      class: 'textarea',
      wrapperClass: 'col-12'
    }
  ];

  constructor(
    private service: AdminDoctorService,
    private router: Router
  ) { }

  // 🔑 passed into dynamic form
  submitDoctor = async (data: any) => {
    await this.service.createDoctor(data)
    this.router.navigate(['/admin/doctors']);
  };
}
  