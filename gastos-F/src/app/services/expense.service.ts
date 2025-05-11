// src/app/services/expense.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Expense {
  _id?: string;
  title: string;
  amount: number;
  category: string;
  emotion: string;
  date: string;
}

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private apiUrl = 'http://localhost:3000/expenses';  // Asegúrate de que esta URL sea la correcta para tu backend

  constructor(private http: HttpClient) {}

  // Método para obtener un gasto por su ID
  getById(id: string): Observable<Expense> {
    const token = localStorage.getItem('token');  // Obtén el token del usuario desde localStorage
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`); // Si se requiere autenticación

    return this.http.get<Expense>(`${this.apiUrl}/${id}`, { headers });  // Realiza la solicitud GET
  }

  // Método para obtener los gastos del usuario
  getUserExpenses(): Observable<Expense[]> {
    const token = localStorage.getItem('token');  // Obtén el token del usuario desde localStorage

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`); // Si se requiere autenticación

    return this.http.get<Expense[]>(this.apiUrl, { headers });
  }

  // Método para eliminar un gasto por su id
  delete(id: string): Observable<any> {
    const token = localStorage.getItem('token');  // Obtén el token del usuario desde localStorage

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`); // Si se requiere autenticación

    return this.http.delete(`${this.apiUrl}/${id}`, { headers });
  }

  // Método para crear un nuevo gasto
  create(expense: Expense): Observable<any> {
    const token = localStorage.getItem('token');  // Obtén el token del usuario desde localStorage

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`); // Si se requiere autenticación

    return this.http.post<any>(this.apiUrl, expense, { headers });
  }

  // Método para actualizar un gasto existente
  update(id: string, expense: Expense): Observable<any> {
    const token = localStorage.getItem('token');  // Obtén el token del usuario desde localStorage

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`); // Si se requiere autenticación

    return this.http.put(`${this.apiUrl}/${id}`, expense, { headers });  // Realiza la solicitud PUT para actualizar el gasto
  }
}
