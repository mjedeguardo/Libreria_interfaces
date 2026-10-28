import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClinicaService } from '../../../core/services/clinica.service';
import { Cita } from '../../../core/models/cita.model';
import { EstadoCitaPipe } from '../../../shared/pipes/estado-cita-pipe'; 
import { ResaltarProximaDirective } from '../../../shared/directives/resaltar-proxima';

@Component({
  selector: 'app-agenda',
  standalone: true,
  imports: [CommonModule, EstadoCitaPipe, ResaltarProximaDirective],
  templateUrl: './agenda.html',
  styleUrls: ['./agenda.css']
})
export class AgendaComponent implements OnInit {
  citas: Cita[] = [];

  constructor(private clinicaService: ClinicaService) {}

  ngOnInit() { this.actualizar(); }

  actualizar() {
    this.citas = this.clinicaService.getCitas();
  }

  atender(cita: Cita) {
    this.clinicaService.cambiarEstadoCita(cita.id, 'Atendida');
    this.actualizar();
  }

  cancelar(cita: Cita) {
    this.clinicaService.cambiarEstadoCita(cita.id, 'Cancelada');
    this.actualizar();
  }
}