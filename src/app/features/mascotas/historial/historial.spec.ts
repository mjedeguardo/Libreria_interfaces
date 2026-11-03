import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistorialComponent } from './historial'; // <-- Cambiado a HistorialComponent

describe('HistorialComponent', () => {
  let component: HistorialComponent;
  let fixture: ComponentFixture<HistorialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistorialComponent] // <-- Cambiado a HistorialComponent
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HistorialComponent); // <-- Cambiado a HistorialComponent
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});