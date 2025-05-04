// src/app/user/manage-limits/manage-limits.component.ts
import { Component, OnInit }         from '@angular/core';
import { CommonModule }              from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { ExpenseService }            from '../../services/expense.service';
import Swal                          from 'sweetalert2';

interface Limits {
  global: number;
  byCategory: Record<string, number>;
}

@Component({
  selector: 'app-manage-limits',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule ],
  templateUrl: './manage-limits.component.html',
  styleUrls: ['./manage-limits.component.scss']
})
export class ManageLimitsComponent implements OnInit {
  limitsForm: FormGroup;
  totalsByCat: Record<string, number> = {};
  totalThisMonth = 0;

  categories = [
    'Alimentación','Transporte','Salud','Entretenimiento',
    'Educación','Hogar','Deudas','Ahorro','Otros'
  ];

  presetOptions = [
    50000, 100000, 200000, 500000,
    1000000, 2000000, 5000000
  ];

  private STORAGE_KEY = 'smartspend_limits';
  limits: Limits = { global: 0, byCategory: {} };

  constructor(
    private fb: FormBuilder,
    private expenseSvc: ExpenseService
  ) {
    this.limitsForm = this.fb.group({
      global: [ null, Validators.required ],
      byCategory: this.fb.group(
        this.categories.reduce((acc, c) => {
          acc[c] = [ null ];
          return acc;
        }, {} as Record<string, any>)
      )
    });
  }

  ngOnInit() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      this.limits = JSON.parse(saved);
      this.limitsForm.patchValue(this.limits);
    }

    this.expenseSvc.list().subscribe(list => {
      const month = new Date().toISOString().slice(0,7);
      this.totalThisMonth = 0;
      this.totalsByCat = {};
      list.forEach(e => {
        const m = new Date(e.date!).toISOString().slice(0,7);
        if (m === month) {
          this.totalThisMonth += e.amount;
          this.totalsByCat[e.category] = (this.totalsByCat[e.category]||0) + e.amount;
        }
      });
    });
  }

  saveLimits() {
    if (this.limitsForm.invalid) return;

    this.limits = this.limitsForm.value;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.limits));

    // SweetAlert2 en lugar de alert()
    Swal.fire({
      icon: 'success',
      title: '¡Listo!',
      text: 'Límites guardados 👍',
      timer: 2000,
      showConfirmButton: false
    });
  }

  percent(used: number, limit: number): number {
    return limit ? Math.min(100, Math.round(used/limit*100)) : 0;
  }
  pctClass(p: number): string {
    if (p >= 100) return 'over';
    if (p >= 80) return 'warn';
    return 'ok';
  }
}
