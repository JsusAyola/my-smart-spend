// src/app/auth/register/register.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, AuthResponse } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSpinner, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FontAwesomeModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  faSpinner = faSpinner;
  faCheckCircle = faCheckCircle;

  registerForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      firstName: [
        '',
        [Validators.required, Validators.pattern(/^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/)]
      ],
      lastName: [
        '',
        [Validators.required, Validators.pattern(/^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/)]
      ],
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern(
            /^[a-zA-Z0-9._%+-]+@(gmail\.com|outlook\.com|yahoo\.com|hotmail\.com)$/
          )
        ]
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(
            '^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$'
          )
        ]
      ],
      documentType: ['CC', Validators.required],
      documentNumber: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      income: ['', Validators.required],
      goal: ['', Validators.required]
    });
  }

  /** Para usar en el template: getControl('firstName') */
  getControl(name: string): AbstractControl | null {
    return this.registerForm.get(name);
  }

  onSubmit() {
    this.registerForm.markAllAsTouched();

    if (this.registerForm.invalid) {
      Swal.fire({
        icon: 'warning',
        title: '¡Por favor completa todos los campos correctamente!',
        showConfirmButton: true
      });
      return;
    }

    this.isLoading = true;

    this.authService.register(this.registerForm.value)
      .subscribe({
        next: (res: AuthResponse) => {
          this.isLoading = false;
          if (res.success) {
            Swal.fire({
              icon: 'success',
              title: '¡Registrado con éxito!',
              text: res.message,
              timer: 3000,
              showConfirmButton: false
            });
            this.router.navigate(['/auth/login'], { queryParams: { registered: 'true' } });
          } else {
            Swal.fire('Error', res.message, 'error');
          }
        },
        error: err => {
          this.isLoading = false;
          Swal.fire({
            icon: 'error',
            title: '¡Error!',
            text: err.error?.message || 'No se pudo conectar con el servidor',
            showConfirmButton: true
          });
        }
      });
  }
}
