import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class TrabajadorGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    // Solo el Admin, Veterinario y Trabajador pueden entrar a agendar
    if (this.authService.tieneRol(['Admin', 'Veterinario', 'Trabajador'])) {
      return true;
    }
    // Si es cliente, lo pateamos a su historial
    alert('Para agendar una cita, por favor comunícate con recepción.');
    this.router.navigate(['/historial']);
    return false;
  }
}