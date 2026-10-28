export type Rol = 'Admin' | 'Veterinario' | 'Cliente';

export interface Usuario {
  username: string;
  password?: string;
  rol: Rol;
  nombre: string;
  dni?: string; // <-- Agregamos esta línea
}