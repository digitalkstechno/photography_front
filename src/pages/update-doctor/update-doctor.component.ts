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
  profileId!: string;
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
  ) { }

  ngOnInit() {
    const userId = this.route.snapshot.paramMap.get('userId');
    const profileId = this.route.snapshot.paramMap.get('profileId');

    if (!userId || !profileId) return;

    this.doctorId = userId;
    this.profileId = profileId;

    this.loadDoctor();
  }


  /**
   * Load doctor by USER ID
   * (User + DoctorProfile)
   */
  loadDoctor() {
    this.adminDoctorService
      .getDoctorProfileByUserId(this.doctorId, this.profileId)
      .subscribe(res => {

        const profile = res.profile || {};
        const user = profile.userId || {};

        this.model = {
          name: user.name || '',
          email: user.email || '',
          profile: {
            specialization: profile.specialization || '',
            qualification: profile.qualification || '',
            experienceYears: profile.experienceYears ?? null,
            consultationFee: profile.consultationFee ?? null
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
      this.adminDoctorService.updateDoctorUser(this.doctorId, {
        name: data.name,
        email: data.email
      })
    );

    // 2️⃣ UPDATE DOCTOR PROFILE (NEW)
    if (data.profile && Object.keys(data.profile).length) {
      await firstValueFrom(
        this.adminDoctorService.updateDoctorProfile(
          this.doctorId,
          this.profileId,   // 👈 USER ID
          data.profile
        )
      );
    }

    this.router.navigate(['/admin/doctors']);
  };
}
