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
    // Basic
    { key: 'profile.name', label: 'Doctor Name' },
    { key: 'email', label: 'Email' },
    { key: 'status', label: 'Status' },

    // Professional Info
    { key: 'profile.specialization', label: 'Specialization' },
    { key: 'profile.qualification', label: 'Qualification' },
    { key: 'profile.experienceYears', label: 'Experience (Years)' },
    // Fees & Department
    { key: 'profile.consultationFee', label: 'Consultation Fee (₹)' },
    // Metadata
  ];

  constructor(
    private adminDoctorService: AdminDoctorService,
    private router: Router
  ) { }

  /**
   * ✅ Required by <app-table>
   * - Must return Promise
   * - Accepts params for future pagination/search
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
   * ✅ Used by TableComponent (NO arrow functions in template)
   */
  getUpdateRoute(row: any): string {
    return `/admin/doctors/edit/${row._id}`;
  }
}
