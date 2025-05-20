import { Component } from '@angular/core';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [],
  templateUrl: './contacto.component.html',
  styleUrl: './contacto.component.scss'
})
export class ContactoComponent {
enviarMensaje(event: Event) {
  event.preventDefault();
  Swal.fire('¡Mensaje enviado!', 'Gracias por contactarnos 🤝', 'success');
}
}
