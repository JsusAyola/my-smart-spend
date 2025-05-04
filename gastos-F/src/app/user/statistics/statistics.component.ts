// src/app/user/statistics/statistics.component.ts
import {
  Component, OnInit, AfterViewInit,
  ViewChild, ElementRef, OnDestroy
} from '@angular/core';
import { CommonModule }                  from '@angular/common';
import { ExpenseService, Expense }      from '../../services/expense.service';
import { interval, Subscription }       from 'rxjs';
import { startWith, switchMap }         from 'rxjs/operators';

declare const Chart: any; // Chart.js global desde CDN

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('pieCanvas')   pieCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('emoCanvas')   emoCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('barCanvas')   barCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('lineCanvas')  lineCanvas!: ElementRef<HTMLCanvasElement>;

  private pieChart!: any;
  private emoChart!: any;
  private barChart!: any;
  private lineChart!: any;

  private pollingSub!: Subscription;
  public alerts: string[] = [];
  public avgDaily: number = 0;
  public todayTotal: number = 0;

  constructor(private svc: ExpenseService) {}

  ngOnInit() {
    // Polling cada 30s, emitiendo inmediatamente
    this.pollingSub = interval(30000)
      .pipe(startWith(0), switchMap(() => this.svc.list()))
      .subscribe(list => this.updateAll(list));
  }

  ngAfterViewInit() {
    // en caso de que los datos lleguen antes
  }

  ngOnDestroy() {
    this.pollingSub.unsubscribe();
  }

  private updateAll(list: Expense[]) {
    const now = new Date();
    // 1) Gasto por categoría
    const byCat = list.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount; return acc;
    }, {} as Record<string, number>);

    // 2) Gasto por emoción
    const byEmo = list.reduce((acc, e) => {
      acc[e.emotion] = (acc[e.emotion] || 0) + e.amount; return acc;
    }, {} as Record<string, number>);

    // 3) Top 5 Gastos
    const top5 = [...list]
      .sort((a,b)=>b.amount - a.amount)
      .slice(0,5);

    // 4) Evolución Mensual
    const byMonth = list.reduce((acc,e)=>{
      const m = new Date(e.date!).toISOString().slice(0,7);
      acc[m] = (acc[m]||0)+e.amount; return acc;
    }, {} as Record<string, number>);

    // 5) Promedio diario y total hoy
    const dailyTotals = list.reduce((acc,e)=>{
      const d = new Date(e.date!).toISOString().slice(0,10);
      acc[d] = (acc[d]||0)+e.amount; return acc;
    }, {} as Record<string,number>);
    const days = Object.keys(dailyTotals).length;
    this.avgDaily = days? 
      +((Object.values(dailyTotals).reduce((a,b)=>a+b,0)/days).toFixed(2))
      : 0;
    const todayKey = now.toISOString().slice(0,10);
    this.todayTotal = dailyTotals[todayKey]||0;

    // 6) Alertas inteligentes
    this.alerts = [];
    // Ejemplo: si hoy > promedio diario * 1.2
    if (this.todayTotal > this.avgDaily * 1.2) {
      this.alerts.push(`Hoy gastaste ${this.todayTotal} COP, un ${Math.round((this.todayTotal/this.avgDaily-1)*100)}% por encima de tu promedio diario.`);
    }
    // Alerta por categoría extra
    for (const [cat, amt] of Object.entries(byCat)) {
      const avgCat = list.filter(e=>e.category===cat).reduce((a,b)=>a+b.amount,0)/days;
      if (amt > avgCat * 1.5) {
        this.alerts.push(`Has gastado ${amt} COP en ${cat}, un 50% más que tu promedio diario en esa categoría.`);
      }
    }

    // Renderizar o actualizar charts
    this.renderPie(byCat);
    this.renderEmo(byEmo);
    this.renderBar(top5);
    this.renderLine(byMonth);
  }

  private renderPie(byCat: Record<string,number>) {
    const labels = Object.keys(byCat), data = Object.values(byCat);
    const colors = labels.map((_,i)=>`hsl(${(i*70)%360},70%,60%)`);
    if (this.pieChart) {
      Object.assign(this.pieChart.data, { labels, datasets:[{ data, backgroundColor:colors }] });
      this.pieChart.update();
    } else {
      this.pieChart = new Chart(this.pieCanvas.nativeElement, {
        type:'pie', data:{ labels, datasets:[{ data, backgroundColor:colors }] },
        options:{ responsive:true, plugins:{ legend:{ position:'bottom' } } }
      });
    }
  }

  private renderEmo(byEmo: Record<string,number>) {
    const labels = Object.keys(byEmo), data = Object.values(byEmo);
    const colors = labels.map((_,i)=>`hsl(${(i*70+180)%360},70%,60%)`);
    if (this.emoChart) {
      Object.assign(this.emoChart.data, { labels, datasets:[{ data, backgroundColor:colors }] });
      this.emoChart.update();
    } else {
      this.emoChart = new Chart(this.emoCanvas.nativeElement, {
        type:'doughnut', data:{ labels, datasets:[{ data, backgroundColor:colors }] },
        options:{ responsive:true, plugins:{ legend:{ position:'bottom' } } }
      });
    }
  }

  private renderBar(top5: Expense[]) {
    const labels = top5.map(e=>e.title), data = top5.map(e=>e.amount);
    if (this.barChart) {
      Object.assign(this.barChart.data, { labels, datasets:[{ label:'Top 5', data }] });
      this.barChart.update();
    } else {
      this.barChart = new Chart(this.barCanvas.nativeElement, {
        type:'bar',
        data:{ labels, datasets:[{ label:'Top 5 Gastos', data, backgroundColor:'rgba(67,97,238,0.7)' }] },
        options:{ responsive:true, scales:{ y:{ beginAtZero:true, title:{ display:true, text:'COP' } } } }
      });
    }
  }

  private renderLine(byMonth: Record<string,number>) {
    const months = Object.keys(byMonth).sort(), data = months.map(m=>byMonth[m]);
    if (this.lineChart) {
      Object.assign(this.lineChart.data, { labels:months, datasets:[{ data }] });
      this.lineChart.update();
    } else {
      this.lineChart = new Chart(this.lineCanvas.nativeElement, {
        type:'line',
        data:{ labels:months, datasets:[{ label:'Gasto Mensual', data, fill:false, tension:0.4, borderColor:'#4361ee' }] },
        options:{ responsive:true, scales:{ x:{ title:{ display:true, text:'Mes' } }, y:{ title:{ display:true, text:'COP' } } } }
      });
    }
  }
}
