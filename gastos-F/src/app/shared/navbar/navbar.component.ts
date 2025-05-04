import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  userFullName = '';
  showMenu = false;
  showUserMenu = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    if (this.authService.isLoggedIn() === null) return;
    this.updateUserState();

    // Cada vez que cambies de ruta, volvemos a comprobar
    this.router.events
      .pipe(filter(ev => ev instanceof NavigationEnd))
      .subscribe(() => this.updateUserState());
  }

  private updateUserState() {
    this.isLoggedIn = this.authService.isLoggedIn();
    if (this.isLoggedIn) {
      const user = this.authService.getUser();
      // Ajusta según quieras nombre completo o solo firstName
      this.userFullName = `${user.firstName} ${user.lastName}`;
    } else {
      this.userFullName = '';
    }
  }

  redirectToLogin() {
    this.router.navigate(['/auth/login']);
  }

  closeMenus() {
    this.showMenu = false;
    this.showUserMenu = false;
  }

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
  }

  logout() {
    this.authService.logout();  // Limpia token y redirige
    this.closeMenus();
  }
}
