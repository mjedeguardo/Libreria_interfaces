import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClinicaService } from '../../../core/services/clinica.service';
import { AuthService } from '../../../core/services/auth.service'; // <-- IMPORTANTE: Traer el AuthService
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

  // 1. Inyectamos el AuthService
  constructor(private clinicaService: ClinicaService, private authService: AuthService) {}

  ngOnInit() {
    this.actualizar();
  }

  actualizar() {
    const user = this.authService.getUsuarioActual();
    const todasLasMascotas = this.clinicaService.getMascotas();
    const todasLasCitas = this.clinicaService.getCitas();

    // 2. AQUÍ ESTÁ LA MAGIA: Si es cliente, filtramos por su nombre
    if (user && user.rol === 'Cliente') {
      // Solo mostramos las mascotas donde el nombre del dueño sea igual al del cliente logueado
      this.mascotas = todasLasMascotas.filter(m => m.dueno.nombre === user.nombre);
      
      // Solo mostramos las citas de esas mascotas
      this.citasPendientes = todasLasCitas.filter(c => 
        c.mascota.dueno.nombre === user.nombre && c.estado === 'Pendiente'
      );
    } else {
      // Si es Admin, Recepcionista o Veterinario, ven todo
      this.mascotas = todasLasMascotas;
      this.citasPendientes = todasLasCitas.filter(c => c.estado === 'Pendiente');
    }
  }

  ver(m: Mascota) { 
    this.seleccionada = m; 
  }

    imprimirReceta() {
    window.print();
  }

  cancelarCita(cita: Cita) {
    if (confirm('¿Estás seguro de cancelar esta cita?')) {
      this.clinicaService.cambiarEstadoCita(cita.id, 'Cancelada');
      this.actualizar(); 
    }
  }
}