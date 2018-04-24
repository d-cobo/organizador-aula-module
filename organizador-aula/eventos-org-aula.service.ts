import { Injectable, EventEmitter } from '@angular/core';
import { Mensaje } from './modelos/mensajes.modelo';
import { ListaEntidad } from './modelos/lista-entidad.modelo';
import { Botones } from './modelos/configuracion-organizador.modelo';

@Injectable()
//Servicio para el módulo; simplemente son EventEmitters para la comunicación con el exterior del módulo
//y entre los diferentes componentes
export class EventosOrgAulaService {
  mensajes: EventEmitter<Mensaje>; //mensajes con tipo/codigo
  confirmacion: EventEmitter<boolean>;  //emitter para confirmaciones
  clickEntidad: EventEmitter<ListaEntidad>; //emitter para emitir datos de una entidad al clicarla
  clickBoton: EventEmitter<Botones>; //para "hacer click" en un boton desde fuera del modulo (cambiar pantallas, guardar...)
  cambioTamano: EventEmitter<[number, number]>; //para cambiar el tamaño del tablero desde fuera del módulo
  constructor() {
    this.mensajes = new EventEmitter<Mensaje>();
    this.confirmacion = new EventEmitter<boolean>();
    this.clickEntidad = new EventEmitter<ListaEntidad>();
    this.clickBoton = new EventEmitter<Botones>();
    this.cambioTamano = new EventEmitter<[number, number]>();
   }

   pulsarBoton(boton: Botones): void{  
      this.clickBoton.emit(boton);
   }

}
