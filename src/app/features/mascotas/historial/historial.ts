import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClinicaService } from '../../../core/services/clinica.service';
import { Mascota } from '../../../core/models/mascota.model';
import { Cita } from '../../../core/models/cita.model';
import { EstadoCitaPipe } from '../../../shared/pipes/estado-cita-pipe';
import { ResaltarProximaDirective } from '../../../shared/directives/resaltar-proxima';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [CommonModule, EstadoCitaPipe, ResaltarProximaDirective], 
  templateUrl: './historial.html',
  styleUrls: ['./historial.css']
})
export class HistorialComponent implements OnInit {
  mascotas: Mascota[] = [];
  citasPendientes: Cita[] = []; 
  seleccionada: Mascota | null = null;

  constructor(private clinicaService: ClinicaService) {}

  ngOnInit() {
    this.actualizar();
  }

  actualizar() {
    this.mascotas = this.clinicaService.getMascotas();
    this.citasPendientes = this.clinicaService.getCitas().filter(c => c.estado === 'Pendiente');
  }

  ver(m: Mascota) { 
    this.seleccionada = m; 
  }

  cancelarCita(cita: Cita) {
    if (confirm('¿Estás seguro de cancelar esta cita?')) {
      this.clinicaService.cambiarEstadoCita(cita.id, 'Cancelada');
      this.actualizar(); 
    }
  }
}