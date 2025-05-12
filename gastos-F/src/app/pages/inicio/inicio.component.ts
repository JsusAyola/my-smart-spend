import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [],
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss'],
})
export class InicioComponent implements OnInit {
  nombres = [
    'Jesús', 'Maily', 'Carlos', 'Ana', 'Pedro', 'Laura', 'Sofía', 'Andrés',
    'Camila', 'Juan', 'Mariana', 'Daniel', 'Valentina', 'David', 'Isabela', 'Mateo',
    'Sara', 'Santiago', 'Gabriela', 'Felipe', 'Daniela', 'Alejandro', 'Paula', 'Julián',
    'Nicole', 'Samuel', 'Manuela', 'Sebastián', 'Luciana', 'Emilio', 'Danna', 'Esteban',
    'Antonia', 'Cristian', 'Renata', 'Leonardo', 'Juana', 'Tomás', 'María', 'Simón',
    'Adriana', 'Ricardo', 'Catalina', 'Fernando', 'Melany', 'Pablo', 'Paulina', 'Álvaro',
    'Victoria', 'Mauricio', 'Emilia', 'Jorge', 'Bianca', 'Martín', 'Amalia', 'Luis',
    'Juliana', 'Ángel', 'Salomé', 'Óscar', 'Margarita', 'Brayan', 'Constanza', 'Kevin',
    'Bárbara', 'José', 'Zaira', 'Marco', 'Carolina', 'Javier', 'Allison', 'Nicolás',
    'Claudia', 'Sergio', 'Sharon', 'Jonathan', 'Vanessa', 'Cristina', 'Dilan', 'Verónica',
    'Diego', 'Miranda', 'Harold', 'Adela', 'Jefferson', 'Luisa', 'Yeferson', 'Ximena',
    'Wilson', 'Karol', 'Gustavo', 'Samantha', 'Camilo', 'Tatiana', 'Manuel', 'Dayana'
  ];  
  currentName = 'Amigo';
  index = 0;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      // Solo ejecuta esto si está en el navegador
      this.changeName();
      setInterval(() => this.changeName(), 3000);
    }
  }

  changeName() {
    this.currentName = this.nombres[this.index];
    this.index = (this.index + 1) % this.nombres.length;
  }
}
