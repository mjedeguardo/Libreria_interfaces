import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-panel-trabajador',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './panel-trabajador.html',
  styleUrls: ['./panel-trabajador.css']
})
export class PanelTrabajadorComponent {
  constructor(public authService: AuthService) {}
}