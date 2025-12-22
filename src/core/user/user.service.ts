// core/services/user.service.ts
import { Injectable } from '@angular/core';
import { ApiService } from '../http/api.service';
import { Observable } from 'rxjs';

interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private api: ApiService) {}

  register(payload: any): Observable<any> {
    return this.api.post('/user/register', payload);
  }

  verifyOtpAndSetPassword(payload: any): Observable<any> {
    return this.api.post('/user/verify-otp', payload);
  }

  login(payload: any): Observable<any> {
    return this.api.post('/user/login', payload);
  }

  getUsers(params?: PaginationParams): Observable<any> {
    return this.api.get('/user', params);
  }

  getUserById(id: string): Observable<any> {
    return this.api.get(`/user/${id}`);
  }

  deleteUser(id: string): Observable<any> {
    return this.api.delete(`/user/${id}`);
  }
}
