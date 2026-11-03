import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Para el input
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ClinicaService } from '../../../core/services/clinica.service';
import { Cita } from '../../../core/models/cita.model';

@Component({
  selector: 'app-panel-trabajador',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './panel-trabajador.html',
  styleUrls: ['./panel-trabajador.css']
})
export class PanelTrabajadorComponent {
  recetaEncontrada: { mascota: any, nota: string } | null = null;
  mensajeError: string = '';

  constructor(public authService: AuthService, private clinicaService: ClinicaService) {}

  buscarReceta(dni: string) {
    this.recetaEncontrada = null;
    this.mensajeError = '';

    // Buscamos al cliente por DNI para obtener su nombre
    const cliente = this.clinicaService.buscarCliente(dni);
    if (!cliente) {
      this.mensajeError = 'No se encontró ningún cliente con ese DNI.';
      return;
    }

    // Buscamos las citas atendidas de las mascotas de este dueño
    const citas = this.clinicaService.getCitas();
    const citaAtendida = citas.find(c => 
      c.mascota.dueno.nombre === cliente.nombre && 
      c.estado === 'Atendida' && 
      c.mascota.historial.length > 0
    );

    if (citaAtendida) {
      // Extraemos la última nota del historial
      const ultimaNota = citaAtendida.mascota.historial[citaAtendida.mascota.historial.length - 1];
      this.recetaEncontrada = {
        mascota: citaAtendida.mascota,
        nota: ultimaNota.replace(/Nota Médica \(.*\): /, '') // Limpiamos el texto
      };
    } else {
      this.mensajeError = 'No se encontraron recetas médicas para este cliente.';
    }
  }

  imprimir() {
    window.print();
  }
}