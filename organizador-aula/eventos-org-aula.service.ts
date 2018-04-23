import { Injectable, EventEmitter } from '@angular/core';
import { Mensaje } from './modelos/mensajes.modelo';
import { ListaEntidad } from './modelos/lista-entidad.modelo';

@Injectable()
export class EventosOrgAulaService {
  mensajes: EventEmitter<Mensaje>;
  confirmacion: EventEmitter<boolean>;  
  clickEntidad: EventEmitter<ListaEntidad>;
  clickBoton: EventEmitter<number>;
  cambioTamano: EventEmitter<[number, number]>;
  constructor() {
    this.mensajes = new EventEmitter<Mensaje>();
    this.confirmacion = new EventEmitter<boolean>();
    this.clickEntidad = new EventEmitter<ListaEntidad>();
    this.clickBoton = new EventEmitter<number>();
    this.cambioTamano = new EventEmitter<[number, number]>();
   }

   pulsarBoton(boton: number): void{
     console.log("boton ", boton )
      this.clickBoton.emit(boton);
   }

}
