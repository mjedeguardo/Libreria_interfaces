import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ClinicaService } from '../../../core/services/clinica.service';
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

  constructor(private clinicaService: ClinicaService, private router: Router) {
    this.citaForm = new FormGroup({
      // Datos Dueño
      duenoDni: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{8}$')]),
      duenoNombre: new FormControl('', Validators.required),
      duenoCorreo: new FormControl('', [Validators.required, Validators.email]), 
      duenoTelefono: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+$')]),
      // Datos Mascota
      mascotaNombre: new FormControl('', [Validators.required, Validators.minLength(2)]),
      especie: new FormControl('', Validators.required),
      edad: new FormControl('', [Validators.required, Validators.min(0)]),
      // Datos Cita
      doctor: new FormControl('', Validators.required),
      motivo: new FormControl('', [Validators.required, Validators.minLength(5)]),
      fechaHora: new FormControl('', Validators.required)
    });
  }

  ngOnInit(): void {}

  // Método que se ejecuta al salir del input DNI
  buscarPorDni() {
    const dni = this.citaForm.get('duenoDni')?.value;
    // Validamos que el DNI tenga exactamente 8 dígitos para buscar
    if (dni && dni.length === 8) {
      const cliente = this.clinicaService.buscarCliente(dni);
      if (cliente) {
        // Autocompletamos los campos con los datos encontrados
        this.citaForm.patchValue({
          duenoNombre: cliente.nombre,
          duenoCorreo: cliente.correo,
          duenoTelefono: cliente.telefono
        });
      }
    }
  }
  agendar() {
    if (this.citaForm.valid) {
      const form = this.citaForm.value;
      const fechaCita = new Date(form.fechaHora);

      // 1. Validar disponibilidad de horario (Lunes a Viernes, sin choques)
      if (!this.clinicaService.horarioDisponible(fechaCita)) {
        alert('El horario seleccionado no está disponible. Recuerda: Lunes a Viernes de 8:00 a 18:00 y sin repetir la hora.');
        return;
      }

      // 2. NUEVA VALIDACIÓN: Límite de 3 citas por día por DNI
      if (!this.clinicaService.puedeAgendarMasCitas(form.duenoDni, fechaCita)) {
        alert('Límite alcanzado: Un cliente no puede tener más de 3 citas agendadas para el mismo día.');
        return; // Detenemos el proceso si ya tiene 3
      }

      // 3. Guardar al Dueño (Cliente) para futuras citas
      this.clinicaService.guardarCliente({
        dni: form.duenoDni,
        nombre: form.duenoNombre,
        correo: form.duenoCorreo,
        telefono: form.duenoTelefono
      });

      // 4. Crear y guardar la mascota
      const nuevaMascota = new Mascota(
        Date.now().toString(),
        form.mascotaNombre,
        form.especie,
        form.edad,
        { nombre: form.duenoNombre, telefono: form.duenoTelefono }
      );
      this.clinicaService.agregarMascota(nuevaMascota);

      // 5. Crear y guardar la cita
      const nuevaCita = new Cita(
        Date.now().toString(),
        nuevaMascota,
        fechaCita,
        form.motivo,
        form.doctor
      );
      
      this.clinicaService.agregarCita(nuevaCita);
      alert('¡Cita agendada con éxito!');
      
      // Redirigir al historial
      this.router.navigate(['/historial']); 
    } else {
      alert('Por favor completa todos los campos correctamente.');
    }
  }
}
