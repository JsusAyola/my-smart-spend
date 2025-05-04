import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Expense {
  _id?: string;
  title: string;
  amount: number;
  category: string;
  emotion: string;
  date?: string;
}

@Injectable({ providedIn: 'root' })
export class ExpenseService {
  private url = 'http://localhost:3000/expenses';

  constructor(private http: HttpClient) {}

  list(): Observable<Expense[]> {
    return this.http.get<Expense[]>(this.url);
  }

  create(payload: Expense): Observable<Expense> {
    return this.http.post<Expense>(this.url, payload);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.url}/${id}`);
  }
}
