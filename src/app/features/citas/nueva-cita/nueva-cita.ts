import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ClinicaService } from '../../../core/services/clinica.service';
import { AuthService } from '../../../core/services/auth.service'; 
import { Mascota, Especie } from '../../../core/models/mascota.model';
import { Cita } from '../../../core/models/cita.model';

@Component({
  selector: 'app-nueva-cita',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './nueva-cita.html',
  styleUrls: ['./nueva-cita.css']
})
export class NuevaCitaComponent implements OnInit {
  citaForm: FormGroup;
  especies = Object.values(Especie);
  doctores = ['Dr. Pérez (Medicina General)', 'Dra. Gómez (Cirugía)', 'Dr. Ruiz (Dermatología)'];

  constructor(private clinicaService: ClinicaService, private router: Router, public authService: AuthService) {
    this.citaForm = new FormGroup({
      duenoDni: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{8}$')]),
      duenoNombre: new FormControl('', Validators.required),
      duenoCorreo: new FormControl('', [Validators.required, Validators.email]), 
      duenoTelefono: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+$')]),
      contrasenaCliente: new FormControl('', [Validators.minLength(6), Validators.maxLength(12)]),
      mascotaNombre: new FormControl('', [Validators.required, Validators.minLength(2)]),
      especie: new FormControl('', Validators.required),
      edad: new FormControl('', [Validators.required, Validators.min(0)]),
      doctor: new FormControl('', Validators.required),
      motivo: new FormControl('', [Validators.required, Validators.minLength(5)]),
      fechaHora: new FormControl('', Validators.required)
    });
  }

  ngOnInit(): void {
    const user = this.authService.getUsuarioActual();
    if (user && user.rol === 'Cliente') {
      this.citaForm.patchValue({
        duenoDni: user.dni,
        duenoNombre: user.nombre
      });
    }
  }

  buscarPorDni() {
    const dni = this.citaForm.get('duenoDni')?.value;
    if (dni && dni.length === 8) {
      const cliente = this.clinicaService.buscarCliente(dni);
      if (cliente) {
        this.citaForm.patchValue({
          duenoNombre: cliente.nombre,
          duenoCorreo: cliente.correo,
          duenoTelefono: cliente.telefono
        });
      }
    }
  }

  // NUEVO MÉTODO: Calcula el precio según el motivo de la consulta
  calcularPrecio(motivo: string): number {
    const mot = motivo.toLowerCase();
    if (mot.includes('cirugia') || mot.includes('cirugía') || mot.includes('operacion')) return 200;
    if (mot.includes('vacuna') || mot.includes('vacunacion')) return 80;
    if (mot.includes('emergencia') || mot.includes('urgencia')) return 150;
    return 50; // Precio base de consulta general
  }

  agendar() {
    if (this.citaForm.valid) {
      const form = this.citaForm.value;
      const fechaCita = new Date(form.fechaHora);

      // Validaciones
      if (!this.clinicaService.horarioDisponible(fechaCita)) {
        alert('El horario seleccionado no está disponible. Recuerda: Lunes a Sábado de 9:00 a 20:00 y sin repetir la hora.');
        return;
      }

      if (!this.clinicaService.puedeAgendarMasCitas(form.duenoDni, fechaCita)) {
        alert('Límite alcanzado: Un cliente no puede tener más de 3 citas agendadas para el mismo día.');
        return;
      }

      // LÓGICA NUEVA: Si el recepcionista escribió una contraseña, creamos la cuenta del cliente
      if (form.contrasenaCliente && form.contrasenaCliente.trim() !== '') {
        const creado = this.authService.registrarCliente(form.duenoDni, form.duenoNombre, form.contrasenaCliente);
        if (!creado) {
          console.log('El cliente ya tenía una cuenta registrada.'); 
        } else {
          console.log('Cuenta de cliente creada con éxito.');
        }
      }

      // Guardar cliente en la base de datos de la clínica (para historial)
      this.clinicaService.guardarCliente({
        dni: form.duenoDni,
        nombre: form.duenoNombre,
        correo: form.duenoCorreo,
        telefono: form.duenoTelefono
      });

      const nuevaMascota = new Mascota(
        Date.now().toString(),
        form.mascotaNombre,
        form.especie,
        form.edad,
        { nombre: form.duenoNombre, telefono: form.duenoTelefono }
      );
      this.clinicaService.agregarMascota(nuevaMascota);

      // Calculamos el precio antes de crear la cita
      const precioCalculado = this.calcularPrecio(form.motivo);

      const nuevaCita = new Cita(
        Date.now().toString(),
        nuevaMascota,
        fechaCita,
        form.motivo,
        form.doctor,
        precioCalculado // <-- Pasamos el precio calculado
      );
      
      this.clinicaService.agregarCita(nuevaCita);
      alert('¡Cita agendada con éxito!');
      this.router.navigate(['/historial']); 
    } else {
      alert('Por favor completa todos los campos correctamente.');
    }
  }
}