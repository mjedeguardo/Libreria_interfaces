import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appResaltarProxima]',
  standalone: true
})
export class ResaltarProximaDirective implements OnInit {
  @Input() appResaltarProxima!: Date;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    const hoy = new Date();
    const fechaCita = new Date(this.appResaltarProxima);
    if (fechaCita.toDateString() === hoy.toDateString()) {
      this.el.nativeElement.classList.add('cita-hoy'); 
    }
  }
}