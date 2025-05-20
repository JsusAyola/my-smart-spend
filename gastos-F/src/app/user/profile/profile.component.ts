import { Component, OnInit } from '@angular/core';
import { CommonModule }       from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService }        from '../../services/auth.service';
import Swal                   from 'sweetalert2';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  isLoading = false;

  // Opciones para selects, si quieres actualizables
  incomes = [
    'Menos de $1.000.000',
    '$1.000.000 - $2.000.000',
    '$2.000.000 - $5.000.000',
    'Más de $5.000.000'
  ];
  goals = [
    'Ahorrar',
    'Pagar deudas',
    'Invertir',
    'Viajar',
  ];

  constructor(private fb: FormBuilder, private auth: AuthService) {
    // Sólo permitimos editar nombres y apellidos; lo demás bloqueado o select
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.pattern(/^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/)]],
      lastName:  ['', [Validators.required, Validators.pattern(/^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/)]],
      email:     [{ value: '', disabled: true }],
      documentType: [{ value: '', disabled: true }],
      documentNumber: [{ value: '', disabled: true }],
      phone:     [{ value: '', disabled: true }],
      income:    ['', Validators.required],
      goal:      ['', Validators.required]
    });
  }

  ngOnInit() {
    // Cargamos el usuario de localStorage
    const user = this.auth.getUser();
    if (user) {
      this.profileForm.patchValue({
        firstName:      user.firstName,
        lastName:       user.lastName,
        email:          user.email,
        documentType:   user.documentType,
        documentNumber: user.documentNumber,
        phone:          user.phone,
        income:         user.income || '',
        goal:           user.goal   || ''
      });
    }
  }

  onSubmit() {
    if (this.profileForm.invalid) return;
    this.isLoading = true;

    // Sólo enviamos los campos editables
    const { firstName, lastName, income, goal } = this.profileForm.getRawValue();
    this.auth.updateProfile({ firstName, lastName, income, goal })
      .subscribe({
        next: () => {
          Swal.fire('¡Hecho!','Tu perfil se ha actualizado.','success');
          this.isLoading = false;
        },
        error: () => {
          Swal.fire('Error','No se pudo actualizar el perfil.','error');
          this.isLoading = false;
        }
      });
  }
}
