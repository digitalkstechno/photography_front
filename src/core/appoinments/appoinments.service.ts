// core/services/appointments.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../http/api.service';

interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  date?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AppointmentsService {

  private readonly BASE_URL = '/appointments';

  constructor(private api: ApiService) { }

  /* ======================
     USER / PATIENT
  ====================== */

  createAppointment(payload: any): Observable<any> {
    return this.api.post(this.BASE_URL, payload);
  }

  getMyAppointments(): Observable<any> {
    // MUST match backend route: router.get("/me", ...)
    return this.api.get(`${this.BASE_URL}/me`);
  }

  cancelAppointment(id: string, reason: string): Observable<any> {
    return this.api.patch(`${this.BASE_URL}/${id}/cancel`, { reason });
  }

  /* ======================
     DOCTOR
  ====================== */

  getAppointments(params?: PaginationParams): Observable<any> {
    return this.api.get(`${this.BASE_URL}/`);
  }

  updateAppointmentStatus(id: string, status: string): Observable<any> {
    return this.api.patch(`${this.BASE_URL}/${id}/status`, { status });
  }

  /* ======================
     SHARED
  ====================== */

  getAppointmentById(id: string): Observable<any> {
    return this.api.get(`${this.BASE_URL}/${id}`);
  }
}
