import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService, AuthResponse } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSpinner, faSignInAlt, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    FontAwesomeModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  faSpinner = faSpinner;
  faSignInAlt = faSignInAlt;
  faEye = faEye;
  faEyeSlash = faEyeSlash;

  loginForm: FormGroup;
  isLoading = false;
  showPassword = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid || this.isLoading) return;

    this.isLoading = true;

    const { email, password } = this.loginForm.value;
    this.authService.login(email, password)
      .subscribe({
        next: (res: AuthResponse) => {
          this.isLoading = false;

          if (res.success) {
            // El token ya queda guardado por el interceptor en AuthService
            Swal.fire({
              icon: 'success',
              title: '¡Inicio de sesión exitoso!',
              text: 'Redirigiendo al Dashboard...',
              timer: 2000,
              showConfirmButton: true
            });
            setTimeout(() => this.router.navigate(['/dashboard']), 2000);
          } else {
            Swal.fire('Error', res.message, 'error');
          }
        },
        error: err => {
          this.isLoading = false;

          if (err.status === 404) {
            Swal.fire('Cuenta no encontrada', '¿No tienes cuenta? Regístrate aquí', 'error');
          } else if (err.status === 401) {
            Swal.fire('Credenciales incorrectas', 'Por favor, verifica tus datos.', 'error');
          } else {
            Swal.fire('Error', 'No se pudo conectar al servidor.', 'error');
          }
        }
      });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
