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

    // profile basics
    specialization: '',
    qualification: '',
    experienceYears: null,
    consultationFee: null,

    // contact & address (simple)
    phone: '',
    city: ''
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

    // 🔹 PROFILE (20% important)
    {
      key: 'specialization',
      label: 'Specialization',
      type: 'text',
      required: true,
      class: 'input',
      wrapperClass: 'col-4'
    },
    {
      key: 'qualification',
      label: 'Qualification',
      type: 'text',
      class: 'input',
      wrapperClass: 'col-4'
    },
    {
      key: 'experienceYears',
      label: 'Experience (Years)',
      type: 'number',
      class: 'input',
      wrapperClass: 'col-2'
    },
    {
      key: 'consultationFee',
      label: 'Consultation Fee (₹)',
      type: 'number',
      class: 'input',
      wrapperClass: 'col-2'
    },

    // 🔹 CONTACT / ADDRESS (minimal)
    {
      key: 'phone',
      label: 'Contact Number',
      type: 'text',
      class: 'input',
      wrapperClass: 'col-4'
    },
    {
      key: 'city',
      label: 'City',
      type: 'text',
      class: 'input',
      wrapperClass: 'col-4'
    }
  ];

  constructor(
    private service: AdminDoctorService,
    private router: Router
  ) { }

  // 🔑 passed into dynamic form
submitDoctor = async (data: any) => {
  const payload = {
    name: data.name,
    email: data.email,
    password: data.password,
    profile: {
      specialization: data.specialization,
      qualification: data.qualification,
      experienceYears: data.experienceYears,
      consultationFee: data.consultationFee,
      contact: { phone: data.phone },
      address: { city: data.city }
    }
  };

  console.log('PAYLOAD SENT 👉', payload); // 🔴 MUST ADD

  await this.service.createDoctor(payload);
  this.router.navigate(['/admin/doctors']);
};


}
