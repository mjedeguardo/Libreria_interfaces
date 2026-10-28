import { Injectable } from '@angular/core';
import { Usuario, Rol } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Usuarios simulados (Base de datos)
  private usuarios: Usuario[] = [
    { username: 'admin', password: '123', rol: 'Admin', nombre: 'Administrador' },
    { username: 'veterinario', password: '123', rol: 'Veterinario', nombre: 'Dr. Pérez' },
    
    // CLIENTES (Agregamos el DNI para que se autocomplete en el formulario)
    { username: 'cliente', password: '123', rol: 'Cliente', nombre: 'Juan Dueño', dni: '12345678' },
    { username: 'maria', password: '123', rol: 'Cliente', nombre: 'María López', dni: '87654321' },
    { username: 'carlos', password: '123', rol: 'Cliente', nombre: 'Carlos Ruiz', dni: '11223344' }
  ];

  private usuarioLogueado: Usuario | null = null;

  constructor() {
    // Recuperar sesión si recarga la página
    const sesion = localStorage.getItem('vet_sesion');
    if (sesion) {
      this.usuarioLogueado = JSON.parse(sesion);
    }
  }

  login(username: string, password: string): boolean {
    const user = this.usuarios.find(u => u.username === username && u.password === password);
    if (user) {
      this.usuarioLogueado = user;
      localStorage.setItem('vet_sesion', JSON.stringify(user));
      return true;
    }
    return false;
  }

  logout() {
    this.usuarioLogueado = null;
    localStorage.removeItem('vet_sesion');
  }

  getUsuarioActual(): Usuario | null {
    return this.usuarioLogueado;
  }

  // Método para verificar roles fácilmente
  tieneRol(rolesPermitidos: Rol[]): boolean {
    if (!this.usuarioLogueado) return false;
    return rolesPermitidos.includes(this.usuarioLogueado.rol);
  }
}