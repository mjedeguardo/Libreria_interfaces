import { Injectable } from '@angular/core';
import { Usuario, Rol } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Usuarios base del sistema (Admin, Vet, Recepcionista)
  private usuariosBase: Usuario[] = [
    { username: 'admin', password: '123', rol: 'Admin', nombre: 'Administrador' },
    { username: 'veterinario', password: '123', rol: 'Veterinario', nombre: 'Dr. Pérez' },
    { username: 'trabajador', password: '123', rol: 'Trabajador', nombre: 'Recepcionista' }
  ];

  private usuarioLogueado: Usuario | null = null;

  constructor() {
    this.cargarSesion();
  }

  // Obtiene todos los usuarios (Base + los creados por el recepcionista)
  private getUsuarios(): Usuario[] {
    const clientesGuardados = localStorage.getItem('vet_clientes');
    const clientes = clientesGuardados ? JSON.parse(clientesGuardados) : [];
    return [...this.usuariosBase, ...clientes];
  }

  // MÉTODO NUEVO: El recepcionista crea la cuenta del cliente
  registrarCliente(dni: string, nombre: string, password: string): boolean {
    const usuarios = this.getUsuarios();
    // Validar si el DNI ya existe
    if (usuarios.find(u => u.username === dni)) {
      return false; 
    }
    
    const nuevoCliente: Usuario = {
      username: dni, // El DNI será su usuario
      password: password,
      rol: 'Cliente',
      nombre: nombre,
      dni: dni
    };

    // Guardamos en la "base de datos" de clientes
    const clientesGuardados = localStorage.getItem('vet_clientes');
    const clientes = clientesGuardados ? JSON.parse(clientesGuardados) : [];
    clientes.push(nuevoCliente);
    localStorage.setItem('vet_clientes', JSON.stringify(clientes));
    
    return true;
  }

  login(username: string, password: string): boolean {
    const user = this.getUsuarios().find(u => u.username === username && u.password === password);
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

  private cargarSesion() {
    const sesion = localStorage.getItem('vet_sesion');
    if (sesion) {
      this.usuarioLogueado = JSON.parse(sesion);
    }
  }

  tieneRol(rolesPermitidos: Rol[]): boolean {
    if (!this.usuarioLogueado) return false;
    return rolesPermitidos.includes(this.usuarioLogueado.rol);
  }
}