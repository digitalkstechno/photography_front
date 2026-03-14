import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly API_URL = environment.apiUrl; // change this
  private readonly TOKEN_KEY = 'token';

  constructor(private http: HttpClient) {}

  /**
   * Call backend login API and store token
   */
  login(credentials: { email: any; password: any }) {
    return this.http
      .post<{ token: string }>(
        `${this.API_URL}/auth/login`,
        credentials
      )
      .pipe(
        tap(res => {
          this.setToken(res.token);
        })
      );
  }

  /**
   * Store token
   */
  private setToken(token: string) {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  /**
   * Remove token
   */
  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  /**
   * Check login state
   */
  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Used by HTTP interceptor
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }
}
