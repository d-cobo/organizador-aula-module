import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ListaElemento } from '../../modelos/lista-elementos';

@Component({
  selector: 'app-nuevo-elemento',
  templateUrl: './nuevo-elemento.component.html',
  styleUrls: ['./nuevo-elemento.component.less']
})
export class NuevoElementoComponent implements OnInit {
  nuevoElemento: ListaElemento;
  displayNuevoElemento = true;
  @Output('elemento') elemento: EventEmitter<ListaElemento> = new EventEmitter<ListaElemento>();
  constructor() {
    this.nuevoElemento = {id:"", nombre:"", color:"#0000bb", ancho:1, alto:1, maxEntidades: 1};
   }

  ngOnInit() {
  }

  crearNuevoElemento(){
    if(this.nuevoElemento.nombre==="" || this.nuevoElemento.ancho<=0 || this.nuevoElemento.alto<=0){
      return;
    }
    this.nuevoElemento.id=this.nuevoElemento.nombre;
    this.elemento.emit(this.nuevoElemento);
  }

}
