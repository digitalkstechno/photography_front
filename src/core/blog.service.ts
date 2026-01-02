import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HealthAdviceService {

  private baseUrl = environment.apiUrl + '/blogs';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  /* =====================
     📱 LIST (USER)
     GET /health
     ===================== */
  getHealthAdviceCards(): Observable<any[]> {
    return this.http.get<any[]>(
      this.baseUrl,
      { headers: this.getHeaders() }
    );
  }

  /* =====================
     📄 DETAIL (USER)
     GET /health/:slug
     ===================== */
  getHealthAdviceDetail(slug: string): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/${slug}`,
      { headers: this.getHeaders() }
    );
  }

  /* =====================
     🛠 CREATE (ADMIN)
     POST /health
     ===================== */
  createHealthAdvice(data: any): Observable<any> {
    return this.http.post(
      this.baseUrl,
      data,
      { headers: this.getHeaders() }
    );
  }
}
