// Agrega 'Trabajador' a la lista
export type Rol = 'Admin' | 'Veterinario' | 'Trabajador' | 'Cliente';

export interface Usuario {
  username: string;
  password?: string;
  rol: Rol;
  nombre: string;
  dni?: string; 
}