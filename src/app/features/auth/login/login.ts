import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

    ingresar() {
    if (this.authService.login(this.username, this.password)) {
      const user = this.authService.getUsuarioActual();
      
      // Redirigimos según el rol del usuario
      if (user?.rol === 'Cliente') {
        this.router.navigate(['/historial']); 
      } else if (user?.rol === 'Trabajador') {
        this.router.navigate(['/trabajador']); // <-- Redirige al nuevo panel
      } else {
        this.router.navigate(['/citas']); // Admin y Veterinario van a la agenda
      }
      
    } else {
      this.error = 'Usuario o contraseña incorrectos';
    }
  }
}