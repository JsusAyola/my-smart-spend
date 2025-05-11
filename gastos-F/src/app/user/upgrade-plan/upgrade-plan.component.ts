import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-upgrade-plan',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './upgrade-plan.component.html',
  styleUrls: ['./upgrade-plan.component.scss']
})
export class UpgradePlanComponent implements OnInit {
  user: any = {};
  currentPlan: string = '';
  isMonthly: boolean = true;

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userService.getUserProfile().subscribe(data => {
      this.user = data.user;
      this.currentPlan = this.user.plan;
    });
  }

  selectBilling(option: 'monthly' | 'yearly'): void {
    this.isMonthly = option === 'monthly';
  }

upgrade(plan: 'student' | 'premium'): void {
  const subscriptionType = this.isMonthly ? 'monthly' : 'annual';

  this.userService.updateUserPlan(plan, subscriptionType).subscribe({
    next: () => {
      Swal.fire('¡Listo!', `Te has suscrito al plan ${plan} (${subscriptionType}).`, 'success');
      this.currentPlan = plan;
      this.user.subscription = subscriptionType;
    },
    error: (err) => {
      console.error('Error actualizando plan', err);
      Swal.fire('Error', 'No se pudo actualizar el plan. Intenta más tarde.', 'error');
    }
  });
}
}