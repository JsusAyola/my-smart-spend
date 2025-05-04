import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExpenseService,Expense } from '../../services/expense.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-expense',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.scss']
})
export class ExpenseComponent {
  form: FormGroup;
  categories = [
    'Alimentación', 'Transporte', 'Salud', 'Entretenimiento',
    'Educación', 'Hogar', 'Deudas', 'Ahorro', 'Otros'
  ];
  emotions = [
    'Por obligación', 'Por placer', 'Por estrés o ansiedad',
    'Por metas', 'Por presión social', 'Por crecimiento personal'
  ];

  constructor(
    private fb: FormBuilder,
    private expenseService: ExpenseService,
    private router: Router
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      amount: [null, [Validators.required, Validators.min(0.01)]],
      category: ['', Validators.required],
      emotion: ['', Validators.required],
      date: [new Date().toISOString().substring(0, 10), Validators.required]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }
    this.expenseService.create(this.form.value as Expense)
      .subscribe(() => this.router.navigate(['/expenses/list']));
  }
}
