import { Mascota } from './mascota.model';

describe('Mascota', () => {
  it('should create an instance', () => {
   //Pasando argumentos al Constructor de la clase Mascota para crear una instancia de la misma
    const mascota = new Mascota('1', 'Firulais', 'Perro' as any, 3, { nombre: 'Juan', telefono: '123' });
    expect(mascota).toBeTruthy();
  });
});