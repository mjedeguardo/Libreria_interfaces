import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { ClinicaService } from '../../../core/services/clinica.service';
import { AuthService } from '../../../core/services/auth.service'; // <-- IMPORTANTE: Traer el AuthService
import { Cita } from '../../../core/models/cita.model';
import { EstadoCitaPipe } from '../../../shared/pipes/estado-cita-pipe'; 
import { ResaltarProximaDirective } from '../../../shared/directives/resaltar-proxima';

@Component({
  selector: 'app-agenda',
  standalone: true,
  imports: [CommonModule, FormsModule, EstadoCitaPipe, ResaltarProximaDirective], 
  templateUrl: './agenda.html',
  styleUrls: ['./agenda.css']
})
export class AgendaComponent implements OnInit {
  citas: Cita[] = [];
  citaAtendiendo: Cita | null = null;
  notaMedica: string = '';

  // Inyectamos el AuthService como public para usarlo en el HTML
  constructor(private clinicaService: ClinicaService, public authService: AuthService) {}

  ngOnInit() { this.actualizar(); }

   actualizar() {
    const todasLasCitas = this.clinicaService.getCitas();
    
    // Si es admin, solo le mostramos las atendidas
    if (this.authService.tieneRol(['Admin'])) {
      this.citas = todasLasCitas.filter(c => c.estado === 'Atendida');
    } else {
      this.citas = todasLasCitas;
    }
  }

  // 1. Al dar click en Atender o Ver Receta
  abrirModalAtencion(cita: Cita) {
    this.citaAtendiendo = cita;
    
    if (cita.estado === 'Atendida' && cita.mascota.historial.length > 0) {
      const ultimaNota = cita.mascota.historial[cita.mascota.historial.length - 1];
      
      if (ultimaNota.includes(': ')) {
        this.notaMedica = ultimaNota.split(': ').pop() || ''; 
      } else {
        this.notaMedica = ultimaNota;
      }
    } else {
      this.notaMedica = ''; 
    }
  }

  // 2. Al guardar la nota
  guardarAtencion() {
    if (this.citaAtendiendo) {
      this.clinicaService.cambiarEstadoCita(this.citaAtendiendo.id, 'Atendida');
      
      if (this.notaMedica.trim() !== '') {
        this.citaAtendiendo.mascota.historial.push(`Nota Médica (${new Date().toLocaleDateString()}): ${this.notaMedica}`);
        this.clinicaService.actualizarCita(this.citaAtendiendo); 
      }

      this.citaAtendiendo = null; 
      this.actualizar();
    }
  }

  cancelarAtencion() {
    this.citaAtendiendo = null; 
  }

  imprimirReceta() {
    window.print();
  }

  cancelarCita(cita: Cita) {
    this.clinicaService.cambiarEstadoCita(cita.id, 'Cancelada');
    this.actualizar();
  }
}