import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';

import { AdminDoctorService } from '../../core/doctormangment/doctor-managment.service';
import { UserService } from '../../core/user/user.service';
import { FormField } from '../../shared/dynamic-form/form.types';
import { DynamicFormComponent } from '../../shared/dynamic-form/dynamic-form.component';

@Component({
  selector: 'app-update-doctor',
  standalone: true,
  imports: [CommonModule, DynamicFormComponent],
  templateUrl: './update-doctor.component.html'
})
export class UpdateDoctorComponent implements OnInit {

  doctorId!: string;
  submitLabel = 'Update Doctor';

  model: any = {
    name: '',
    email: '',
    profile: {
      specialization: '',
      qualification: '',
      experienceYears: null,
      consultationFee: null,
      contact: { phone: '' },
      address: { city: '' }
    }
  };
  loaded = false;

  fields: FormField[] = [
    // 🔹 USER (global)
    { key: 'name', label: 'Full Name', type: 'text', required: true, class: 'input', wrapperClass: 'col-6' },
    { key: 'email', label: 'Email', type: 'email', required: true, class: 'input', wrapperClass: 'col-6' },

    // 🔹 DOCTOR PROFILE
    { key: 'profile.specialization', label: 'Specialization', type: 'text', class: 'input', wrapperClass: 'col-4' },
    { key: 'profile.qualification', label: 'Qualification', type: 'text', class: 'input', wrapperClass: 'col-4' },
    { key: 'profile.experienceYears', label: 'Experience (Years)', type: 'number', class: 'input', wrapperClass: 'col-2' },
    { key: 'profile.consultationFee', label: 'Consultation Fee (₹)', type: 'number', class: 'input', wrapperClass: 'col-2' },

    { key: 'profile.contact.phone', label: 'Contact Number', type: 'text', class: 'input', wrapperClass: 'col-4' },
    { key: 'profile.address.city', label: 'City', type: 'text', class: 'input', wrapperClass: 'col-4' }
  ];

  constructor(
    private userService: UserService,
    private doctorService: AdminDoctorService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;
    this.doctorId = id;
    this.loadDoctor();
  }

  loadDoctor() {
    this.doctorService.getDoctorById(this.doctorId).subscribe(res => {
      this.model = {
        name: res.name || '',
        email: res.email || '',
        profile: {
          specialization: res.profile?.specialization || '',
          qualification: res.profile?.qualification || '',
          experienceYears: res.profile?.experienceYears ?? null,
          consultationFee: res.profile?.consultationFee ?? null,
          contact: { phone: res.profile?.contact?.phone || '' },
          address: { city: res.profile?.address?.city || '' }
        }
      };
      this.loaded = true;
    });
  }

  submitDoctor = async (data: any) => {
    console.log('SUBMIT DATA 👉', data);

    // =========================
    // 1️⃣ UPDATE USER
    // =========================
    const userPayload: any = {};
    if (data.name !== undefined) userPayload.name = data.name;
    if (data.email !== undefined) userPayload.email = data.email;

    if (Object.keys(userPayload).length) {
      await firstValueFrom(
        this.userService.updateUser(this.doctorId, userPayload)
      );
    }

    // =========================
    // 2️⃣ UPDATE DOCTOR PROFILE
    // =========================
    if (data.profile && Object.keys(data.profile).length) {
      await firstValueFrom(
        this.doctorService.updateDoctorProfile(
          this.doctorId,
          data.profile
        )
      );
    }

    console.log('UPDATE API DONE ✅');
    this.router.navigate(['/admin/doctors']);
  };
}
