import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ClinicaService } from '../../../core/services/clinica.service';
import { Mascota, Especie } from '../../../core/models/mascota.model';

@Component({
  selector: 'app-registro-mascota',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registro-mascota.html', // <-- OJO: Aquí dice registro-mascota.html
  styleUrls: ['./registro-mascota.css']    // <-- OJO: Aquí dice registro-mascota.css
})
export class RegistroMascotaComponent {
  mascotaForm: FormGroup;
  especies = Object.values(Especie);

  constructor(private clinicaService: ClinicaService){
    this.mascotaForm = new FormGroup({
      nombre: new FormControl('', [Validators.required, Validators.minLength(3)]),
      especie: new FormControl('', Validators.required),
      duenoNombre: new FormControl('', Validators.required),
      duenoTelefono: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+$')])
    });
  }

    guardarMascota() {
    if (this.mascotaForm.valid) {
      const form = this.mascotaForm.value;
      const nuevaMascota = new Mascota(
        Date.now().toString(),
        form.nombre,
        form.especie,
        1, // <-- Agregamos la edad (aquí puedes poner un 1 fijo)
        { nombre: form.duenoNombre, telefono: form.duenoTelefono }
      );
      this.clinicaService.agregarMascota(nuevaMascota);
      alert('Mascota registrada con éxito!');
      this.mascotaForm.reset();
    }
  }
}