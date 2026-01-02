import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
export interface DoctorProfile {
  specialization?: string;
  clinicAddress?: string;
}

export interface Doctor {
  _id: string;
  name: string;
  email: string;
  age?: number;
  role: 'DOCTOR';
  profile?: DoctorProfile;
}


@Injectable({
  providedIn: 'root'
})
export class AdminDoctorService {
  private baseUrl = environment.apiUrl + '/admin/doctor/';

  constructor(private http: HttpClient) { }

  /**
   * Attach JWT token
   */
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  /* =======================
     CREATE
     ======================= */

  /**
   * POST /admin/doctor
   * Create doctor (User + DoctorProfile)
   */
  createDoctor(data: {
    name: string;
    email: string;
    password: string;
    age: number;
    specialization?: string;
    clinicAddress?: string;
  }): Observable<{ userId: string; profile: DoctorProfile }> {

    const payload = {
      name: data.name,
      email: data.email,
      password: data.password,
      age: data.age,
      profile: {
        specialization: data.specialization,
        clinicAddress: data.clinicAddress
      }
    };

    return this.http.post<{ userId: string; profile: DoctorProfile }>(
      this.baseUrl,
      payload,
      { headers: this.getHeaders() }
    );
  }

  /* =======================
     READ
     ======================= */

  /**
   * GET /admin/doctor
   * LIST doctors (Admin table)
   */
  listDoctors(): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(
      this.baseUrl,
      { headers: this.getHeaders() }
    );
  }

  /**
   * GET /admin/doctor/:userId
   * Get SINGLE doctor
   */
  getDoctorById(userId: string): Observable<Doctor> {
    return this.http.get<Doctor>(
      `${this.baseUrl}/${userId}`,
      { headers: this.getHeaders() }
    );
  }

  /* =======================
     UPDATE
     ======================= */

  /**
   * PUT /admin/doctor/:userId/profile
   * Update doctor profile ONLY
   */
  updateDoctorProfile(
    userId: string,
    profile: DoctorProfile
  ): Observable<{ profile: DoctorProfile; updated: boolean }> {
    return this.http.put<{ profile: DoctorProfile; updated: boolean }>(
      `${this.baseUrl}/${userId}/profile`,
      profile,
      { headers: this.getHeaders() }
    );
  }
}
