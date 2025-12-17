// core/auth/auth.service.ts
@Injectable({ providedIn: 'root' })
export class AuthService {
  login(token: string) {
    localStorage.setItem('token', token);
  }

  logout() {
    localStorage.removeItem('token');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}
