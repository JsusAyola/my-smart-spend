import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:3000/auth';  // Asegúrate de que esta URL es la correcta para tu backend

  constructor(private http: HttpClient) {}

  // Obtener perfil del usuario
  getUserProfile(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/me`);
  }

// Método para actualizar el plan del usuario
updateUserPlan(
  plan: 'free' | 'student' | 'premium',
  subscription: 'monthly' | 'annual' = 'monthly'
) {
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  return this.http.put<any>(
    'http://localhost:3000/auth/update-plan',
    { plan, subscription },
    { headers }
  );
}
}
