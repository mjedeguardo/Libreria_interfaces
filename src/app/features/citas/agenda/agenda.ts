import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { ClinicaService } from '../../../core/services/clinica.service';
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

  constructor(private clinicaService: ClinicaService) {}

  ngOnInit() { this.actualizar(); }

  actualizar() {
    this.citas = this.clinicaService.getCitas();
  }

  // 1. Al dar click en Atender o Ver Receta
  abrirModalAtencion(cita: Cita) {
    this.citaAtendiendo = cita;
    
    // LÓGICA CORREGIDA: Si la cita ya está atendida, buscamos la nota para mostrarla
    if (cita.estado === 'Atendida' && cita.mascota.historial.length > 0) {
      const ultimaNota = cita.mascota.historial[cita.mascota.historial.length - 1];
      
      // Cortamos el texto para quitarle la fecha y dejar solo lo que escribió el doctor
      if (ultimaNota.includes(': ')) {
        this.notaMedica = ultimaNota.split(': ').pop() || ''; 
      } else {
        this.notaMedica = ultimaNota;
      }
    } else {
      // Si está pendiente, el cuadro va vacío
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