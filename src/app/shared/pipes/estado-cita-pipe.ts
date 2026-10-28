import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'estadoCita',
  standalone: true
})
export class EstadoCitaPipe implements PipeTransform {
  transform(value: string): string {
    if (value === 'Pendiente') return 'estado-pendiente';
    if (value === 'Atendida') return 'estado-atendida';
    if (value === 'Cancelada') return 'estado-cancelada';
    return '';
  }
}