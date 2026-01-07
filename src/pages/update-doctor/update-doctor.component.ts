import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';

import { UserService } from '../../core/user/user.service';
import { AdminDoctorService } from '../../core/doctormangment/doctor-managment.service';
import { FormField } from '../../shared/dynamic-form/form.types';
import { DynamicFormComponent } from '../../shared/dynamic-form/dynamic-form.component';

@Component({
  selector: 'app-update-doctor',
  standalone: true,
  imports: [CommonModule, DynamicFormComponent],
  templateUrl: './update-doctor.component.html'
})
export class UpdateDoctorComponent implements OnInit {

  doctorId!: string; // 👈 this IS userId
  submitLabel = 'Update Doctor';

  model: any = {
    name: '',
    email: '',
    profile: {
      specialization: '',
      qualification: '',
      experienceYears: null,
      consultationFee: null
    }
  };

  loaded = false;

  fields: FormField[] = [
    // USER (OLD – unchanged)
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

    // DOCTOR PROFILE (NEW – optional)
    {
      key: 'profile.specialization',
      label: 'Specialization',
      type: 'text',
      class: 'input',
      wrapperClass: 'col-6'
    },
    {
      key: 'profile.qualification',
      label: 'Qualification',
      type: 'text',
      class: 'input',
      wrapperClass: 'col-6'
    },
    {
      key: 'profile.experienceYears',
      label: 'Experience (Years)',
      type: 'number',
      class: 'input',
      wrapperClass: 'col-4'
    },
    {
      key: 'profile.consultationFee',
      label: 'Consultation Fee',
      type: 'number',
      class: 'input',
      wrapperClass: 'col-4'
    }
  ];

  constructor(
    private userService: UserService,
    private adminDoctorService: AdminDoctorService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.doctorId = id;
    this.loadDoctor();
  }

  /**
   * Load doctor by USER ID
   * (User + DoctorProfile)
   */
  loadDoctor() {
    this.adminDoctorService.getDoctorById(this.doctorId).subscribe(res => {
      this.model = {
        name: res.name || '',
        email: res.email || '',
        profile: {
          specialization: res.profile?.specialization || '',
          qualification: res.profile?.qualification || '',
          experienceYears: res.profile?.experienceYears ?? null,
          consultationFee: res.profile?.consultationFee ?? null
        }
      };
      this.loaded = true;
    });
  }

  /**
   * Update:
   * 1️⃣ User (name, email)  ← OLD behavior preserved
   * 2️⃣ DoctorProfile using USER ID
   */
  submitDoctor = async (data: any) => {

    // 1️⃣ UPDATE USER (OLD – unchanged)
    await firstValueFrom(
      this.userService.updateUser(this.doctorId, {
        name: data.name,
        email: data.email
      })
    );

    // 2️⃣ UPDATE DOCTOR PROFILE (NEW)
    if (data.profile && Object.keys(data.profile).length) {
      await firstValueFrom(
        this.adminDoctorService.updateDoctorProfile(
          this.doctorId,   // 👈 USER ID
          data.profile
        )
      );
    }

    this.router.navigate(['/admin/doctors']);
  };
}
