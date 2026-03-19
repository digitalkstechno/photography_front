import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly API_URL = environment.apiUrl;
  private readonly TOKEN_KEY = 'token';
  private readonly USER_KEY = 'user';

  constructor(private http: HttpClient) {}

  login(credentials: { email: any; password: any }) {
    return this.http
      .post<any>(`${this.API_URL}/auth/login`, credentials)
      .pipe(
        tap(res => {
          // Backend returns { success, data: { user, token }, message }
          const token = res?.data?.token || res?.token;
          const user = res?.data?.user || res?.user;
          if (token) this.setToken(token);
          if (user) localStorage.setItem(this.USER_KEY, JSON.stringify(user));
        })
      );
  }

  private setToken(token: string) {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getUser(): any {
    const raw = localStorage.getItem(this.USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  getUserRole(): string {
    return this.getUser()?.role || '';
  }
}
