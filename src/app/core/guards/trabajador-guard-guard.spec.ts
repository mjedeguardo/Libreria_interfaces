import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';
import { trabajadorGuardGuard } from './trabajador-guard-guard';

describe('trabajadorGuardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => trabajadorGuardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
