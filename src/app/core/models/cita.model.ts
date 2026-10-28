import { Mascota } from './mascota.model';

export type EstadoCita = 'Pendiente' | 'Atendida' | 'Cancelada';

export class Cita {
  id: string;
  mascota: Mascota;
  fecha: Date;
  motivo: string; 
  doctor: string; 
  estado: EstadoCita;

  constructor(id: string, mascota: Mascota, fecha: Date, motivo: string, doctor: string) {
    this.id = id;
    this.mascota = mascota;
    this.fecha = fecha;
    this.motivo = motivo;
    this.doctor = doctor;
    this.estado = 'Pendiente';
  }
}