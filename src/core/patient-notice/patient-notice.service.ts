import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PatientNoticeService {

  private baseUrl = environment.apiUrl + '/patient-notices';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  /* =====================
     CREATE
     ===================== */
  createNotice(data: {
    patientId: string;
    title?: string;
    message: string;
  }): Observable<any> {
    return this.http.post(
      this.baseUrl,
      data,
      { headers: this.getHeaders() }
    );
  }

  /* =====================
     READ
     ===================== */
  getPatientNotices(patientId: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}/patient/${patientId}`,
      { headers: this.getHeaders() }
    );
  }

  getNoticeById(id: string): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/${id}`,
      { headers: this.getHeaders() }
    );
  }

  /* =====================
     UPDATE
     ===================== */
  updateNotice(id: string, data: any): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/${id}`,
      data,
      { headers: this.getHeaders() }
    );
  }

  /* =====================
     DELETE
     ===================== */
  deleteNotice(id: string): Observable<any> {
    return this.http.delete(
      `${this.baseUrl}/${id}`,
      { headers: this.getHeaders() }
    );
  }
}
