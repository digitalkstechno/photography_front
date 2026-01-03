import { Component } from '@angular/core';
import { AppointmentsService } from './../../core/appoinments/appoinments.service';
import { TableComponent } from '../../shared/components/table/table.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [TableComponent],
  template: `
    <app-table
      [columns]="appointmentColumns"
      [fetchFn]="fetchAppointments">
    </app-table>
  `,
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  constructor(private appointmentService: AppointmentsService) {}

  // ✅ Columns using populated doctor → profile
  appointmentColumns = [
    { key: 'patient.name', label: 'Patient' },
    { key: 'doctor.profile.name', label: 'Doctor' },
    { key: 'doctor.profile.specialization', label: 'Specialization' },
    { key: 'appointmentDate', label: 'Date' },
    { key: 'timeSlot.startTime', label: 'From' },
    { key: 'timeSlot.endTime', label: 'To' },
    { key: 'status', label: 'Status' },
  ];

  // ✅ Single fetch function
  fetchAppointments = (params: any) => {
    return this.appointmentService
      .getAppointments({
        page: params?.page,
        limit: params?.limit,
        search: params?.search
      })
      .toPromise();
  };
}
