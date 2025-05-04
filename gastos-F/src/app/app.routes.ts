import { Routes } from '@angular/router';

/* públicas */
import { InicioComponent   } from './pages/inicio/inicio.component';
import { SobreNosotrosComponent } from './pages/sobre-nosotros/sobre-nosotros.component';
import { BeneficiosComponent    } from './pages/beneficios/beneficios.component';
import { ContactoComponent      } from './pages/contacto/contacto.component';

/* auth */
import { LoginComponent    } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';

/* private */
import { ProfileComponent         } from './user/profile/profile.component';
import { ExpenseComponent         } from './user/expense/expense.component';
import { ExpensesListComponent    } from './user/expenses-list/expenses-list.component';
import { EditExpenseComponent } from './user/edit-expense/edit-expense.component';
import { StatisticsComponent      } from './user/statistics/statistics.component';
import { ManageLimitsComponent    } from './user/manage-limits/manage-limits.component';
import { RecommendationsComponent } from './user/recommendations/recommendations.component';
import { EducationComponent } from './pages/education/education.component';

import { AuthGuard } from './auth/auth.guard';

export const routes: Routes = [
  /* públicas */
  { path: '',                redirectTo: '/inicio', pathMatch: 'full' },
  { path: 'inicio',          component: InicioComponent },
  { path: 'sobre-nosotros',  component: SobreNosotrosComponent },
  { path: 'beneficios',      component: BeneficiosComponent },
  { path: 'contacto',        component: ContactoComponent },
  /* auth */
  { path: 'auth/login',      component: LoginComponent },
  { path: 'auth/register',   component: RegisterComponent },
  /* private */
  { path: 'profile',         component: ProfileComponent,          canActivate: [AuthGuard] },
  { path: 'expenses/create', component: ExpenseComponent,          canActivate: [AuthGuard] },
  { path: 'expenses/list',   component: ExpensesListComponent,     canActivate: [AuthGuard] },
  { path: 'expenses/edit/:id', component: EditExpenseComponent, canActivate: [AuthGuard] },
  { path: 'statistics',      component: StatisticsComponent,       canActivate: [AuthGuard] },
  { path: 'limits/manage',   component: ManageLimitsComponent,     canActivate: [AuthGuard] },
  { path: 'recommendations', component: RecommendationsComponent,  canActivate: [AuthGuard] },
  { path: 'education',       component: EducationComponent,        canActivate: [AuthGuard] },

  { path: '**', redirectTo: '/inicio' }
];
