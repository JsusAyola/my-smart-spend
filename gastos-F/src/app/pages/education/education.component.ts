import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocalContextService} from '../../services/local-context.service';
import { ContextExample } from '../../services/local-context.model';

@Component({
  selector: 'app-education',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.scss']
})
export class EducationComponent implements OnInit {
  ejemplos: ContextExample[] = [];

  constructor(private localCtx: LocalContextService) {}

  ngOnInit(): void {
    this.ejemplos = this.localCtx.getEjemplos();
  }
}
