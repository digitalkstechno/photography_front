import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { AdminDoctorService } from '../../core/doctormangment/doctor-managment.service';
import { TableComponent } from "../../shared/components/table/table.component";

@Component({
  selector: 'app-doctor-list',
  standalone: true,
  imports: [TableComponent],
  templateUrl: './doctor-list.component.html',
})
export class DoctorListComponent {

  // ✅ Table columns (nested keys supported)
  columns = [
    { key: 'name', label: 'Doctor Name' },
    { key: 'email', label: 'Email' },
    { key: 'status', label: 'Status' },

    { key: 'profile.specialization', label: 'Specialization' },
    { key: 'profile.qualification', label: 'Qualification' },
    { key: 'profile.experienceYears', label: 'Experience (Years)' },
    { key: 'profile.consultationFee', label: 'Consultation Fee (₹)' },
  ];

  constructor(
    private adminDoctorService: AdminDoctorService,
    private router: Router
  ) {}

  /**
   * ✅ Required by <app-table>
   */
  fetchDoctors = async (_params: any): Promise<any[]> => {
    try {
      return await firstValueFrom(
        this.adminDoctorService.listDoctors()
      );
    } catch (err) {
      console.error('Failed to fetch doctors', err);
      return [];
    }
  };

  /**
   * ✅ Used by TableComponent
   * FIX: pass profileId also
   */
  getUpdateRoute(row: any): string {
    const userId = row._id;
    const profileId = row.profile?._id;

    // profileId may be null for edge cases
    if (profileId) {
      debugger
      return `/admin/doctors/edit/${userId}/${profileId}`;
    }

    // fallback (still safe)
    return `/admin/doctors/edit/${userId}`;
  }
}
