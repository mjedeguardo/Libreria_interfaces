import { Injectable } from '@angular/core';
import { Mascota } from '../models/mascota.model';
import { Cita, EstadoCita } from '../models/cita.model';
import { Cliente } from '../models/cliente.model';
@Injectable({
  providedIn: 'root'
})
export class ClinicaService {
  private mascotas: Mascota[] = [];
  private citas: Cita[] = [];

  constructor() { this.cargarDatos(); }

  getMascotas(): Mascota[] { return this.mascotas; }
  
  agregarMascota(mascota: Mascota) {
    this.mascotas.push(mascota);
    this.guardarDatos();
  }

  getCitas(): Cita[] { return this.citas; }
  
  agregarCita(cita: Cita) {
    this.citas.push(cita);
    this.guardarDatos();
  }

  cambiarEstadoCita(idCita: string, estado: EstadoCita) {
    const cita = this.citas.find(c => c.id === idCita);
    if (cita) {
      cita.estado = estado;
      if (estado === 'Atendida') {
        cita.mascota.historial.push(`Atención el ${new Date().toLocaleDateString()}: ${cita.motivo}`);
      }
      this.guardarDatos();
    }
  }

    horarioDisponible(fechaHora: Date): boolean {
    const diaSemana = fechaHora.getDay(); 
    if (diaSemana === 0 || diaSemana === 6) return false; // Fines de semana
    
    const hora = fechaHora.getHours();
    if (hora < 8 || hora >= 18) return false; // Horario 8am - 6pm

    const fechaAComparar = new Date(fechaHora).setSeconds(0, 0);
    
    const existeCita = this.citas.find(c => {
      if (c.estado === 'Cancelada') return false; 
      const fechaCitaExistente = new Date(c.fecha).setSeconds(0, 0);
      return fechaCitaExistente === fechaAComparar;
    });

    return !existeCita; // Devuelve true si está libre
  }
    // Base de datos simulada de clientes
  private clientes: Cliente[] = [
    { dni: '12345678', nombre: 'Juan Dueño', correo: 'juan@correo.com', telefono: '987654321' },
    { dni: '87654321', nombre: 'María López', correo: 'maria@correo.com', telefono: '912345678' }
  ];

  buscarCliente(dni: string): Cliente | undefined {
    return this.clientes.find(c => c.dni === dni);
  }

  guardarCliente(cliente: Cliente) {
    if (!this.buscarCliente(cliente.dni)) {
      this.clientes.push(cliente);
    }
  }
    // Verifica cuántas citas tiene un DNI en una fecha específica
  puedeAgendarMasCitas(dni: string, fecha: Date): boolean {
    // Convertimos la fecha a string solo con el día (YYYY-MM-DD) para comparar
    const diaCita = fecha.toISOString().split('T')[0];
    
    // Contamos cuántas citas pendientes tiene este DNI en ese mismo día
    const citasDelDia = this.citas.filter(c => {
      const diaExistente = new Date(c.fecha).toISOString().split('T')[0];
      // Asumimos que el dueño tiene el mismo nombre (o puedes guardar el DNI en la Cita si prefieres)
      return c.mascota.dueno.nombre === dni && diaExistente === diaCita && c.estado === 'Pendiente';
    });

    // Si ya tiene 3 o más, no puede agendar
    return citasDelDia.length < 3;
  }

  private guardarDatos() {
    localStorage.setItem('vet_mascotas', JSON.stringify(this.mascotas));
    localStorage.setItem('vet_citas', JSON.stringify(this.citas));
  }

  private cargarDatos() {
    const m = localStorage.getItem('vet_mascotas');
    const c = localStorage.getItem('vet_citas');
    if (m) this.mascotas = JSON.parse(m);
    if (c) this.citas = JSON.parse(c);
  }
}
