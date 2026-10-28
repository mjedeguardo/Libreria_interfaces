import { TestBed } from '@angular/core/testing';
import { ClinicaService } from './clinica.service'; // <-- Ahora dice ClinicaService

describe('ClinicaService', () => {
  let service: ClinicaService; // <-- Ahora dice ClinicaService

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClinicaService); // <-- Ahora dice ClinicaService
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});