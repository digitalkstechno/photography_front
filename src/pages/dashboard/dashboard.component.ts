import { AppointmentsService } from './../../core/appoinments/appoinments.service';
import { Component } from '@angular/core';
import { TableComponent } from "../../shared/components/table/table.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [TableComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  constructor(private appointmentService: AppointmentsService) { }

  // Common columns for all appointment tables
  appointmentColumns = [
  { key: 'patient.name', label: 'Patient' },
  { key: 'doctorId', label: 'Doctor' },
  { key: 'appointmentDate', label: 'Date' },
  { key: 'timeSlot.startTime', label: 'From' },
  { key: 'timeSlot.endTime', label: 'To' },
  { key: 'status', label: 'Status' },
]
  // Generic fetch function (status-based)
  fetchByStatus = (status: string) => {
    return (params: any) => {
      return this.appointmentService.getAppointments({
        ...params,
        status
      }).toPromise();
    };
  };
}
