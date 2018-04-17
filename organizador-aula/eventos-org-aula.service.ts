import { Injectable, EventEmitter } from '@angular/core';
import { Mensaje } from './organizador-aula/utils/Mensajes';
import { ListaEntidad } from './organizador-aula/modelos/lista-entidad';

@Injectable()
export class EventosOrgAulaService {
  mensajes: EventEmitter<Mensaje>;
  confirmacion: EventEmitter<boolean>;
  clickEntidad: EventEmitter<ListaEntidad>;
  constructor() {
    this.mensajes = new EventEmitter<Mensaje>();
    this.confirmacion = new EventEmitter<boolean>();
    this.clickEntidad = new EventEmitter<ListaEntidad>();
   }

}
