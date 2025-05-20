import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.scss']
})
export class ContactoComponent {
  nombre = '';
  correo = '';
  mensaje = '';

  enviarMensaje(event: Event) {
    event.preventDefault();

    if (!this.nombre || !this.correo || !this.mensaje) {
      Swal.fire('Completa todo', 'Por favor llena todos los campos antes de enviar.', 'warning');
      return;
    }

    // Simulación de envío: guardar en localStorage
    const mensajeData = {
      nombre: this.nombre,
      correo: this.correo,
      mensaje: this.mensaje,
      fecha: new Date().toISOString()
    };

    const mensajesGuardados = JSON.parse(localStorage.getItem('mensajes_contacto') || '[]');
    mensajesGuardados.push(mensajeData);
    localStorage.setItem('mensajes_contacto', JSON.stringify(mensajesGuardados));

    Swal.fire('¡Mensaje enviado!', 'Gracias por escribirnos. Pronto te responderemos.', 'success');

    // Limpiar campos
    this.nombre = '';
    this.correo = '';
    this.mensaje = '';
  }
}
