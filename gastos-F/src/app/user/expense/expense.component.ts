// src/app/user/expense/expense.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidatorFn
} from '@angular/forms';
import { ExpenseService, Expense } from '../../services/expense.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-expense',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.scss']
})
export class ExpenseComponent {
  form: FormGroup;
  isLoading = false;

  // Hoy en formato YYYY-MM-DD para el max del datepicker
  today = new Date().toISOString().substring(0, 10);

  // Valores predefinidos de montos en COP
  presetAmounts = [
    1000, 2000, 5000, 10000,
    20000, 50000, 100000,
    200000, 500000, 1000000
  ];

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
    // Validador que impide fechas futuras
    const noFutureDate: ValidatorFn = (control: AbstractControl) => {
      return control.value > this.today
        ? { futureDate: true }
        : null;
    };

    this.form = this.fb.group({
      title: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/)
        ]
      ],
      amountSelect: [null, Validators.required],
      amountManual: [
        { value: null, disabled: true },
        [
          Validators.required,
          Validators.min(1000),
          Validators.pattern(/^[0-9]+$/)
        ]
      ],
      category: ['', Validators.required],
      emotion: ['', Validators.required],
      date: [
        this.today,
        [
          Validators.required,
          noFutureDate
        ]
      ]//con futuro
      //date: [ new Date().toISOString().substring(0, 10), Validators.required ]
    });

    // Habilita/deshabilita el input “Otro…” al cambiar el selector
    this.form.get('amountSelect')!.valueChanges.subscribe(val => {
      const manual = this.form.get('amountManual')!;
      if (val === 'other') {
        manual.enable();
        manual.setValue(1000);
      } else {
        manual.disable();
        manual.setValue(null);
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.isLoading = true;

    // Determina el monto final
    const sel = this.form.value.amountSelect;
    const amount = sel === 'other'
      ? this.form.value.amountManual
      : sel;

    const payload: Expense = {
      title: this.form.value.title,
      amount,
      category: this.form.value.category,
      emotion: this.form.value.emotion,
      date: this.form.value.date
    };

    this.expenseService.create(payload).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Gasto agregado',
          showConfirmButton: false,
          timer: 2000
        });
        this.router.navigate(['/expenses/list']);
      },
      error: err => {
        console.error('Error creando gasto', err);
        Swal.fire('Error','No se pudo agregar el gasto.','error');
        this.isLoading = false;
      }
    });
  }
}
