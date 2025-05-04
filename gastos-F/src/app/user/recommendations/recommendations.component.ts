// src/app/user/recommendations/recommendations.component.ts
import { Component, OnInit }         from '@angular/core';
import { CommonModule }              from '@angular/common';
import { LocalContextService} from '../../services/local-context.service';
import { ExpenseService, Expense }   from '../../services/expense.service';
import { ContextExample } from '../../services/local-context.model';
interface Limits {
  global: number;
  byCategory: Record<string, number>;
}

@Component({
  selector: 'app-recommendations',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './recommendations.component.html',
  styleUrls: ['./recommendations.component.scss']
})
export class RecommendationsComponent implements OnInit {
  ejemplos: ContextExample[] = [];
  recos: string[] = [];

  private STORAGE_KEY = 'smartspend_limits';
  limits: Limits = { global: 0, byCategory: {} };
  totalsByCat: Record<string, number> = {};
  totalThisMonth = 0;

  constructor(
    private localCtx: LocalContextService,
    private expenseSvc: ExpenseService
  ) {}

  ngOnInit() {
    // 1) Contexto local
    this.ejemplos = this.localCtx.getEjemplos();
    console.log('Ejemplos cargados:', this.ejemplos);

    // 2) Límites
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      this.limits = JSON.parse(saved);
    }
    console.log('Límites desde localStorage:', this.limits);

    // 3) Gastos y recomendaciones
    this.expenseSvc.list().subscribe(list => {
      console.log('Gastos recibidos:', list);

      const month = new Date().toISOString().slice(0,7);
      this.totalThisMonth = 0;
      this.totalsByCat = {};

      for (const e of list) {
        const m = new Date(e.date!).toISOString().slice(0,7);
        if (m === month) {
          this.totalThisMonth += e.amount;
          this.totalsByCat[e.category] = (this.totalsByCat[e.category]||0) + e.amount;
        }
      }
      console.log(`Totales mes (${month}):`, this.totalThisMonth, this.totalsByCat);

      this.buildRecommendations();
      console.log('Recomendaciones generadas:', this.recos);
    });
  }

  private buildRecommendations() {
    this.recos = [];

    // Global
    if (this.limits.global > 0) {
      const pct = Math.round(this.totalThisMonth / this.limits.global * 100);
      if (pct >= 100) {
        this.recos.push(`¡Has superado tu límite global (${pct}%)! Considera reducir gastos este mes.`);
      } else if (pct >= 80) {
        this.recos.push(`Estás al ${pct}% de tu límite global. Vigila tus próximos gastos.`);
      }
    }

    // Por categoría
    for (const [cat, lim] of Object.entries(this.limits.byCategory)) {
      if (!lim) continue;
      const used = this.totalsByCat[cat] || 0;
      const pct = Math.round(used / lim * 100);
      if (pct >= 100) {
        this.recos.push(`Categoría "${cat}" excedida (${pct}%). Reduce compras en esta área.`);
      } else if (pct >= 80) {
        this.recos.push(`Categoría "${cat}" al ${pct}%. Cuidado con seguir gastando aquí.`);
      }
    }

    // Sin límites
    if (!this.limits.global && Object.values(this.limits.byCategory).every(v=>!v)) {
      this.recos.push('Aún no has definido límites: ve a la sección de Límites para configurarlos.');
    }

    // Si todo está bien
    if (this.recos.length === 0) {
      this.recos.push('¡Bien hecho! Tus gastos están dentro de los límites.');
    }
  }
}
