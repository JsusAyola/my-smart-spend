import { Component, OnInit }        from '@angular/core';
import { CommonModule }             from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidatorFn
} from '@angular/forms';
import { ActivatedRoute, Router }   from '@angular/router';
import { ExpenseService, Expense }  from '../../services/expense.service';
import Swal                          from 'sweetalert2';

@Component({
  selector: 'app-edit-expense',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-expense.component.html',
  styleUrls: ['./edit-expense.component.scss']
})
export class EditExpenseComponent implements OnInit {
  form: FormGroup;
  isLoading = false;
  expenseId!: string;

  today = new Date().toISOString().substring(0, 10);

  presetAmounts = [
    1000, 2000, 5000, 10000,
    20000, 50000, 100000,
    200000, 500000, 1000000
  ];
  categories = [
    'Alimentación','Transporte','Salud','Entretenimiento',
    'Educación','Hogar','Deudas','Ahorro','Otros'
  ];
  emotions = [
    'Por obligación','Por placer','Por estrés o ansiedad',
    'Por metas','Por presión social','Por crecimiento personal'
  ];

  constructor(
    private fb: FormBuilder,
    private svc: ExpenseService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    const noFutureDate: ValidatorFn = (control: AbstractControl) => {
      return control.value > this.today ? { futureDate: true } : null;
    };

    this.form = this.fb.group({
      title: [
        '',
        [ Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/) ]
      ],
      amountSelect: [ null, Validators.required ],
      amountManual: [
        { value: null, disabled: true },
        [ Validators.required, Validators.min(1000), Validators.pattern(/^[0-9]+$/) ]
      ],
      category: [ '', Validators.required ],
      emotion:  [ '', Validators.required ],
      date:     [ this.today, [ Validators.required, noFutureDate ] ]
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

  ngOnInit() {
    // 1. Leemos el :id de la URL
    this.expenseId = this.route.snapshot.paramMap.get('id')!;
    this.isLoading = true;
  
    // 2. Pedimos al backend ese gasto
    this.svc.getById(this.expenseId).subscribe({
      next: exp => {
        // 3. Parcheamos el formulario con los valores existentes
        this.form.patchValue({
          title:        exp.title,
          category:     exp.category,
          emotion:      exp.emotion,
          date:         exp.date?.substring(0,10),
          amountSelect: this.presetAmounts.includes(exp.amount) ? exp.amount : 'other'
        });
  
        // 4. Si era “other”, habilitamos el campo manual
        if (this.form.value.amountSelect === 'other') {
          const manual = this.form.get('amountManual')!;
          manual.enable();
          manual.setValue(exp.amount);
        }
  
        this.isLoading = false;
      },
      error: err => {
        console.error('Error cargando gasto', err);
        this.isLoading = false;
        Swal.fire('Error','No se pudo cargar el gasto.','error');
        // opcional: redirigir a la lista
        this.router.navigate(['/expenses/list']);
      }
    });
  }
  

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.isLoading = true;

    const sel = this.form.value.amountSelect;
    const amount = sel === 'other'
      ? this.form.value.amountManual
      : sel;

    const payload: Expense = {
      title:    this.form.value.title,
      amount,
      category: this.form.value.category,
      emotion:  this.form.value.emotion,
      date:     this.form.value.date
    };

    this.svc.update(this.expenseId, payload).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Gasto actualizado',
          showConfirmButton: false,
          timer: 1500
        });
        this.router.navigate(['/expenses/list']);
      },
      error: err => {
        console.error('Error actualizando gasto', err);
        Swal.fire('Error','No se pudo actualizar.','error');
        this.isLoading = false;
      }
    });
  }
}
