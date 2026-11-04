import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ClinicaService } from '../../../core/services/clinica.service';
import { AuthService } from '../../../core/services/auth.service';
import { Cita } from '../../../core/models/cita.model'; // <-- Importamos Cita

@Component({
  selector: 'app-panel-admin',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './panel-admin.html',
  styleUrls: ['./panel-admin.css']
})
export class PanelAdminComponent implements OnInit {
  totalMascotas: number = 0;
  totalCitas: number = 0;
  citasPendientes: number = 0;
  
  // NUEVO: Arreglo para guardar las citas atendidas
  citasAtendidas: Cita[] = []; 

  constructor(public authService: AuthService, private clinicaService: ClinicaService) {}

  ngOnInit() {
    this.totalMascotas = this.clinicaService.getMascotas().length;
    const citas = this.clinicaService.getCitas();
    this.totalCitas = citas.length;
    this.citasPendientes = citas.filter(c => c.estado === 'Pendiente').length;
    
    // NUEVO: Filtramos solo las que están atendidas
    this.citasAtendidas = citas.filter(c => c.estado === 'Atendida');
  }
}