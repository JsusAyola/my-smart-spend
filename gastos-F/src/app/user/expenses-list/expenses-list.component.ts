import { Component, OnInit } from '@angular/core';
import { CommonModule }      from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ExpenseService, Expense } from '../../services/expense.service';
import Swal                  from 'sweetalert2';

@Component({
  selector: 'app-expenses-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './expenses-list.component.html',
  styleUrls: ['./expenses-list.component.scss']
})
export class ExpensesListComponent implements OnInit {
  expenses: Expense[] = [];
  isLoading = false;

  constructor(
    private svc: ExpenseService,
    private router: Router
  ) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.isLoading = true;
    this.svc.list().subscribe({
      next: list => {
        this.expenses = list;
        this.isLoading = false;
      },
      error: err => {
        console.error('Error obteniendo gastos', err);
        this.isLoading = false;
      }
    });
  }

  /** Redirige a /expenses/edit/:id */
  edit(id?: string) {
    if (!id) return;
    this.router.navigate(['/expenses/edit', id]);
  }

  /** Elimina tras confirmación */
  remove(id?: string) {
    if (!id) return;
    Swal.fire({
      title: '¿Eliminar este gasto?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No'
    }).then(res => {
      if (res.isConfirmed) {
        this.svc.delete(id).subscribe({
          next: () => {
            Swal.fire('Eliminado','Gasto borrado.','success');
            this.load();
          },
          error: err => {
            console.error('Error eliminando gasto', err);
            Swal.fire('Error','No se pudo eliminar.','error');
          }
        });
      }
    });
  }
}
