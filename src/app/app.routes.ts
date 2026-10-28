import { Routes } from '@angular/router';
import { RegistroMascotaComponent } from './features/mascotas/registro-mascota/registro-mascota';
import { AgendaComponent } from './features/citas/agenda/agenda';
import { HistorialComponent } from './features/mascotas/historial/historial';
import { LoginComponent } from './features/auth/login/login';
import { AuthGuard } from './core/guards/auth-guard';
import { NuevaCitaComponent } from './features/citas/nueva-cita/nueva-cita'; 

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'mascotas', component: RegistroMascotaComponent, canActivate: [AuthGuard] },
  { path: 'citas', component: AgendaComponent, canActivate: [AuthGuard] },
  { path: 'nueva-cita', component: NuevaCitaComponent, canActivate: [AuthGuard] }, // <-- NUEVA RUTA
  { path: 'historial', component: HistorialComponent, canActivate: [AuthGuard] }
];