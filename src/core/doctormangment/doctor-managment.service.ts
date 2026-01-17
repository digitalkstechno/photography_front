import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminDoctorService {

  private baseUrl = environment.apiUrl + '/admin/doctor';

  constructor(private http: HttpClient) {}

  /* =======================
     HEADERS
     ======================= */
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  /* =======================
     CREATE
     ======================= */

  /**
   * POST /admin/doctor
   */
  createDoctor(payload: any): Promise<any> {
    return firstValueFrom(
      this.http.post(
        this.baseUrl,
        payload,
        { headers: this.getHeaders() }
      )
    );
  }

  /* =======================
     READ
     ======================= */

  /**
   * GET /admin/doctor
   */
  listDoctors(): Observable<any[]> {
    return this.http.get<any[]>(
      this.baseUrl,
      { headers: this.getHeaders() }
    );
  }

  /**
   * GET /admin/doctor/:userId
   */
  getDoctorById(userId: string): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/${userId}`,
      { headers: this.getHeaders() }
    );
  }

  /* =======================
     UPDATE USER
     ======================= */

  /**
   * PUT /admin/doctor/:userId
   */
  updateDoctorUser(userId: string, payload: any): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/${userId}`,
      payload,
      { headers: this.getHeaders() }
    );
  }

  /* =======================
     UPDATE PROFILE
     ======================= */

  /**
   * PUT /admin/doctor/:userId/profile/:profileId
   */
  updateDoctorProfile(
    userId: string,
    profileId: string,
    payload: any
  ): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/${userId}/profile/${profileId}`,
      payload,
      { headers: this.getHeaders() }
    );
  }

  /* =======================
     READ PROFILE
     ======================= */

  /**
   * GET /admin/doctor/:userId/profile/:profileId
   */
  getDoctorProfileByUserId(
    userId: string,
    profileId: string
  ): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/${userId}/profile/${profileId}`,
      { headers: this.getHeaders() }
    );
  }
}
