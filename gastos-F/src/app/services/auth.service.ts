import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: any;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = 'http://localhost:3000/auth';
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: any
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  register(data: any) {
    return this.http.post<AuthResponse>(`${this.baseUrl}/register`, data)
      .pipe(
        tap(res => {
          if (res.success && this.isBrowser) {
            localStorage.setItem('authToken', res.token);
            localStorage.setItem('user', JSON.stringify(res.user));
          }
        })
      );
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, { email, password })
      .pipe(
        tap(res => {
          if (res.success && this.isBrowser) {
            localStorage.setItem('authToken', res.token);
            localStorage.setItem('user', JSON.stringify(res.user));
          }
        })
      );
  }

  logout() {
    if (this.isBrowser) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
    this.router.navigate(['/auth/login']);
  }

  isLoggedIn(): boolean {
    if (!this.isBrowser) return false;
    return !!localStorage.getItem('authToken');
  }

  getUser(): any {
    if (!this.isBrowser) return null;
    return JSON.parse(localStorage.getItem('user') || 'null');
  }
}