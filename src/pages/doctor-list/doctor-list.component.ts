import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AdminDoctorService } from '../../core/doctormangment/doctor-managment.service';
import { TableComponent } from "../../shared/components/table/table.component";

@Component({
  selector: 'app-doctor-list',
  templateUrl: './doctor-list.component.html',
  imports: [TableComponent],
})
export class DoctorListComponent {

  // ✅ columns (nested keys supported by your table)
  columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'profile.specialization', label: 'Specialization' },
    { key: 'profile.clinicAddress', label: 'Clinic Address' }
  ];

  constructor(
    private adminDoctorService: AdminDoctorService,
    private router: Router
  ) {}

  /**
   * ✅ REQUIRED BY <app-table>
   * Must return Promise
   * Must accept params (even if unused)
   */
  fetchDoctors = async (_params: any): Promise<any[]> => {
    try {
      // Angular HttpClient → Observable → Promise
      const doctors = await this.adminDoctorService
        .listDoctors()
        .toPromise();

      return doctors ?? [];
    } catch (err) {
      console.error('Failed to fetch doctors', err);
      return [];
    }
  };

  addDoctor() {
    this.router.navigate(['/admin/doctors/add']);
  }

  editDoctor(row: any) {
    this.router.navigate(['/admin/doctors/edit', row._id]);
  }
}
