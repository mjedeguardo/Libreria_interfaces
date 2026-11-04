import { Mascota } from './mascota.model';

export type EstadoCita = 'Pendiente' | 'Atendida' | 'Cancelada';

export class Cita {
  id: string;
  mascota: Mascota;
  fecha: Date;
  motivo: string;
  doctor: string;
  estado: EstadoCita;
  precio: number; // <-- AGREGAMOS EL PRECIO AQUÍ

  // Agregamos el precio al constructor con un valor por defecto de 0
  constructor(id: string, mascota: Mascota, fecha: Date, motivo: string, doctor: string, precio: number = 0) {
    this.id = id;
    this.mascota = mascota;
    this.fecha = fecha;
    this.motivo = motivo;
    this.doctor = doctor;
    this.estado = 'Pendiente';
    this.precio = precio; // <-- ASIGNAMOS EL PRECIO
  }
}