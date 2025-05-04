// src/app/shared/navbar/navbar.component.ts
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterLink } from '@angular/router';
import { CommonModule }     from '@angular/common';
import { filter }           from 'rxjs/operators';
import { AuthService }      from '../../services/auth.service';

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
    // 1) Suscripción inicial y continua al estado de usuario
    this.authService.user$.subscribe(user => {
      this.isLoggedIn = !!user;
      this.userFullName = user 
        ? `${user.firstName} ${user.lastName}` 
        : '';
    });

    // 2) También refrescamos al navegar, por si cambias ruta sin recargar
    this.router.events
      .pipe(filter(ev => ev instanceof NavigationEnd))
      .subscribe(() => {
        // trigger de user$ en caso de refresh de UI
        const user = this.authService.getUser();
        this.isLoggedIn = !!user;
        this.userFullName = user 
          ? `${user.firstName} ${user.lastName}` 
          : '';
      });
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
    this.authService.logout();  // Esto emite user$ = null y redirige
    this.closeMenus();
  }
}
