import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpenseService, Expense } from '../../services/expense.service';

interface Limits {
  global: number;
  byCategory: Record<string, number>;
}

interface Reco {
  message: string;
  severity: 'info' | 'warning' | 'danger' | 'success';
  category?: string;
  percentage?: number;
  icon?: string;
}

@Component({
  selector: 'app-recommendations',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recommendations.component.html',
  styleUrls: ['./recommendations.component.scss']
})
export class RecommendationsComponent implements OnInit {
  public Math = Math;
  recos: Reco[] = [];
  currentMonth = new Date().toISOString().slice(0, 7);
  isLoading = true;
  error: string | null = null;
  showDetails = false;

  private STORAGE_KEY = 'smartspend_limits';
  limits: Limits = { global: 0, byCategory: {} };
  totalsByCat: Record<string, number> = {};
  totalThisMonth = 0;

  // Consejos generales (podrías mover esto a un servicio)
  generalTips = [
    "Revisa tus suscripciones recurrentes y cancela las que no uses",
    "Compara precios antes de comprar artículos costosos",
    "Establece un presupuesto semanal para gastos discrecionales",
    "Usa la regla 50/30/20 para administrar tus ingresos",
    "Automática tus ahorros al recibir tu salario",
    "Evita compras impulsivas esperando 24 horas antes de comprar"
  ];

  constructor(private expenseSvc: ExpenseService) {}

  ngOnInit() {
    this.loadData();
  }

  private loadData() {
    this.loadLimits();
    this.loadExpenses();
  }

  private loadLimits() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      this.limits = saved ? JSON.parse(saved) : { global: 0, byCategory: {} };
    } catch (e) {
      console.error('Error loading limits:', e);
      this.error = 'Error al cargar los límites guardados';
    }
  }

  public loadExpenses() {
    this.expenseSvc.list().subscribe({
      next: list => {
        this.processExpenses(list);
        this.buildRecommendations();
        this.isLoading = false;
      },
      error: err => {
        console.error('Error loading expenses:', err);
        this.error = 'Error al cargar los gastos. Intenta nuevamente.';
        this.isLoading = false;
      }
    });
  }

  private processExpenses(expenses: Expense[]) {
    this.totalThisMonth = 0;
    this.totalsByCat = {};

    expenses.forEach(e => {
      const month = new Date(e.date!).toISOString().slice(0, 7);
      if (month === this.currentMonth) {
        this.totalThisMonth += e.amount;
        this.totalsByCat[e.category] = (this.totalsByCat[e.category] || 0) + e.amount;
      }
    });
  }

  private buildRecommendations() {
    this.recos = [];
    
    // 1. Recomendaciones basadas en límites globales
    this.addGlobalRecommendation();
    
    // 2. Recomendaciones por categoría
    this.addCategoryRecommendations();
    
    // 3. Recomendaciones generales
    this.addGeneralRecommendations();
    
    // 4. Recomendaciones adicionales basadas en patrones
    this.addPatternBasedRecommendations();
  }

  private addGlobalRecommendation() {
    if (this.limits.global > 0) {
      const pct = Math.round(this.totalThisMonth / this.limits.global * 100);
      
      if (pct >= 100) {
        this.recos.push({
          message: `¡Has superado tu límite mensual (${pct}%)! Considera reducir gastos.`,
          severity: 'danger',
          percentage: pct,
          icon: '🚨'
        });
      } else if (pct >= 80) {
        this.recos.push({
          message: `Estás al ${pct}% de tu límite mensual. Vigila tus gastos.`,
          severity: 'warning',
          percentage: pct,
          icon: '⚠️'
        });
      } else if (pct <= 30) {
        this.recos.push({
          message: `Solo has gastado el ${pct}% de tu presupuesto. ¡Buen trabajo!`,
          severity: 'success',
          percentage: pct,
          icon: '✅'
        });
      }
    }
  }

  private addCategoryRecommendations() {
    for (const [cat, lim] of Object.entries(this.limits.byCategory)) {
      if (!lim) continue;
      
      const used = this.totalsByCat[cat] || 0;
      const pct = Math.round(used / lim * 100);
      const icon = pct >= 100 ? '🔥' : pct >= 80 ? '⚠️' : 'ℹ️';
      
      if (pct >= 100) {
        this.recos.push({
          message: `"${cat}" excedida (${pct}%). Reduce gastos aquí.`,
          severity: 'danger',
          category: cat,
          percentage: pct,
          icon: icon
        });
      } else if (pct >= 80) {
        this.recos.push({
          message: `"${cat}" al ${pct}%. Cuidado con seguir gastando.`,
          severity: 'warning',
          category: cat,
          percentage: pct,
          icon: icon
        });
      } else if (pct <= 20) {
        this.recos.push({
          message: `"${cat}" solo al ${pct}%. ¡Excelente control!`,
          severity: 'success',
          category: cat,
          percentage: pct,
          icon: '👍'
        });
      }
    }
  }

  private addGeneralRecommendations() {
    // Si no hay límites configurados
    if (!this.limits.global && Object.values(this.limits.byCategory).every(v => !v)) {
      this.recos.push({
        message: 'Configura límites para recibir recomendaciones personalizadas.',
        severity: 'info',
        icon: '💡'
      });
    }
    
    // Si todo está bien
    if (this.recos.filter(r => r.severity === 'success').length > 2 && 
        this.recos.filter(r => r.severity === 'danger').length === 0) {
      this.recos.push({
        message: '¡Excelente gestión financiera este mes!',
        severity: 'success',
        icon: '🎉'
      });
    }
  }

  private addPatternBasedRecommendations() {
    // Detección de gastos recurrentes
    const recurringCategories = Object.keys(this.totalsByCat)
      .filter(cat => this.totalsByCat[cat] > 0)
      .sort((a, b) => this.totalsByCat[b] - this.totalsByCat[a]);
    
    if (recurringCategories.length > 0) {
      const topCategory = recurringCategories[0];
      const topAmount = this.totalsByCat[topCategory];
      
      if (topAmount > (this.totalThisMonth * 0.4)) { // Más del 40% del gasto
        this.recos.push({
          message: `"${topCategory}" representa el ${Math.round(topAmount/this.totalThisMonth*100)}% de tus gastos.`,
          severity: 'warning',
          category: topCategory,
          icon: '🔍'
        });
      }
    }
  }

  get sortedRecommendations(): Reco[] {
    const severityOrder = { danger: 0, warning: 1, info: 2, success: 3 };
    return [...this.recos].sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
  }

  get showNoLimitsWarning(): boolean {
    return !this.limits.global && Object.values(this.limits.byCategory).every(v => !v);
  }

  get topSpendingCategory(): { category: string, amount: number } | null {
    const entries = Object.entries(this.totalsByCat);
    if (entries.length === 0) return null;
    
    const sorted = entries.sort((a, b) => b[1] - a[1]);
    return { category: sorted[0][0], amount: sorted[0][1] };
  }

  toggleDetails() {
    this.showDetails = !this.showDetails;
  }

  refreshData() {
    this.isLoading = true;
    this.error = null;
    this.loadData();
  }
}