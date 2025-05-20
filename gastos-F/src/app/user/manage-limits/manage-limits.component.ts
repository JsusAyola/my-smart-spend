import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExpenseService } from '../../services/expense.service';
import Swal from 'sweetalert2';

interface Limits {
  global: number;
  byCategory: Record<string, number>;
}

interface Expense {
  id?: string;
  amount: number;
  category: string;
  date?: string; // 👈 ahora sí coincide
  description?: string;
}


@Component({
  selector: 'app-manage-limits',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './manage-limits.component.html',
  styleUrls: ['./manage-limits.component.scss']
})
export class ManageLimitsComponent implements OnInit {
  limitsForm: FormGroup;
  totalsByCat: Record<string, number> = {};
  totalThisMonth = 0;
  isLoading = true;
  currentMonth = new Date().toISOString().slice(0, 7);

  categories = [
    'Alimentación', 'Transporte', 'Salud', 'Entretenimiento',
    'Educación', 'Hogar', 'Deudas', 'Ahorro', 'Otros'
  ];

  presetOptions = [
    50000, 100000, 200000, 300000, 500000,
    750000, 1000000, 1500000, 2000000, 3000000, 5000000
  ];

  private STORAGE_KEY = 'smartspend_limits';
  private _originalLimits: Limits = { global: 0, byCategory: {} };

  get originalLimits(): Limits {
    return this._originalLimits;
  }

  constructor(
    private fb: FormBuilder,
    private expenseSvc: ExpenseService
  ) {
    this.limitsForm = this.fb.group({
      global: [null, [Validators.required, Validators.min(10000)]],
      byCategory: this.fb.group(
        this.categories.reduce((acc, category) => {
          acc[category] = [null, Validators.min(0)];
          return acc;
        }, {} as Record<string, any>)
      )
    });
  }

  ngOnInit(): void {
    this.loadLimits();
    this.loadExpenses();
  }

  private loadLimits(): void {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        this._originalLimits = JSON.parse(saved);
        this.limitsForm.patchValue(this._originalLimits);
      }
    } catch (e) {
      console.error('Error loading limits:', e);
      Swal.fire('Error', 'No se pudieron cargar los límites guardados', 'error');
    }
  }

  private loadExpenses(): void {
    this.expenseSvc.list().subscribe({
      next: (expenses: Expense[]) => {
        this.processExpenses(expenses);
        this.isLoading = false;
      },
      error: (err: unknown) => {
        console.error('Error loading expenses:', err);
        Swal.fire('Error', 'No se pudieron cargar los gastos', 'error');
        this.isLoading = false;
      }
    });
  }

private processExpenses(expenses: Expense[]): void {
  this.totalThisMonth = 0;
  this.totalsByCat = {};

  for (const expense of expenses) {
    if (!expense.date) continue; // 👈 ¡Ignora si no tiene fecha!

    const month = new Date(expense.date).toISOString().slice(0, 7);
    if (month === this.currentMonth) {
      this.totalThisMonth += expense.amount;
      this.totalsByCat[expense.category] = (this.totalsByCat[expense.category] || 0) + expense.amount;
    }
  }
}


  saveLimits(): void {
    if (this.limitsForm.invalid) {
      this.markFormAsTouched();
      return;
    }

    const newLimits: Limits = this.limitsForm.value;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(newLimits));
    this._originalLimits = { ...newLimits };

    Swal.fire({
      icon: 'success',
      title: '¡Límites actualizados!',
      text: 'Tus nuevos límites han sido guardados correctamente',
      timer: 2000,
      showConfirmButton: false
    });
  }

  private markFormAsTouched(): void {
    Object.values(this.limitsForm.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        Object.values(control.controls).forEach(c => c.markAsTouched());
      }
    });
  }

  get hasChanges(): boolean {
    return JSON.stringify(this.limitsForm.value) !== JSON.stringify(this._originalLimits);
  }

  percent(used: number, limit: number): number {
    return limit ? Math.min(100, Math.round((used / limit) * 100)) : 0;
  }

  getProgressClass(p: number): string {
    if (p >= 100) return 'danger';
    if (p >= 80) return 'warning';
    return 'success';
  }

  getCategoryStatus(category: string): string {
    const control = this.limitsForm.get(['byCategory', category]);
    const limit = control?.value;
    if (!limit) return 'no-limit';

    const used = this.totalsByCat[category] || 0;
    const percentage = this.percent(used, limit);

    if (percentage >= 100) return 'exceeded';
    if (percentage >= 80) return 'near-limit';
    return 'under-limit';
  }

  resetCategory(category: string): void {
    this.limitsForm.get(['byCategory', category])?.reset();
  }

  isGlobalLimitModified(): boolean {
    return this.limitsForm.value.global !== this._originalLimits.global;
  }
}
