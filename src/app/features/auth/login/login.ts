import { Component, OnInit } from '@angular/core';
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
export class LoginComponent implements OnInit {
  username = '';
  password = '';
  error = '';

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.redirigirSiEstaLogueado();
  }

  redirigirSiEstaLogueado() {
    const user = this.authService.getUsuarioActual();
    if (user) {
      if (user.rol === 'Cliente') this.router.navigate(['/historial']); 
      else if (user.rol === 'Trabajador') this.router.navigate(['/trabajador']); 
      else if (user.rol === 'Admin') this.router.navigate(['/admin']); 
      else this.router.navigate(['/citas']); 
    }
  }

  ingresar() {
    if (this.authService.login(this.username, this.password)) {
      this.redirigirSiEstaLogueado();
    } else {
      this.error = 'Usuario o contraseña incorrectos';
    }
  }
}