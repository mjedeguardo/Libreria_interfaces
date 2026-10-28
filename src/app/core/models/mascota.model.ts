export enum Especie {
  Perro = 'Perro',
  Gato = 'Gato',
  Ave = 'Ave',
  Otro = 'Otro'
}

export interface Dueno {
  nombre: string;
  telefono: string;
}

export class Mascota {
  id: string;
  nombre: string;
  especie: Especie;
  edad: number; 
  dueno: Dueno;
  historial: string[]; 

  constructor(id: string, nombre: string, especie: Especie, edad: number, dueno: Dueno) {
    this.id = id;
    this.nombre = nombre;
    this.especie = especie;
    this.edad = edad;
    this.dueno = dueno;
    this.historial = [];
  }
}