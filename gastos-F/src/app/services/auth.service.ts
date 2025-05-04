import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser }               from '@angular/common';
import { HttpClient, HttpHeaders }         from '@angular/common/http';
import { Router }                          from '@angular/router';
import { BehaviorSubject, Observable }     from 'rxjs';
import { tap, map }                        from 'rxjs/operators';

export interface AuthResponse {
  success: boolean;
  message: string;
  token:   string;
  user:    any;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl    = 'http://localhost:3000/auth';
  private isBrowser: boolean;

  // ← BehaviorSubject para emitir el user actual
  private userSubject = new BehaviorSubject<any>(null);
  public  user$       = this.userSubject.asObservable();

  constructor(
    private http:   HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: any
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    // Si hay user en localStorage al arrancar, emítelo
    const stored = this.getUser();
    if (stored) {
      this.userSubject.next(stored);
    }
  }

  private saveSession(res: AuthResponse) {
    if (res.success && this.isBrowser) {
      localStorage.setItem('authToken', res.token);
      localStorage.setItem('user', JSON.stringify(res.user));
      this.userSubject.next(res.user);             // ← emito el nuevo user
    }
  }

  register(data: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/register`, data)
      .pipe(tap(res => this.saveSession(res)));
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, { email, password })
      .pipe(tap(res => this.saveSession(res)));
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
    this.userSubject.next(null);                   // ← emito null
    this.router.navigate(['/auth/login']);
  }

  isLoggedIn(): boolean {
    if (!this.isBrowser) return false;
    return !!localStorage.getItem('authToken');
  }

  getUser(): any {
    if (!this.isBrowser) return null;
    try {
      return JSON.parse(localStorage.getItem('user') || 'null');
    } catch {
      return null;
    }
  }

  getProfile(): Observable<any> {
    const token   = this.isBrowser ? localStorage.getItem('authToken') : '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http
      .get<{ success: boolean; user: any }>(`${this.baseUrl}/me`, { headers })
      .pipe(map(res => res.user));
  }

  updateProfile(changes: {
    firstName?: string;
    lastName?:  string;
    phone?:     string;
    income?:    string;
    goal?:      string;
  }): Observable<any> {
    const token   = this.isBrowser ? localStorage.getItem('authToken') : '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http
      .put<{ success: boolean; user: any }>(
        `${this.baseUrl}/me`,
        changes,
        { headers }
      )
      .pipe(
        tap(res => {
          if (res.success && this.isBrowser) {
            localStorage.setItem('user', JSON.stringify(res.user));
            this.userSubject.next(res.user);       // ← emito el actualizado
          }
        }),
        map(res => res.user)
      );
  }
}
