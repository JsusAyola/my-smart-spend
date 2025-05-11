import { Component, OnInit } from '@angular/core';
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
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-expense',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.scss']
})
export class ExpenseComponent implements OnInit {
  form: FormGroup;
  isLoading = false;
  user: any = {};  // Para almacenar los datos del usuario
  totalExpenses: number = 0;  // Para almacenar el número total de gastos del usuario
  isLimitReached: boolean = false;  // Para verificar si el usuario ha alcanzado el límite de gastos

  today = new Date().toISOString().substring(0, 10);

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
    private userService: UserService,
    private router: Router
  ) {
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
      ]
    });

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

  ngOnInit(): void {
    this.getUser();  // Llamada para obtener los datos del usuario
    this.getUserExpenses();  // Llamada para obtener los gastos del usuario
  }

  getUser() {
    this.userService.getUserProfile().subscribe((data: any) => {
      this.user = data.user;  // Asignamos los datos del usuario
    });
  }

  getUserExpenses() {
    this.expenseService.getUserExpenses().subscribe((expenses: any[]) => {
      this.totalExpenses = expenses.length;  // Contamos los gastos
      this.checkExpenseLimit();  // Verificamos si el usuario alcanzó el límite
    });
  }

  checkExpenseLimit() {
    if (this.user.plan === 'free' && this.totalExpenses >= 3) {
      this.isLimitReached = true;  // El límite ha sido alcanzado
    } else {
      this.isLimitReached = false;  // El límite no ha sido alcanzado
    }
  }

  upgradeToPremium() {
    this.userService.updateUserPlan('premium').subscribe(
      (response) => {
        console.log('Plan actualizado a Premium:', response);
        Swal.fire('¡Felicidades!', 'Ahora tienes acceso a todas las funcionalidades.', 'success');
        this.getUser();  // Actualiza el perfil del usuario con el nuevo plan
      },
      (error) => {
        console.error('Error al actualizar el plan:', error);
        Swal.fire('Error', 'No se pudo actualizar el plan', 'error');
      }
    );
  }

  onSubmit(): void {
    if (this.form.invalid || this.isLimitReached) {
      if (this.isLimitReached) {
        Swal.fire('Límite alcanzado', 'Has alcanzado el límite de gastos en el plan gratuito.', 'error');
      }
      this.form.markAllAsTouched();
      return;
    }
    this.isLoading = true;

    const sel = this.form.value.amountSelect;
    const amount = sel === 'other'
      ? this.form.value.amountManual
      : sel;

    const payload: Expense = {
      title: this.form.value.title,
      amount: amount,
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
